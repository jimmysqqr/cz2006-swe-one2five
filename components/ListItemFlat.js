import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as savedBookmark } from "@fortawesome/free-solid-svg-icons";

import { capitalizeTheFirstLetterOfEachWord } from "/components/data/formOptions";
import styles from "./ListItemFlat.module.scss";

export function ListItemFlat(props) {

  function selectFlat_inter() {
    props.onClick(props.flatID, {
      approvalDate: props.approvalDate,
      latLong: props.latLong,
      index: props.index
    });
  }

  function saveFlat_inter() {
    props.onSavedClick(props.flatID, {
      index: props.index,
      street: props.street,
      block: props.block,
    });
  }

  
  let highlight = "";
  if (props.highlight) {
    highlight = styles.highlight;
  }
  let savedIcon = faBookmark;
  let saved = "";
  if (props.flatStatus == "saved") {
    savedIcon = savedBookmark;
    saved = styles.saved;
  }

  let styleType = "";
  if (props.type == "search") {
    styleType = styles.search;
  
    // <li className={`${styles.listItemFlat} ${styleType}`} onClick={props.onClick}>
    //     <div className={styles.saveContainer}>
    //       <FontAwesomeIcon icon={faBookmark} style={{ fontSize: "1.1rem" }} />
    //     </div>
    //     <div className={styles.nameAmenityContainer}>
    //       <div className={styles.name}>Woodlands Crescent Block 787E</div>
    //       <div className={styles.amenity}>School 400m</div>
    //     </div>
    //     <div className={styles.typePriceContainer}>
    //       <div className={styles.roomType}>4-Room</div>
    //       <div className={styles.price}>$ 2100</div>
    //     </div>
    //   </li>

    return (
      <li className={`${styles.listItemFlat} ${styleType} ${highlight}`} onClick={selectFlat_inter}>
        <div className={`${styles.saveContainer} ${saved}`} onClick={saveFlat_inter}>
          <FontAwesomeIcon icon={savedIcon} style={{ fontSize: "1.1rem" }} />
        </div>
        <div className={styles.nameAmenityContainer}>
          <div className={styles.name}>{capitalizeTheFirstLetterOfEachWord(props.street) + " Blk " + props.block}</div>
          <div className={styles.amenity}>{capitalizeTheFirstLetterOfEachWord(props.town)}</div>
        </div>
        <div className={styles.typePriceContainer}>
          <div className={styles.roomType}>{capitalizeTheFirstLetterOfEachWord(props.roomType)}</div>
          <div className={styles.price}>$ {Math.round(props.price)}</div>
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
