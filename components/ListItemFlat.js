import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";

import styles from "./ListItemFlat.module.scss";

export function ListItemFlat(props) {
  let styleType = "";

  if (props.type == "search") {
    styleType = styles.search;

    return (
      <li className={`${styles.listItemFlat} ${styleType}`} onClick={props.onClick}>
        <div className={styles.saveContainer}>
          <FontAwesomeIcon icon={faBookmark} style={{ fontSize: "1.1rem" }} />
        </div>
        <div className={styles.nameAmenityContainer}>
          <div className={styles.name}>Woodlands Crescent Block 787E</div>
          <div className={styles.amenity}>School 400m</div>
        </div>
        <div className={styles.typePriceContainer}>
          <div className={styles.roomType}>4-Room</div>
          <div className={styles.price}>$ 2100</div>
        </div>
      </li>
    );

  } else if (props.type == "compare") {
    styleType = styles.compare;

    return (
      <li className={`${styles.listItemFlat} ${styleType}`}>
        <div className={styles.nameContainer}>
          <div className={styles.name}>Woodlands Crescent Block 787E</div>
        </div>
        <div className={styles.isSavedTypePriceContainer}>
          <div className={styles.isSavedContainer}>
            <div className={styles.isSaved}>Existing Flat</div>
          </div>
          <div className={styles.typePriceContainer}>
            <div className={styles.roomType}>4-Room</div>
            <div className={styles.price}>$ 2100</div>
          </div>
        </div>
      </li>
    );
  }
}
