import React, { useState, useEffect } from "react";

import { Form } from "/components/Form";
import { ListItemFlat } from "/components/ListItemFlat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { capitalizeTheFirstLetterOfEachWord } from "/components/data/formOptions";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

import styles from "./ChooseFlats.module.scss";

export function ChooseFlats(props) {
  const [showInfoAction, setShowInfoAction] = useState(false);
  const [selectedFlat, setSelectedFlat] = useState({
    id: "",
    street: "",
    block: "",
    latLong: "",
    amenities: "",
  });
  const [flatListStyles, setFlatListStyles] = useState(Array(props.savedFlats.length).fill(false));
  const [chosenChoices, setChosenChoices] = useState([]);

  useEffect(() => {
    setFlatListStyles(Array(props.savedFlats.length).fill(false));
    setShowInfoAction(false);
    let setID = new Set(props.savedFlats.map((flat) => flat.id));
    let newChosenChoices = [...chosenChoices];
    setChosenChoices(newChosenChoices.filter((flat)=>setID.has(flat.id)));
  }, [props.savedFlats]);

  function handleAdd() {
    if ((chosenChoices.length < 3) & !chosenChoices.find((choice) => choice.id === selectedFlat.id)) {
      let newChosenChoices = [...chosenChoices];
      newChosenChoices.push(selectedFlat);
      setChosenChoices(newChosenChoices);
    } else {
      console.log("already added!");
    }
  }

  function handleUnsave_inter() {
    props.onUnsave(selectedFlat.id);
  }

  function handleListItemClick(savedFlatID, flatObject) {
    // if selecting a flat for the first time, so data needed, or selecting another flat while one is already selected
    if (selectedFlat.id !== savedFlatID) {
      setShowInfoAction(true);
      let newFlatListStyles = Array(props.savedFlats.length).fill(false);
      newFlatListStyles[flatObject.index] = true;
      setFlatListStyles(newFlatListStyles);
      // loadData(`/api/v1/savedFlats/${uuid}/${savedFlatID}`, {})
      //   .then((res) => res.json())
      //   .then(
      //     (result) => {
      //       console.log("clickOnSavedFlat", result);
      //       let data = result["data"];
      setSelectedFlat({
        id: savedFlatID,
        latLong: flatObject.latLong,
        street: flatObject.street,
        block: flatObject.block,
        // amenities: data.amenityList
      });
      //     },
      //     (error) => {
      //       console.log(error);
      //     }
      //   );
    } else {
      let newFlatListStyles = Array(props.savedFlats.length).fill(false);
      if (showInfoAction) {
        // if deselecting the currently selected flat, so data not needed
      } else {
        // if reselecting a flat that was selected and deselected right just now, so data not needed
        newFlatListStyles[flatObject.index] = true;
      }
      setFlatListStyles(newFlatListStyles);
      setShowInfoAction((showInfoAction) => !showInfoAction);
    }
  }

  return (
    <div className={styles.chooseFlats}>
      <div className={styles.flatChoicesContainer}>
        <FlatChoices
          savedFlats={props.savedFlats}
          showInfoAction={showInfoAction}
          flatListStyles={flatListStyles}
          onClick={handleListItemClick}
          onAdd={handleAdd}
          onUnsave={handleUnsave_inter}
        />
      </div>
      <div className={styles.choiceSummaryContainer}>
        <ChoiceSummary
          formState={props.formState}
          setFormState={props.setFormState}
          handleSubmit={props.handleSubmit}
          chosenChoices={chosenChoices}
        />
      </div>
    </div>
  );
}

function FlatChoices(props) {
  return (
    <div className={styles.flatChoices}>
      <ul className={styles.flatChoiceList}>
        {props.savedFlats.length
          ? props.savedFlats.map((value, index) => (
              <ListItemFlat
                type="compare"
                key={value.id}
                savedFlatID={value.id}
                onClick={props.onClick}
                street={value.street_name}
                block={value.block}
                town={value.town}
                roomType={value.flat_type}
                price={value.monthly_rent}
                highlight={props.flatListStyles[index]}
                index={index}
              />
            ))
          : ""}
      </ul>
      {props.showInfoAction ? (
        // TODO: show saved flat information
        <div className={styles.compareAddInteraction}>
          <Form page="choiceAdd" onAdd={props.onAdd} onUnsave={props.onUnsave} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function ChoiceSummary(props) {
  console.log("choiceSummary", props.chosenChoices);
  return (
    <div className={styles.choiceSummary}>
      <div className={styles.header}>
        <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ fontSize: "1.25rem", marginRight: "0.25rem" }} />{" "}
        Currently comparing:
      </div>
      <ul className={styles.summaryList}>
        {props.chosenChoices.length
          ? props.chosenChoices.map((value, index) => (
              <>
                <ListItemSummary
                  key={value.id}
                  savedFlatID={value.id}
                  street={value.street}
                  block={value.block}
                  index={index}
                />
                {index !== props.chosenChoices.length - 1 ? <div className={styles.vs}>VS</div> : ""}
              </>
            ))
          : ""}
      </ul>
      <div className={styles.summaryActionContainer}>
        {props.chosenChoices.length >= 2 ? (
          <Form
            page="choiceSubmit"
            formState={props.formState}
            setFormState={props.setFormState}
            handleSubmit={props.handleSubmit}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

function ListItemSummary(props) {
  return (
    <li className={styles.listItemSummary}>
      <div className={styles.flatName}>{capitalizeTheFirstLetterOfEachWord(props.street) + " Blk " + props.block}</div>
    </li>
  );
}
