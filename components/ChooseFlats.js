import React, { useState } from "react";

import { Form } from "/components/Form";
import { ListItemFlat } from "/components/ListItemFlat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightArrowLeft } from "@fortawesome/free-solid-svg-icons";

import styles from "./ChooseFlats.module.scss";

export function ChooseFlats(props) {
  return (
    <div className={styles.chooseFlats}>
      <div className={styles.flatChoicesContainer}>
        <FlatChoices />
      </div>
      <div className={styles.choiceSummaryContainer}>
        <ChoiceSummary
          formState={props.formState}
          setFormState={props.setFormState}
          handleSubmit={props.handleSubmit}
        />
      </div>
    </div>
  );
}

function FlatChoices(props) {
  const [showListItem, setShowAggregate] = useState(true);
  const [selectedFlat, setSelectedFlat] = useState(null);


  return (
    <div className={styles.flatChoices}>
      <ul className={styles.flatChoiceList}>
        <ListItemFlat type="compare" />
        <ListItemFlat type="compare" />
        <ListItemFlat type="compare" />
        <ListItemFlat type="compare" />
        <ListItemFlat type="compare" />
        <ListItemFlat type="compare" />
        <ListItemFlat type="compare" />
        <ListItemFlat type="compare" />
        <ListItemFlat type="compare" />
      </ul>
      <div className={styles.compareAddInteraction}>
        <Form
          page="choiceAdd"
          formState={props.formState}
          setFormState={props.setFormState}
          handleSubmit={props.handleSubmit}
        />
      </div>
    </div>
  );
}

// function FlatChoiceItem() {
//   return (<div className={styles.flatChoiceItem}>
//     FlatChoiceItem
//   </div>)
// }

function ChoiceSummary(props) {
  return (
    <div className={styles.choiceSummary}>
      <div className={styles.header}>
        <FontAwesomeIcon icon={faArrowRightArrowLeft} style={{ fontSize: "1.25rem", marginRight: "0.25rem" }} />{" "}
        Currently comparing:
      </div>
      <ul className={styles.summaryList}>
        <ListItemSummary />
        <ListItemSummary />
        <ListItemSummary />
      </ul>
      <div className={styles.summaryActionContainer}>
        <Form
          page="choiceSubmit"
          formState={props.formState}
          setFormState={props.setFormState}
          handleSubmit={props.handleSubmit}
        />
      </div>
    </div>
  );
}

function ListItemSummary() {
  return (
    <li className={styles.listItemSummary}>
      <div className={styles.flatName}>Pasir Ris Avenue Block 35 Crescent Street 53</div>
      <div className={styles.vs}>VS</div>
    </li>
  );
}
