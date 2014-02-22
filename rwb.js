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
//var totalIndMoney;

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
		var markerFile;
		if (party == "DEM")
		markerFile = 'img/Blue_comm.png';
		else if (party == "REP")
		markerFile = 'img/Red_comm.png';
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
		origin: new google.maps.Point(0,0),
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
	//totalIndMoney = 0;

	for (i in rows) {
	var cols  = rows[i].split("\t");
	var lat   = cols[0];
	var long  = cols[1];
	//if (!isNaN(parseInt(cols[7])))
	//totalIndMoney = totalIndMoney + parseInt(cols[7]);
 	var image = {
	url: 'img/Individual.png',
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
	
	if (tag == "OPINION"){
	var rows  = data.split("\n");
	for (i in rows) {
	var cols  = rows[i].split("\t");
	var lat   = cols[0];
	var long  = cols[1];
 	var image = {
	url: 'img/Green_opinion.png',
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
    
    var selected = [];
    $("input:checkbox[name=options]:checked").each(function() {
       selected.push($(this).val());
    });

    console.log(selected);

    if ($.inArray("committees", selected)>-1) {
      UpdateMapById("committee_data","COMMITTEE");
	  //ViewShift();
      //console.log('committee is selected');
    };
    if ($.inArray("candidates", selected)>-1) {
      UpdateMapById("candidate_data","CANDIDATE");
      //console.log('candidate is selected');
    };
    if ($.inArray("individuals", selected)>-1) {
      UpdateMapById("individual_data", "INDIVIDUAL");
      //console.log('individual is selected');
    };
    if ($.inArray("opinions", selected)>-1) {
      UpdateMapById("opinion_data","OPINION");
      //console.log('opinion is selected');
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

function ViewShift()
{
    var bounds = map.getBounds();

    var ne = bounds.getNorthEast();
    var sw = bounds.getSouthWest();

    var color = document.getElementById("color");

    var cyclenum = $("#cycles").val();
   
    var selected = []; 
    $("input:checkbox[name=options]:checked").each(function() {
      selected.push($(this).val());
    });
    var whatselected = selected.join();
    console.log(whatselected);

    color.innerHTML="<b><blink>Querying...("+ne.lat()+","+ne.lng()+") to ("+sw.lat()+","+sw.lng()+")</blink></b>";
    color.style.backgroundColor='white';
   
    // debug status flows through by cookie
    //$.get("rwb.pl?act=near&indMoney="+totalIndMoney+"&latne="+ne.lat()+"&longne="+ne.lng()+"&latsw="+sw.lat()+"&longsw="+sw.lng()+"&format=raw&cycle="+cyclenum+"&what="+whatselected, NewData);
    $.get("rwb.pl?act=near&latne="+ne.lat()+"&longne="+ne.lng()+"&latsw="+sw.lat()+"&longsw="+sw.lng()+"&format=raw&cycle="+cyclenum+"&what="+whatselected, NewData);
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
  
  var confirmButton = document.getElementById('confirmButton');
  confirmButton.addEventListener('click',ViewShift);
  
  navigator.geolocation.watchPosition(Reposition);

}


