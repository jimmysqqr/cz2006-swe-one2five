import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as savedBookmark } from "@fortawesome/free-solid-svg-icons";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

import { capitalizeTheFirstLetterOfEachWord } from "/components/data/formOptions";
import styles from "./ListItemFlat.module.scss";

export function ListItemFlat(props) {
  /*
  Inputs:
  - type: type of list item
  - onSavedClick: callback when a savedFlat is clicked
  - flatID: ID of flat
  - approvalDate: approval date of rented-out flat
  - lat: latitude
  - lng: longitude
  - isSaved: whether a flat is saved
  - onAdd: callback when a flat is added to comparison
  - savedFlatID: ID of saved flat
  - onClick: callback when flat is clicked
  - street: street name of flat
  - block: block # of flat
  - town: name of town
  - roomType: flat-type
  - price: price in dollars
  - highlight: whether a flat is highlighted
  - isChosen: whether a flat is currently selected 
  - index: index of flat in list
  */

  function selectFlat_inter() {
    props.onClick(props.flatID, {
      approvalDate: props.approvalDate,
      lat: props.lat,
      lng: props.lng,
      index: props.index,
    });
  }

  function saveFlat_inter() {
    props.onSavedClick(props.flatID, {
      town: props.town,
      street: props.street,
      block: props.block,
      roomType: props.roomType,
      isSaved: props.isSaved,
      price: props.price,
    });
  }

  function selectSavedFlat_inter() {
    props.onClick(props.savedFlatID, {
      lat: props.lat,
      lng: props.lng,
      index: props.index,
      street: props.street,
      block: props.block,
    });
  }

  function AddFlatSideBySide_inter() {
    props.onAdd(props.savedFlatID, {});
  }

  let highlight = "";
  if (props.highlight) {
    highlight = styles.highlight;
  }
  let savedIcon = faBookmark;
  let saved = "";
  if (props.isSaved) {
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
      <li className={`${styles.listItemFlat} ${styleType} ${highlight}`}>
        <div className={`${styles.saveContainer} ${saved}`} onClick={saveFlat_inter}>
          <FontAwesomeIcon icon={savedIcon} style={{ fontSize: "1.1rem" }} />
        </div>
        <div className={styles.clickContainer} onClick={selectFlat_inter}>
          <div className={styles.nameAmenityContainer}>
            <div className={styles.name}>
              {capitalizeTheFirstLetterOfEachWord(props.street) + " Blk " + props.block}
            </div>
            <div className={styles.amenity}>{capitalizeTheFirstLetterOfEachWord(props.town)}</div>
          </div>
          <div className={styles.typePriceContainer}>
            <div className={styles.roomType}>{capitalizeTheFirstLetterOfEachWord(props.roomType)}</div>
            <div className={styles.price}>$ {Math.round(props.price)}</div>
          </div>
        </div>
      </li>
    );
  } else if (props.type == "compare") {
    styleType = styles.compare;

    return (
      <li className={`${styles.listItemFlat} ${styleType} ${highlight}`} onClick={selectSavedFlat_inter}>
        <div className={styles.nameContainer}>
          <div className={styles.name}>{capitalizeTheFirstLetterOfEachWord(props.street) + " Blk " + props.block}</div>
        </div>
        <div className={styles.isSavedTypePriceContainer}>
          <div className={styles.isSavedContainer}>
            <div className={styles.isSaved}>{capitalizeTheFirstLetterOfEachWord(props.town)}</div>
          </div>
          <div className={styles.typePriceContainer}>
            <div className={styles.roomType}>{capitalizeTheFirstLetterOfEachWord(props.roomType)}</div>
            <div className={styles.price}>$ {Math.round(props.price)}</div>
          </div>
        </div>
        {props.isChosen ? (
          <div className={styles.chosenMark}>
            <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ fontSize: "0.75rem" }} />
          </div>
        ) : (
          ""
        )}
      </li>
    );
  } else if (props.type == "compareSideBySide") {
    styleType = styles.compareSideBySide;

    return (
      <li className={`${styles.listItemFlat} ${styleType}`} onClick={AddFlatSideBySide_inter}>
        <div className={styles.name}>{capitalizeTheFirstLetterOfEachWord(props.street) + " Blk " + props.block}</div>
        {/* {props.isChosen ? (
          <div className={styles.chosenMark}>
            <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ fontSize: "0.75rem" }} />
          </div>
        ) : (
          ""
        )} */}
      </li>
    );
  }
}
