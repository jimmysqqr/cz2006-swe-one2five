import React, { useState, useEffect } from "react";
import styles from "./SearchResults.module.scss";

import { Form } from "/components/Form";
import { loadData } from "/components/data/httpRequestControl";
import { ListItemFlat } from "/components/ListItemFlat";
import { AggregateInfo, SingleInfo, AmenityMap } from "/components/FlatInfo";
import { amenityValueToDisplay, roomValuetoDisplay } from "/components/data/formOptions";

export function SearchResults(props) {
  let aggData = props.results.aggData;
  let flatList = props.results.flatList;

  const [currentIDHighlight, setCurrentIDHighlight] = useState("");
  const [center, setCenter] = useState({ lat: 1.3521, lng: 103.8198 });


  useEffect(() => {
    if (props.selectedFlat.lat & props.selectedFlat.lng) {
      setCenter({ lat: props.selectedFlat.lat, lng: props.selectedFlat.lng });
    }
  }, [props.selectedFlat]);

  function handleMarkerClick(placeID) {
    setCurrentIDHighlight(placeID);
  }

  function handleAmenityItemClick(placeID, latLng) {
    setCurrentIDHighlight(placeID);
    setCenter(latLng);
  }

  function handleListItemClick_inter(flatID, flatObject) {
    setCurrentIDHighlight("");
    props.handleListItemClick(flatID, flatObject);
  }

  return (
    <div className={styles.searchResultsContainer}>
      <Form
        page="searchResults"
        formState={props.formState}
        setFormState={props.setFormState}
        handleSubmit={props.handleSubmit}
        options={{ nearbyAmenity: amenityValueToDisplay, roomType: roomValuetoDisplay }}
      />
      <div className={styles.searchResultsView}>
        <div className={styles.sizeLeft}>
          <div className={styles.scrollContainer}>
            <ListSearchedFlats
              onClick={handleListItemClick_inter}
              onSavedClick={props.onSavedClick}
              results={flatList}
              flatListStyles={props.flatListStyles}
              savedFlats={props.savedFlats}
            />
          </div>
        </div>
        <div className={styles.sizeRight}>
          {!props.showSingle ? (
            <AggregateInfo
              similarCount={aggData.similarCount}
              calPrice={aggData.calPrice}
              percentile10={aggData.percentile10}
              percentile90={aggData.percentile90}
              futureEst={aggData.futureEst}
            />
          ) : (
            <React.Fragment>
              <div className={styles.space1}>
                <SingleInfo
                  amenities={props.selectedFlat.amenities}
                  lat={props.selectedFlat.lat}
                  lng={props.selectedFlat.lng}
                  approvalDate={props.selectedFlat.approvalDate}
                  currentIDHighlight={currentIDHighlight}
                  onClick={handleAmenityItemClick}
                />
              </div>
              <div className={styles.space2}>
                <AmenityMap
                  amenities={props.selectedFlat.amenities}
                  center={center}
                  onMarkerClick={handleMarkerClick}
                  latLng={{ lat: props.selectedFlat.lat, lng: props.selectedFlat.lng }}
                />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

export function ListSearchedFlats(props) {
  let savedFlatIDs = new Set(props.savedFlats.map((flat) => flat["rented_out_id"]));
  return (
    <ul className={styles.listContainer}>
      {props.results.length ? (
        props.results.map((value, index) => (
          <ListItemFlat
            type="search"
            onClick={props.onClick}
            onSavedClick={props.onSavedClick}
            key={value.id}
            flatID={value.id}
            street={value.street_name}
            block={value.block}
            town={value.town}
            roomType={value.flat_type}
            price={value.monthly_rent}
            approvalDate={value.rental_approval_date}
            lat={value.latitude}
            lng={value.longitude}
            highlight={props.flatListStyles[index]}
            index={index}
            isSaved={savedFlatIDs.has(value.id)}
          />
        ))
      ) : (
        <></>
      )}
    </ul>
  );
}
