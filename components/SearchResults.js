import React, { useState } from "react";
import styles from "./SearchResults.module.scss";

import { Form } from "/components/Form";
import { ListItemFlat } from "/components/ListItemFlat";
import { AggregateInfo, SingleInfo, AmenityMap } from "/components/FlatInfo";

export function SearchResults(props) {
  const [showAggregate, setShowAggregate] = useState(true);
  const [selectedFlat, setSelectedFlat] = useState(null);

  function handleOnClick() {
    setShowAggregate(!showAggregate);
  }

  return (
    <div className={styles.searchResultsContainer}>
      <Form
        page="searchResults"
        formState={props.formState}
        setFormState={props.setFormState}
        handleSubmit={props.handleSubmit}
      />
      <div className={styles.searchResultsView}>
        <div className={styles.sizeLeft}>
          <div className={styles.scrollContainer}>
            <ListSearchedFlats onClick={handleOnClick} />
          </div>
        </div>
        <div className={styles.sizeRight}>
          {showAggregate ? (
            <AggregateInfo />
          ) : (
            <React.Fragment>
              <div className={styles.space1}>
                <SingleInfo />
              </div>
              <div className={styles.space2}>
                <AmenityMap />
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
      <ListItemFlat type="search" onClick={props.onClick} key={1}/>
      <ListItemFlat type="search" onClick={props.onClick} key={2}/>
      <ListItemFlat type="search" onClick={props.onClick} key={3}/>
      <ListItemFlat type="search" onClick={props.onClick} key={4}/>
      <ListItemFlat type="search" onClick={props.onClick} key={5}/>
    </ul>
  );
}
