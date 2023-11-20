//CURRENTLY UNUSED


mapboxgl.accessToken = 'pk.eyJ1IjoiZXBlcGZuc2kiLCJhIjoiY2twbTVucTQ4MDMyeTJ2bXdsY2MycXdqcCJ9.7QUEQY0twzum7tRYNNOsgQ';


function displayMap(){
            var map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [138.6, -34.92], // starting position [lng, lat]
            zoom: 10 // starting zoom
            });
            addMarkers();
            for(i = 0; i < markerArray.length; i++){
                  markerArray[i].addTo(map);
                } //display markers on the map
}

var markerArray = [];

function addMarkers(){
              var marker = new mapboxgl.Marker().setLngLat([138.6, -34.92]);//.addTo(map); //marker on map using longitude and latitude
              markerArray.push(marker);
              var marker2 = new mapboxgl.Marker({ color: 'red' }).setLngLat([139, -35.5]); //red marker for hotspots
              markerArray.push(marker2);
}


/*var geojson = {
'type': 'FeatureCollection',
'features': [
    {'type': 'Feature',
     'geometry': {
     'type': 'Point',
     'coordinates': [138.6, -34.92]},
    'properties': {
    'title': 'Venue-name',
    'description': 'Washington, D.C.'}
},]
};

geojson.features.forEach(function (marker) {
// create a HTML element for each feature
    var el = document.createElement('div');
    el.className = 'marker';

    // make a marker for each feature and add it to the map
    new mapboxgl.Marker(el).setLngLat(marker.geometry.coordinates).setPopup(
    new mapboxgl.Popup({ offset: 25 }) // add popups
    .setHTML( '<h3>' + marker.properties.title + '</h3><p>' + marker.properties.description + '</p>')).addTo(map);
});*/