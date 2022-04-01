import React, { useState } from "react";
import styles from "./LookupResults.module.scss";

import { AggregateInfo, SingleInfo, AmenityMap } from "/components/FlatInfo";
import { Form } from "/components/Form";

export function LookupResults() {
  const [form, setForm] = useState({
    address: "",
    roomType: "",
    calPrice: "",
    percentile10: "",
    percentile90: "",
    futureEst: "",
    map: "",
    amenities: "",
  });

  return (
    <div className={styles.lookupResultsContainer}>
      <div className={styles.lookupResultsContent}>
        <div className={styles.space1}>
          <AggregateInfo />
        </div>
        <div className={styles.space2}>
          <SingleInfo />
        </div>
        <div className={styles.space3}>
          <AmenityMap />
        </div>
      </div>
      <Form page="lookupResults" formState={form} />
    </div>
  );
}
