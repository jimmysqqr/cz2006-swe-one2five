var map;

function haversine_distance(mk1, mk2) {
    var R = 6371.0710; // Radius of the Earth in km
    var rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
    var rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
    var difflat = rlat2-rlat1; // Radian difference (latitudes)
    var difflng = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

    var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflng/2)*Math.sin(difflng/2)));
    return d;
}

function initMap() {
    const center = { lat: 1.352, lng: 103.813 };
    map = new google.maps.Map(
        document.getElementById('map'), {
        zoom: 11,
        center: center
    });

    const home = { lat: 1.456, lng: 103.813 };
    const orchard = { lat: 1.302, lng: 103.856 };

    var mk1 = new google.maps.Marker({position: home, map: map});
    var mk2 = new google.maps.Marker({position: orchard, map: map});

    // Draw a line showing the straight-line distance between the markers
    var line = new google.maps.Polyline({path: [home, orchard], map: map});

    // Calculate and display the distance between markers
    var distance = haversine_distance(mk1, mk2);
    document.getElementById('straight-line-dist-msg').innerHTML = "Distance between markers: " + distance.toFixed(2) + " km";

    // Calculating Road Distance
    let directionsService = new google.maps.DirectionsService();
    let directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map); // Existing map object displays directions
    
    // Create route from existing points used for markers
    const route = {
      origin: home,
      destination: orchard,
      travelMode: 'DRIVING' //or walking, bicycling
    }
    
    directionsService.route(route,
    function(response, status) { // anonymous function to capture directions
        if (status !== 'OK') {
            window.alert('Directions request failed due to ' + status);
            return;
        } else {
            directionsRenderer.setDirections(response); // Add route to the map
            var directionsData = response.routes[0].legs[0]; // Get data about the mapped route
            if (!directionsData) {
                window.alert('Directions request failed');
                return;
            }
            else {
                document.getElementById('road-dist-msg').innerHTML += " Road distance is " + directionsData.distance.text + ".";
            }
        }
    });
}