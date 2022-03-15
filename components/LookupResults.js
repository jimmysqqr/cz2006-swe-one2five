import styles from "./LookupResults.module.scss";

import { AggregateInfo, SingleInfo } from "/components/FlatInfo";


export function LookupResults() {
  return (
    <div className={styles.lookupResultsContainer}>
      <AggregateInfo />
      <SingleInfo />
    </div>
  );
}
