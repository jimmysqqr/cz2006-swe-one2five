import styles from "./flatInfo.module.scss";

export function Map() {
  const middleSG = { lat: 1.34791, lng: 103.83288 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 11,
    center: middleSG,
    fullScreenControl: true, // allow user to enlarge map
    gestureHandling: "cooperative", // only zoom in when ctrl button pressed (if not, greedy)
    //restriction: { north: northLat, south: southLat, west: -180, east: 180 }; // to restrict how much user zooms out
    });
}
