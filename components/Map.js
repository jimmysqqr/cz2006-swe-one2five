import styles from "./flatInfo.module.scss";

// blue marker for amenities
const image = {
  url: "https://www.clipartmax.com/png/full/95-954602_google-maps-marker-blue.png",
  scaledSize: new google.maps.Size(20,32),
  //origin: new google.maps.Point(0,0),
  //anchor: new google.maps.Point(0,32),
};

export function initMap() {
  const middleSG = { lat: 1.34791, lng: 103.83288 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: middleSG,
    fullScreenControl: true, // allow user to enlarge map
    gestureHandling: "cooperative", // only zoom in when ctrl button pressed (if not, greedy)
    //restriction: { north: northLat, south: southLat, west: -180, east: 180 }; // to restrict how much user zooms out
  });

}

// Method to add markers to locations
addMarker = (icon, mapName, latLng) => { // icon is boolean, mapName is string, latLng in curly braces
  if (icon) {
    new google.maps.Marker ({
      map: mapName,
      position: latLng,
      icon: image,
      //title? when mouse hovers over will appear
    });
  } else {
    new google.maps.Marker ({
      map: mapName,
      position: latLng,
      //title
    });
  }
}