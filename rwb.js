//
// Global state
//
// map     - the map object
// usermark- marks the user's position on the map
// markers - list of markers on the current map (not including the user position)
// 
//

//
// First time run: request current location, with callback to Start
//

if (navigator.geolocation)  {
    navigator.geolocation.getCurrentPosition(Start);
}


function UpdateMapById(id, tag) {
    var target = document.getElementById(id);
    var data = target.innerHTML;

    if (tag == "COMMITTEE"){
        var rows  = data.split("\n");
        for (i in rows) {
            var cols  = rows[i].split("\t");
            var lat   = cols[0];
            var long  = cols[1];
            var party = cols[3];

            // Showing different markers for different parties
            var markerFile;
            if (party == "DEM")
                markerFile = 'img/comm_blue.png';
            else if (party == "REP")
                markerFile = 'img/comm_red.png';
            else
                markerFile = 'img/Other_comm2.png';
            var image = {
                url: markerFile,
                size: new google.maps.Size(20, 32),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(0, 32)
            };
    
            markers.push(new google.maps.Marker({ map:map,
                         position: new google.maps.LatLng(lat,long),
                         icon:image,
                         title: tag+"\n"+cols.join("\n")}));    
        }
    }
     
    if (tag == "CANDIDATE"){
    
        var rows  = data.split("\n");
        for (i in rows) {
            var cols  = rows[i].split("\t");
            var lat   = cols[0];
            var long  = cols[1];
            var party = cols[3];
            var markerFile;
            if (party == "DEM")
                markerFile = 'img/cand_blue.png';
            else if (party == "REP")
                markerFile = 'img/cand_red.png';
            else
                markerFile = 'img/cand_green.png';
            var image = {
                url: markerFile,
                size: new google.maps.Size(30, 42),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 32)
            };

            markers.push(new google.maps.Marker({ map:map,
                         position: new google.maps.LatLng(lat,long),
                         icon:image,
                         title: tag+"\n"+cols.join("\n")}));    
        }
    }
    
    if (tag == "INDIVIDUAL"){
        var rows  = data.split("\n");

        for (i in rows) {
            var cols  = rows[i].split("\t");
            var lat   = cols[0];
            var long  = cols[1];

            var image = {
                url: 'img/individual.png',
                size: new google.maps.Size(20, 32),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 32)
            };
            markers.push(new google.maps.Marker({ map:map,
                         position: new google.maps.LatLng(lat,long),
                         icon:image,
                         title: tag+"\n"+cols.join("\n")}));    
        }
    }
    
    if (tag == "OPINION"){
        var rows  = data.split("\n");
        for (i in rows) {
            var cols  = rows[i].split("\t");
            var lat   = cols[0];
            var long  = cols[1];
            var image = {
                url: 'img/opinion_green.png',
                size: new google.maps.Size(20, 32),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(0, 32)
            };    
            markers.push(new google.maps.Marker({ map:map,
                         position: new google.maps.LatLng(lat,long),
                         icon:image,
                         title: tag+"\n"+cols.join("\n")}));    
        }
    }
    

}

function ClearMarkers()
{
    // clear the markers
    while (markers.length>0) { 
    markers.pop().setMap(null);
    }
}


function UpdateMap()
{
    var color = document.getElementById("color");
    
    color.innerHTML="<b><blink>Updating Display...</blink></b>";
    color.style.backgroundColor='white';

    ClearMarkers();
    
    // Capture the selections from the checkbox
    var selected = [];
    $("input:checkbox[name=options]:checked").each(function() {
       selected.push($(this).val());
    });

    if ($.inArray("committees", selected)>-1) {
      UpdateMapById("committee_data","COMMITTEE");
    };
    if ($.inArray("candidates", selected)>-1) {
      UpdateMapById("candidate_data","CANDIDATE");
    };
    if ($.inArray("individuals", selected)>-1) {
      UpdateMapById("individual_data", "INDIVIDUAL");
    };
    if ($.inArray("opinions", selected)>-1) {
      UpdateMapById("opinion_data","OPINION");
    };


    color.innerHTML="Ready";
    
    if (Math.random()>0.5) { 
    color.style.backgroundColor='blue';
    } else {
    color.style.backgroundColor='red';
    }

}


function NewData(data)
{
  var target = document.getElementById("data");
  
  target.innerHTML = data;

  UpdateMap();

}

// NewCalc is used to parse the aggregated view
// and color the nunmbers
function NewCalc(calc)
{
  var target = document.getElementById("calc");
  
  var matches = calc.match(/<div>([\s\S]*?)<\/div>/);
  target.innerHTML = matches[1];
  
  var avg = document.getElementById("opAvg");
  var pty = parseFloat(avg.innerText)
  if (pty > 0) {
      avg.style.backgroundColor = 'blue';
      avg.style.color = 'white';
  } else if (pty < 0) {
      avg.style.backgroundColor = 'red';
      avg.style.color = 'white';
  } else {
      avg.style.backgroundColor = 'white';
      avg.style.color = 'black';
  }
}

function ViewShift()
{
    var bounds = map.getBounds();

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var color = document.getElementById("color");
    var calc = document.getElementById("calc");

    var cyclenum = $("#cycles").val();
   
    var selected = []; 
    $(".checkbox:checked").each(function() {
        selected.push($(this).val());
    });

    var whatselected = selected.join();
    console.log(whatselected);

    color.innerHTML="<b><blink>Querying...("+ne.lat()+","+ne.lng()+") to ("+sw.lat()+","+sw.lng()+")</blink></b>";
    color.style.backgroundColor='white';
   
    // debug status flows through by cookie
    var d1 = $.get("rwb.pl?act=near&latne="+ne.lat()+"&longne="+ne.lng()+"&latsw="+sw.lat()+"&longsw="+sw.lng()+"&format=raw&cycle="+cyclenum+"&what="+whatselected+"&calc=0", NewData);
    $.when(d1).done(function() {
        if (whatselected) {
            calc.innerHTML="<b><blink>Generating Summary...</blink></b>";
        }
    
        // Pass the progressive geolocations to the aggregated view calculation
        var latlng = [];
        if (isInArray(selected, "committees")) {
          var comNewLoc = document.getElementById("comNewLoc").innerHTML.split(',');
          latlng = comNewLoc;
        }
        if (isInArray(selected, "individuals")) {
          var indNewLoc = document.getElementById("indNewLoc").innerHTML.split(',');
          if (indNewLoc[0] > latlng[0] || latlng.length < 1) {
              latlng = indNewLoc;
          }
        }
        if (isInArray(selected, "opinions")) {
          var opNewLoc = document.getElementById("opNewLoc").innerHTML.split(',');
          if (opNewLoc[0] > latlng[0] || latlng.length < 1) {
              latlng = opNewLoc;
          }
        }
    
        // Request an anggregated view when param('calc') = 1
        $.get("rwb.pl?act=near&latne="+latlng[0]+"&longne="+latlng[1]+"&latsw="+latlng[2]+"&longsw="+latlng[3]+"&format=raw&cycle="+cyclenum+"&what="+whatselected+"&calc=1", NewCalc);
    });


}

// Function to judge if str is in the array
// From http://stackoverflow.com/questions/237104/array-containsobj-in-javascript
function isInArray(arr, str)
{
    return arr.indexOf(str) >= 0 ? true : false;
}

function Reposition(pos)
{
    var lat=pos.coords.latitude;
    var long=pos.coords.longitude;

    map.setCenter(new google.maps.LatLng(lat,long));
    usermark.setPosition(new google.maps.LatLng(lat,long));
}


function Start(location) 
{
    var lat = location.coords.latitude;
    var long = location.coords.longitude;
    var acc = location.coords.accuracy;
    
    var mapc = $( "#map");
  
    map = new google.maps.Map(mapc[0], 
                  { zoom:16, 
                  center:new google.maps.LatLng(lat,long),
                  mapTypeId: google.maps.MapTypeId.HYBRID
                  } );
  
    usermark = new google.maps.Marker({ map:map,
                          position: new google.maps.LatLng(lat,long),
                          title: "You are here"});
  
    markers = new Array;
  
    var color = document.getElementById("color");
    color.style.backgroundColor='white';
    color.innerHTML="<b><blink>Waiting for first position</blink></b>";
  
    google.maps.event.addListener(map,"bounds_changed",ViewShift);
    google.maps.event.addListener(map,"center_changed",ViewShift);
    google.maps.event.addListener(map,"zoom_changed",ViewShift);
    
    // Listener for CONFIRM button
    var confirmButton = document.getElementById('confirmButton');
    confirmButton.addEventListener('click',ViewShift);
    
    navigator.geolocation.watchPosition(Reposition);
}


