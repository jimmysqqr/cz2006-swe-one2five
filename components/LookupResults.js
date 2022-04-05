import React, { useState, useEffect } from "react";
import styles from "./LookupResults.module.scss";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

import { AggregateInfo, SingleInfo, AmenityMap } from "/components/FlatInfo";
// import { Map } from "/components/Map";
import { Form } from "/components/Form";

export function LookupResults(props) {
  let form = props.formState;

  const [currentIDHighlight, setCurrentIDHighlight] = useState("");
  const [center, setCenter] = useState({ lat: 1.3521, lng: 103.8198 });

  useEffect(() => {
    if (form.latLong) {
      setCenter({ lat: form.latLong[0], lng: form.latLong[1] });
    }
  }, [form]);

  function handleMarkerClick(placeID) {
    setCurrentIDHighlight(placeID);
  }

  function handleAmenityItemClick(placeID, latLng) {
    setCurrentIDHighlight(placeID);
    setCenter(latLng);
  }

  return (
    <div className={styles.lookupResultsContainer}>
      <div className={styles.lookupResultsContent}>
        <div className={styles.space1}>
          <AggregateInfo
            similarCount={form.similarCount}
            calPrice={form.calPrice}
            percentile10={form.percentile10}
            percentile90={form.percentile90}
            futureEst={form.futureEst}
          />
        </div>
        <div className={styles.space2}>
          <SingleInfo
            amenities={form.amenities}
            latLong={form.latLong}
            approvalDate={form.approvalDate}
            currentIDHighlight={currentIDHighlight}
            onClick={handleAmenityItemClick}
          />
        </div>
        <div className={styles.space3}>
          {typeof window !== "undefined" ? (
            <AmenityMap
              amenities={form.amenities}
              latLong={
                form.latLong
                  ? {
                      lat: form.latLong[0],
                      lng: form.latLong[1],
                    }
                  : center
              }
              center={center}
              onMarkerClick={handleMarkerClick}
            />
          ) : (
            ""
          )}
        </div>
      </div>
      <Form page="lookupResults" formState={form} handleSubmit={props.handleSubmit} isSaved={props.isSaved} />
    </div>
  );
}
