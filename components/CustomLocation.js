import { InputText } from "./FormInputs";

import styles from "./CustomLocation.module.scss";

export function CustomLocation() {
  return (
    <div className={styles.customContainer}>
      <div className={styles.customInputContainer}>
        <InputText textAlign="left"/>
      </div>
      <div className={styles.distanceResults}>
        <div className={styles.distanceOutput}>6</div>
        <div className={styles.distanceMeasurement}>km</div>
      </div>
    </div>
  );
}
