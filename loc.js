function findPosition()
{
  navigator.geolocation.getCurrentPosition(successLoc, errorLoc, {timeout:10000, enableHighAccuracy:true});
}

function successLoc(location) 
{
  document.getElementById('lat').value = location.coords.latitude;
  document.getElementById('long').value = location.coords.longitude;
}

function errorLoc() 
{
}
