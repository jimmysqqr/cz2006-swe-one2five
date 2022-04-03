import React, { useState } from "react";
import styles from "./LookupResults.module.scss";

import { AggregateInfo, SingleInfo, AmenityMap } from "/components/FlatInfo";
// import { Map } from "/components/Map";
import { Form } from "/components/Form";

export function LookupResults(props) {

  let form = props.formState;

  return (
    <div className={styles.lookupResultsContainer}>
      <div className={styles.lookupResultsContent}>
        <div className={styles.space1}>
          <AggregateInfo similarCount={form.similarCount} calPrice={form.calPrice} percentile10={form.percentile10} percentile90={form.percentile90} futureEst={form.futureEst} />
        </div>
        <div className={styles.space2}>
          <SingleInfo amenities={form.amenities} latLong={form.latLong} approvalDate={form.approvalDate}/>
        </div>
        <div className={styles.space3}>
          <AmenityMap amenities={form.amenities} latLong={form.latLong} />
          {/* <Map /> */}
        </div>
      </div>
      <Form page="lookupResults" formState={form} /> {/*TODO: What does the save button need? It needs flatID*/}
    </div>
  );
}
