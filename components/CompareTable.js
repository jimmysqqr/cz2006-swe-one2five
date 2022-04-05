import React, { useState } from "react";

import { Form } from "/components/Form";
import { loadData, postData } from "/components/data/httpRequestControl";
import { AmenityList, AmenityMap, PriceRange, PriceFuture } from "/components/FlatInfo";
import { CustomLocationInput, DistanceResults, handleDistanceKeyPressHook } from "/components/CustomLocation";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

import styles from "./CompareTable.module.scss";

export function CompareTable(props) {
  const [inputAddress, setInputAddress] = useState("");
  let distance = handleDistanceKeyPressHook(inputAddress, props.flatAddress);

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      let changedValue = event.target.value;
      console.log(changedValue);
      setInputAddress(changedValue);
    }
  }

  return (
    <div className={styles.compareTable}>
      <div className={styles.compareTableBackground}>
        <div className={styles.headerColumnContainer}>
          <HeaderColumn onKeyPress={handleKeyPress} />
        </div>
        <div className={styles.flatColumnList}>
          <FlatColumn type="target" distance={distance} />
          <FlatColumn type="existing" distance={distance} />
          <FlatColumn type="target" distance={distance} />
        </div>
      </div>
    </div>
  );
}

export function FlatColumn(props) {
  return (
    <div className={`${styles.column} ${styles.flat}`}>
      <div className={styles.headerSection}>
        <div className={`${styles.location} ${styles.row}`}>Woodlands Crescent Avenue 6 Block 35</div>
      </div>
      <div className={styles.contentSection}>
        <div className={`${styles.flatType} ${styles.row}`}>2-Room</div>
        <div className={`${styles.amenities} ${styles.row}`}>
          <div className={styles.mapContainer}>
            <AmenityMap />
          </div>
          <div className={styles.amenityList}>
            {/* <AmenityList /> */}
          </div>
        </div>
        <div className={`${styles.customLocation} ${styles.row}`}>
          {/* <DistanceResults distance={props.distance} /> */}
        </div>
        <div className={`${styles.price} ${styles.row}`}>
          {/* <PriceRange /> */}
        </div>
        <div className={`${styles.estimate} ${styles.row}`}>
          {/* <PriceFuture /> */}
        </div>
      </div>
      <div className={styles.endSection}>
        <div className={`${styles.actions} ${styles.row}`}>
          <Form
            page="comparisonRemove"
            formState={props.formState}
            setFormState={props.setFormState}
            handleSubmit={props.handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

export function HeaderColumn(props) {
  return (
    <div className={`${styles.column} ${styles.header}`}>
      <div className={styles.headerSection}>
        <div className={`${styles.location} ${styles.rowHeader}`}>Location</div>
      </div>
      <div className={styles.contentSection}>
        <div className={`${styles.flatType} ${styles.rowHeader}`}>Flat Type</div>
        <div className={`${styles.amenities} ${styles.rowHeader}`}>Nearby Amenities</div>
        <div className={`${styles.customLocation}`}>
          <div className={styles.rowHeader}>Distance to</div>
          <div className={styles.customInputContainer}>
            <CustomLocationInput onKeyPress={props.onKeyPress} />
          </div>
        </div>
        <div className={`${styles.price} ${styles.rowHeader}`}>Calculated Market Price</div>
        <div className={`${styles.estimate} ${styles.rowHeader}`}>Future Estimate</div>
      </div>
      <div className={styles.endSection}>
        <div className={`${styles.actions} ${styles.rowHeader}`}></div>
      </div>
    </div>
  );
}
