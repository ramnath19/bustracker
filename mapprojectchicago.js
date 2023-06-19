
var map;
var markers = [];

// Initialize the map
function initMap() {
  var myOptions = {
    zoom: 13,
    center: { lat: 41.8781, lng: -87.6100 },
    // mapTypeId: google.maps.MapTypeId.TERRAIN,
    mapId: '5950e50576297c6d'
  };

  map = new google.maps.Map(document.getElementById("map"), myOptions);
  addMarkers();
}

// Add bus markers to the map
async function addMarkers() {
  // Get bus data
  var locations = await getbusLocations();

  // Loop through data and add bus markers
  locations.forEach(function (bus) {
    var marker = getMarker(bus.id);
    if (marker) {
      moveMarker(marker, bus);
    } else {
      addMarker(bus);
    }
  });

  // Timer
  console.log(new Date());
  setTimeout(addMarkers, 15000);
}

// Request bus data from MTA
// Request bus data from MBTA
async function getBusLocations(){
var url = 'http://localhost:8080/bustime/api/v3/getrtpidatafeeds?key=3vqWDSrvfpWtWNZHHarAQi47J';	
var response = await fetch(url);
var json     = await response.json();
return json.data;
}

function addMarker(bus) {
  var icon = getIcon(bus);
  var marker = new google.maps.Marker({
    position: {
      lat: bus.attributes.latitude,
      lng: bus.attributes.longitude,
    },
    map: map,
    icon: icon,
    id: bus.id,
  });
  markers.push(marker);
}

function getIcon(bus) {
  // Select icon based on bus direction
  if (bus.attributes.direction_id === 0) {
    return "red.png";
  }
  return "violet.png";
}

function moveMarker(marker, bus) {
  // Change icon if bus has changed direction
  var icon = getIcon(bus);
  marker.setIcon(icon);

  // Move marker to new lat/lon
  marker.setPosition({
    lat: bus.attributes.latitude,
    lng: bus.attributes.longitude,
  });
}

function getMarker(id) {
  var marker = markers.find(function (item) {
    return item.id === id;
  });
  return marker;
}

// Call the initMap function once the Google Maps API is loaded
window.onload = function () {
  initMap();
};