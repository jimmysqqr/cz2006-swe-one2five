import React, { useState } from "react";
import styles from "./SearchResults.module.scss";

import { Form } from "/components/Form";
import { loadData } from "/components/data/httpRequestControl";
import { ListItemFlat } from "/components/ListItemFlat";
import { AggregateInfo, SingleInfo, AmenityMap } from "/components/FlatInfo";
import { amenityValueToDisplay, roomValuetoDisplay } from "/components/data/formOptions";

export function SearchResults(props) {

  let aggData = props.results.aggData;
  let flatList = props.results.flatList;

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
              onClick={props.handleListItemClick}
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
                  latLong={props.selectedFlat.latLong}
                  approvalDate={props.selectedFlat.approvalDate}
                />
              </div>
              <div className={styles.space2}>
                <AmenityMap amenities={props.selectedFlat.amenities} latLong={props.selectedFlat.latLong} />
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
            latLong={[value.latitude, value.longitude]}
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
