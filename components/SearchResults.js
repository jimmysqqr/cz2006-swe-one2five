import React, { useState } from "react";
import styles from "./SearchResults.module.scss";

import { Form } from "/components/Form";
import { loadData } from "/components/data/httpRequestControl";
import { ListItemFlat } from "/components/ListItemFlat";
import { AggregateInfo, SingleInfo, AmenityMap } from "/components/FlatInfo";
import { amenityValueToDisplay, roomValuetoDisplay } from "/components/data/formOptions";

export function SearchResults(props) {
  const [flatListStyles, setFlatListStyles] = useState(Array(props.listLength).fill(false));
  const [showSingle, setShowSingle] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState({
    flatID: "",
    latLong: "",
    amenities: "",
    approvalDate: "",
  });

  function handleOnClick(flatID, flatObject) {
    // if selecting a flat for the first time, so data needed, or selecting another flat while one is already selected
    if (selectedFlat.flatID !== flatID) {
      setShowSingle(true);
      let newFlatListStyles = Array(props.listLength).fill(false);
      newFlatListStyles[flatObject.index] = true;
      setFlatListStyles(newFlatListStyles);
      loadData("/api/v1/clickOnFlat", {
        id: flatID,
        flatStatus: "rented-out",
      })
        .then((res) => res.json())
        .then(
          (result) => {
            console.log("clickOnFlat", result);
            let data = result["data"];
            setSelectedFlat({
              flatID: flatID,
              latLong: flatObject.latLong,
              amenities: data.amenityList,
              approvalDate: flatObject.approvalDate,
            });
          },
          (error) => {
            console.log(error);
          }
        );
    }
    
    if ((selectedFlat.flatID === flatID)) {
      if (showSingle) { // if deselecting the currently selected flat, so data not needed
        setFlatListStyles(Array(props.listLength).fill(false));
      } else { // if reselecting a flat that was selected and deselected right just now, so data not needed
        let newFlatListStyles = Array(props.listLength).fill(false);
        newFlatListStyles[flatObject.index] = true;
        setFlatListStyles(newFlatListStyles);
      }
      setShowSingle((showSingle)=>!showSingle);
    }
  }

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
            <ListSearchedFlats onClick={handleOnClick} onSavedClick={props.onSavedClick} results={flatList} flatListStyles={flatListStyles} />
          </div>
        </div>
        <div className={styles.sizeRight}>
          {!showSingle ? (
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
                  amenities={selectedFlat.amenities}
                  latLong={selectedFlat.latLong}
                  approvalDate={selectedFlat.approvalDate}
                />
              </div>
              <div className={styles.space2}>
                <AmenityMap amenities={selectedFlat.amenities} latLong={selectedFlat.latLong} />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}

export function ListSearchedFlats(props) {
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
            flatStatus={value.flat_status}
            approvalDate={value.rental_approval_date}
            latLong={[value.latitude, value.longitude]}
            highlight={props.flatListStyles[index]}
            index={index}
          />
        ))
      ) : (
        <></>
      )}
    </ul>
  );
}
