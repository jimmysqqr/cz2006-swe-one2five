import React, { useState } from "react";

import { CustomLocationInput, DistanceResults, handleDistanceKeyPressHook } from "/components/CustomLocation";

import styles from "./FlatInfo.module.scss";

export function AggregateInfo() {
  return (
    <div className={`${styles.aggregate} ${styles.container}`}>
      <div className={styles.header}>Based on 25 similar flats within 1km,</div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Calculated Market Price</div>
        <div className={styles.sectionContent}>
          <PriceRange />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Future Estimate</div>
        <div className={styles.sectionContent}>
          <PriceFuture />
        </div>
      </div>
    </div>
  );
}

export function SingleInfo() {
  return (
    <div className={`${styles.single} ${styles.container}`}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Nearby Amenities (within 1km)</div>
        <div className={styles.sectionContent}>
          <AmenityList />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Distance to Custom Location</div>
        <div className={styles.sectionContent}>
          <FlatInfo_CustomLocation flatAddress="50 Nanyang Ave"/>
        </div>
      </div>
    </div>
  );
}

export function PriceRange() {
  return (
    <div className={styles.priceRange}>
      <div className={styles.priceRangeNumberContainer}>
        <div className={styles.numberGroup}>
          <div className={`${styles.number} ${styles.secondary}`}>$ 1750</div>
          <div className={styles.label}>10th percentile</div>
        </div>
        <div className={styles.numberGroup}>
          <div className={`${styles.number} ${styles.primary}`}>$ 2200</div>
          <div className={styles.label}>Average price</div>
        </div>
        <div className={styles.numberGroup}>
          <div className={`${styles.number} ${styles.secondary}`}>$ 2500</div>
          <div className={styles.label}>90th percentile</div>
        </div>
      </div>
      <div className={styles.priceRangeLineContainer}>
        <div className={styles.line}></div>
        <div className={`${styles.circle} ${styles.secondary}`}></div>
        <div className={`${styles.circle} ${styles.primary}`}></div>
        <div className={`${styles.circle} ${styles.secondary}`}></div>
      </div>
    </div>
  );
}

export function PriceFuture() {
  return (
    <div className={styles.priceFuture}>
      <div className={styles.numberGroup}>
        <div className={`${styles.number}`}>$ 2100</div>
        <div className={styles.label}>next month</div>
      </div>
    </div>
  );
}

export function AmenityList() {
  return (
    <ul className={styles.amenityList}>
      <li className={styles.amenity}>
        <div className={styles.amenityName}>Xin Hua Secondary School</div>
        <div className={styles.amenityDistance}>100m</div>
      </li>
      <li className={styles.amenity}>
        <div className={styles.amenityName}>Petrol Station</div>
        <div className={styles.amenityDistance}>230m</div>
      </li>
      <li className={styles.amenity}>
        <div className={styles.amenityName}>Pasir Ris Community Club</div>
        <div className={styles.amenityDistance}>350m</div>
      </li>
    </ul>
  );
}

export function AmenityMap() {
  return <div className={styles.mapContainer}>Hi Im map</div>;
}


export function FlatInfo_CustomLocation(props) {
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
    <div className={styles.customContainer}>
      <div className={styles.customInputContainer}>
        <CustomLocationInput onKeyPress={handleKeyPress}/>
      </div>
      <div className={styles.distanceResultsContainer}>
        <DistanceResults distance={distance} />
      </div>
    </div>
  );
}