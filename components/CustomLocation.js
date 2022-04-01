import { InputText } from "./FormInputs";

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
  return (
    <div className={styles.distanceResults}>
      <div className={styles.distanceOutput}>{props.distance}</div>
      <div className={styles.distanceMeasurement}>km</div>
    </div>
  );
}

export const handleDistanceKeyPressHook = (inputAddress, flatAddress) => {
  let distance = "";

  // use inputAddress and flatAddress to get straight line distance

  
  return distance; // distance
};
