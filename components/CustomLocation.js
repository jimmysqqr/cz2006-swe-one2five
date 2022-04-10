import { InputText } from "./FormInputs";
import { loadData } from "/components/data/httpRequestControl";

import styles from "./CustomLocation.module.scss";

export function CustomLocationInput(props) {
  /*
  Inputs
  - ononKeyPress: callback when a key is pressed in the input box
  */
 
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
  /*
  Inputs
  - distance: distances from flat to the custom location
  */

  console.log("distance output", props);
  return (
    <div className={styles.distanceResults}>
      <div className={styles.distanceOutput}>{props.distance ? parseInt(props.distance).toFixed(1) : ""}</div>
      <div className={styles.distanceMeasurement}>km</div>
    </div>
  );
}

export async function handleDistanceKeyPressHook(inputAddress, flatLatLng) {
  /*
  Inputs
  - inputAddress: Address of custom location
  - flatLatLng: latitude and longitude of flat
  Outputs
  - distance to flat
  */

  if (inputAddress) {
    return loadData("/api/v1/distance", {
      flatLat: flatLatLng.lat,
      flatLng: flatLatLng.lng,
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
  } else return "";
}
