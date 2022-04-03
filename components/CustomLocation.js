import { InputText } from "./FormInputs";
import { loadData } from "/components/data/httpRequestControl";

import styles from "./CustomLocation.module.scss";

export function CustomLocationInput(props) {
  return (
    <InputText
      textAlign="left"
      placeholder="Type an address and press Enter"
      size="small"
      onKeyPress={props.onKeyPress}
    />
  );
}

export function DistanceResults(props) {
  console.log("distance output", props);
  return (
    <div className={styles.distanceResults}>
      <div className={styles.distanceOutput}>{props.distance}</div>
      <div className={styles.distanceMeasurement}>km</div>
    </div>
  );
}

export async function handleDistanceKeyPressHook(inputAddress, flatLatLong) {
  // use inputAddress and flatAddress to get straight line distance
  return loadData("/api/v1/distance", {
    flatLat: flatLatLong[0],
    flatLng: flatLatLong[1],
    dst: inputAddress,
  })
    .then((res) => res.json())
    .then(
      (result) => {
        console.log("success", result);
        return result["distance"] === undefined ? "-" : Math.round((result["distance"]["value"] / 1000) * 10) / 10;
      },
      (error) => {
        console.log("error", error);
        return "";
      }
    );
}
