import {Map} from "/components/Map";
import { CustomLocation } from "/components/CustomLocation";

import styles from "./FlatInfo.module.scss";

export function AggregateInfo() {
  return (
    <div className={`${styles.aggregate} ${styles.container}`}>
      <div className={styles.header}>Based on 25 similar flats within 1km,</div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Calculated Market Price</div>
        <div className={styles.sectionContent}>
          <div className={styles.priceRangeNumberContainer}>
            <div className={styles.numberGroup}>
              <div className={`${styles.number} ${styles.secondary}`}>$ 1750</div>
              <div className={styles.label}>10th percentile</div>
            </div>
            <div className={styles.numberGroup}>
              <div className={`${styles.number} ${styles.primary}`}>$ 2200</div>
              <div className={styles.label}>Average price</div>
            </div>
            <div className={styles.numberGroup}>
              <div className={`${styles.number} ${styles.secondary}`}>$ 2500</div>
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
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Future Estimate</div>
        <div className={styles.sectionContent}>
          <div className={styles.priceFutureContainer}>
            <div className={styles.numberGroup}>
              <div className={`${styles.number} ${styles.primary}`}>$ 100</div>
              <div className={styles.label}>increase next month</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SingleInfo() {
  return (
    <div className={`${styles.single} ${styles.container}`}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Nearby Amenities (within 1km)</div>
        <div className={styles.sectionContent}>
          <div className={styles.amenityContainer}>
            <div className={styles.mapContainer}><Map /></div>
            <div className={styles.amenityList}>
              <div className={styles.amenity}>
                <div className={styles.amenityName}>Xin Hua Secondary School</div>
                <div className={styles.amenityDistance}>100m</div>
              </div>
              <div className={styles.amenity}>
                <div className={styles.amenityName}>Petrol Station</div>
                <div className={styles.amenityDistance}>230m</div>
              </div>
              <div className={styles.amenity}>
                <div className={styles.amenityName}>Pasir Ris Community Club</div>
                <div className={styles.amenityDistance}>350m</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Distance to Custom Location</div>
        <div className={styles.sectionContent}>
          <CustomLocation />
        </div>

      </div>
    </div>
  );
}
