import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { Form } from "/components/Form";
import { loadData, postData } from "/components/data/httpRequestControl";
import { capitalizeTheFirstLetterOfEachWord } from "/components/data/formOptions";
import { ListItemFlat } from "/components/ListItemFlat";
import { AmenityList, AmenityMap, PriceRange, PriceFuture } from "/components/FlatInfo";
import { CustomLocationInput, DistanceResults, handleDistanceKeyPressHook } from "/components/CustomLocation";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

import styles from "./CompareTable.module.scss";

export function CompareTable(props) {
  /*
  Inputs
  - uuid: user UUID
  - ids: IDs of saved flats belonging to the user
  */

  const router = useRouter();

  const [flatsCompared, setFlatsCompared] = useState([]);
  const [inputAddress, setInputAddress] = useState("");
  const [distances, setDistances] = useState(Array(props.ids ? props.ids.length : 0).fill(""));

  useEffect(() => {
    if (flatsCompared.length) {
      let distancePromises = flatsCompared.map((flat) =>
        handleDistanceKeyPressHook(inputAddress, {lat: flat.data.savedFlat.latitude, lng: flat.data.savedFlat.longitude}).then(
          (result) => result
        )
      );
      Promise.all(distancePromises).then((newDistances) => setDistances(newDistances));
    }
  }, [inputAddress, flatsCompared]);

  useEffect(() => {
    loadData(`/api/v1/compare/${props.uuid}`, {
      ids: props.ids, // ids: [1,2,3]
    })
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("Compare Table get compared flats", result);
          setFlatsCompared(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }, [props.uuid, props.ids]);

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      let changedValue = event.target.value;
      console.log(changedValue);
      setInputAddress(changedValue);
    }
  }

  function handleRemove(savedFlatID, flatObject) {
    console.log("removing:", savedFlatID);
    let cloneArray = JSON.parse(JSON.stringify(flatsCompared));
    setFlatsCompared(cloneArray.filter((savedFlat) => savedFlat.data.savedFlat.id !== savedFlatID));
  }

  function handleAdd(savedFlatID, flatObject) {
    console.log("adding:", savedFlatID);
    let queryList = flatsCompared.map((flat) => flat["data"]["savedFlat"]["id"]);
    queryList.push(savedFlatID);
    router.replace(
      {
        pathname: `/compare/comparison`,
        query: { ids: queryList },
      },
      undefined,
      { shallow: true }
    );
  }

  return (
    <div className={styles.compareTable}>
      <div className={styles.compareTableBackground}>
        <div className={styles.headerColumnContainer}>
          <HeaderColumn onKeyPress={handleKeyPress} />
        </div>
        <ul className={styles.flatColumnList}>
          {flatsCompared.length ? (
            flatsCompared.map((value, index) => (
              <FlatColumn
                distance={distances[index]}
                key={value["data"]["savedFlat"]["id"]}
                info={value["data"]}
                isGroup={parseInt(value["data"]["savedFlat"]["monthly_rent"]) == Math.round(value["data"]["avgPrice"])}
                onRemove={handleRemove}
              />
            ))
          ) : (
            <></>
          )}
          <AddColumn
            key={"columnToAddMoreFlats"}
            uuid={props.uuid}
            onAdd={handleAdd}
            idsCompared={new Set(flatsCompared.map((flat) => flat["data"]["savedFlat"]["id"]))}
          />
        </ul>
      </div>
    </div>
  );
}

export function FlatColumn(props) {
  /*
  Inputs
  - distance: distances from flat to the custom location
  - info: information about the saved flat
  - isGroup: whether flat is a searched flat or a lookup flat
  - onRemove: callback when a column is removed
  */

  let savedInfo = props.info;

  const [currentIDHighlight, setCurrentIDHighlight] = useState("");
  const [center, setCenter] = useState({ lat: 1.3521, lng: 103.8198 });

  useEffect(() => {
    setCenter({ lat: savedInfo.savedFlat.latitude, lng: savedInfo.savedFlat.longitude });
  }, [savedInfo]);

  function onRemove_inter() {
    props.onRemove(savedInfo.savedFlat.id, {});
  }

  function handleMarkerClick(placeID) {
    setCurrentIDHighlight(placeID);
  }

  function handleAmenityItemClick(placeID, latLng) {
    setCurrentIDHighlight(placeID);
    setCenter(latLng);
  }

  return (
    <li className={`${styles.column} ${styles.flat}`}>
      <div className={styles.headerSection}>
        <div className={`${styles.location} ${styles.row}`}>
          {capitalizeTheFirstLetterOfEachWord(savedInfo.savedFlat.street_name) + " Blk " + savedInfo.savedFlat.block}
        </div>
      </div>
      <div className={styles.contentSection}>
        <div className={`${styles.flatType} ${styles.row}`}>
          {capitalizeTheFirstLetterOfEachWord(savedInfo.savedFlat.flat_type)}
        </div>
        <div className={`${styles.amenities} ${styles.row}`}>
          <div className={styles.mapContainer}>
            <AmenityMap
              amenities={savedInfo.amenities.amenityList}
              latLng={{ lat: savedInfo.savedFlat.latitude, lng: savedInfo.savedFlat.longitude }}
              center={center}
              onMarkerClick={handleMarkerClick}
            />
          </div>
          <div className={styles.mapInfoCard}>
            <div className={styles.amenityListContainer}>
              <AmenityList
                amenities={savedInfo.amenities.amenityList}
                currentIDHighlight={currentIDHighlight}
                onClick={handleAmenityItemClick}
              />
            </div>
          </div>
        </div>
        <div className={`${styles.customLocation} ${styles.row}`}>
          <DistanceResults distance={props.distance} />
        </div>
        <div className={`${styles.price} ${styles.row}`}>
          {props.isGroup ? (
            <PriceRange
              calPrice={savedInfo.avgPrice}
              percentile10={savedInfo.tenPer}
              percentile90={savedInfo.ninetyPer}
            />
          ) : (
            <PriceRange
              calPrice={savedInfo.savedFlat.monthly_rent}
              percentile10={savedInfo.savedFlat.monthly_rent}
              percentile90={savedInfo.savedFlat.monthly_rent}
              approvalDate={"placeholder"}
            />
          )}
        </div>
        <div className={`${styles.estimate} ${styles.row}`}>
          <PriceFuture futureEst={savedInfo.predictedPrice} />
        </div>
      </div>
      <div className={styles.endSection}>
        <div className={`${styles.actions} ${styles.row}`}>
          <Form page="comparisonRemove" onRemove={onRemove_inter} />
        </div>
      </div>
    </li>
  );
}

export function HeaderColumn(props) {
  /*
  Inputs
  - onKeyPress: callback when a key is pressed in the custom location input box 
  */

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

export function AddColumn(props) {
  const [canChoose, setCanChoose] = useState(false);
  const [moreChoices, setMoreChoices] = useState([]);

  useEffect(() => {
    loadData(`/api/v1/savedFlats/${props.uuid}`, {})
      .then((res) => res.json())
      .then(
        (result) => {
          console.log("Getting more options", result);
          let newMoreChoices = result["data"].filter((savedFlat) => !props.idsCompared.has(savedFlat.id));
          setMoreChoices(newMoreChoices);
        },
        (error) => {
          console.log(error);
        }
      );
  }, [props.uuid, props.idsCompared]);

  function openChoices() {
    setCanChoose(true);
  }

  function handleOnAdd_inter(savedFlatID, flatObject) {
    setCanChoose(false);
    props.onAdd(savedFlatID, flatObject);
  }

  return (
    <li className={`${styles.column} ${styles.add}`}>
      <div className={styles.headerSection}></div>
      <div className={styles.contentSection}>
        <div className={styles.addContainer}>
          {canChoose ? (
            <ul className={styles.addList}>
              {moreChoices.length
                ? moreChoices.map((value) => (
                    <ListItemFlat
                      type="compareSideBySide"
                      key={value.id}
                      savedFlatID={value.id}
                      onAdd={handleOnAdd_inter}
                      street={value.street_name}
                      block={value.block}
                    />
                  ))
                : "No additional saved flats"}
            </ul>
          ) : (
            <div className={styles.addInfo} onClick={openChoices}>
              <div className={styles.addCircleIcon}>
                <FontAwesomeIcon icon={faPlus} />
              </div>
              <div className={styles.addText}>Add more to comparison</div>
            </div>
          )}
        </div>
      </div>
      <div className={styles.endSection}></div>
    </li>
  );
}
