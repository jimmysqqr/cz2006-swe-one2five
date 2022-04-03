import React, { useState, useEffect } from "react";

import { loadData } from "/components/data/httpRequestControl";
import { CustomLocationInput, DistanceResults, handleDistanceKeyPressHook } from "/components/CustomLocation";

import styles from "./FlatInfo.module.scss";

export function AggregateInfo(props) {
  return (
    <div className={`${styles.aggregate} ${styles.container}`}>
      <div className={styles.header}>Based on {props.similarCount} similar flat(s) in the same town,</div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Calculated Market Price</div>
        <div className={styles.sectionContent}>
          <PriceRange calPrice={props.calPrice} percentile10={props.percentile10} percentile90={props.percentile90} />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Future Estimate</div>
        <div className={styles.sectionContent}>
          <PriceFuture futureEst={props.futureEst} />
        </div>
      </div>
    </div>
  );
}

export function SingleInfo(props) {
  return (
    <div className={`${styles.single} ${styles.container}`}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Nearby Amenities</div>
        <div className={styles.sectionContent}>
          <AmenityList amenities={props.amenities} />
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Distance to Custom Location</div>
        <div className={styles.sectionContent}>
          <FlatInfo_CustomLocation latLong={props.latLong} />
        </div>
      </div>
      <div className={styles.footer}>{props.approvalDate}</div>
    </div>
  );
}

export function PriceRange(props) {
  return (
    <>
      {Math.round(props.percentile10) != Math.round(props.percentile90) ? (
        <div className={styles.priceRange}>
          <div className={styles.priceRangeNumberContainer}>
            <div className={styles.numberGroup}>
              <div className={`${styles.number} ${styles.secondary}`}>$ {Math.round(props.percentile10)}</div>
              <div className={styles.label}>10th percentile</div>
            </div>
            <div className={styles.numberGroup}>
              <div className={`${styles.number} ${styles.primary}`}>$ {Math.round(props.calPrice)}</div>
              <div className={styles.label}>Average price</div>
            </div>
            <div className={styles.numberGroup}>
              <div className={`${styles.number} ${styles.secondary}`}>$ {Math.round(props.percentile90)}</div>
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
      ) : (
        <div className={styles.priceRange}>
            <div className={styles.numberGroup}>
              <div className={`${styles.number} ${styles.primary}`}>$ {Math.round(props.calPrice)}</div>
            </div>
        </div>
      )}
    </>
  );
}

export function PriceFuture(props) {
  return (
    <div className={styles.priceFuture}>
      <div className={styles.numberGroup}>
        {props.futureEst !== null ? (
          <>
            <div className={`${styles.number}`}>$ {Math.round(props.futureEst)}</div>
            <div className={styles.label}>next month</div>
          </>
        ) : (
          <div className={styles.label}>Not enough information</div>
        )}
      </div>
    </div>
  );
}

export function AmenityList(props) {

  let arr = props.amenities;
  if (arr.length) {
    arr.sort((a, b) => a["dist_from_flat"]["value"] <= b["dist_from_flat"]["value"]? -1 : 1);
  }

  return (
    <ul className={styles.amenityList}>
      {arr.length ? (
        arr.map((value) => (
          <li className={styles.amenity} key={value.place_id}>
            <div className={styles.amenityName}>{value.name}</div>
            <div className={styles.amenityDistance}>{value["dist_from_flat"]["value"] > 999 ? `${Math.round(value["dist_from_flat"]["value"]/100)/10}km` : `${value["dist_from_flat"]["value"]}m`}</div>
          </li>
        ))
      ) : (
        <></>
      )}
    </ul>
  );
}

export function AmenityMap(props) {
  return <div className={styles.mapContainer}>Hi Im map centred on {props.latLong}</div>;
}

export function FlatInfo_CustomLocation(props) {
  const [distance, setDistance] = useState("");

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      let changedValue = event.target.value;
      console.log(changedValue);
      handleDistanceKeyPressHook(changedValue, props.latLong).then((result) => {
        console.log("hook done", result);
        setDistance(result);
      });
    }
  }

  return (
    <div className={styles.customContainer}>
      <div className={styles.customInputContainer}>
        <CustomLocationInput onKeyPress={handleKeyPress} />
      </div>
      <div className={styles.distanceResultsContainer}>
        <DistanceResults distance={distance} />
      </div>
    </div>
  );
}
