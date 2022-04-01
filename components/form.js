import Link from "next/link";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleMinus } from "@fortawesome/free-solid-svg-icons";

import { InputText, InputNumber, Select } from "/components/FormInputs";
import { roomValuetoDisplay, amenityValueToDisplay } from "./data/formOptions";
import styles from "./Form.module.scss";

export function Form(props) {
  function handleClick(event) {
    let changedValue = event.target.value;
    let fieldChanged = event.target.name;
    const updatedForm = {
      ...props.formState,
      [fieldChanged]: changedValue,
    };
    props.setFormState(updatedForm);
  }

  if (props.page == "lookup") {
    return (
      <form className={`${styles.form} ${styles.lookupForm}`} onSubmit={props.handleSubmit}>
        <div className={styles.mainFormFieldContainer}>
          <InputText
            label="Target Address"
            name={"targetAddr"}
            formValue={props.formState.targetAddr}
            onChange={handleClick}
            placeholder={"eg. Bishan Street 23 Block 229"}
          />
        </div>
        <div className={`${styles.smallFormFieldContainer} ${styles.reducedWidth}`}>
          <Select
            label="Room Type"
            name={"roomType"}
            formValue={props.formState.roomType}
            size={"small"}
            options={roomValuetoDisplay}
            onChange={handleClick}
          />
        </div>
        <input className={`${styles.button} ${styles.primary}`} type="submit" value="Lookup" />
      </form>
    );
  } else if (props.page == "search") {
    return (
      <form className={`${styles.form} ${styles.searchForm}`} onSubmit={props.handleSubmit}>
        <div className={styles.mainFormFieldContainer}>
          <InputText
            label="Town"
            name={"town"}
            formValue={props.formState.town}
            onChange={handleClick}
            placeholder={"eg. Punggol"}
          />
        </div>
        <div className={styles.mainFormFieldContainer}>
          <Select
            label="Room Type"
            name={"roomType"}
            formValue={props.formState.roomType}
            options={roomValuetoDisplay}
            onChange={handleClick}
          />
        </div>
        <label className={styles.label} htmlFor="amenityContainer">
          Nearby Amenities
        </label>
        <div className={`${styles.mainFormFieldContainer} ${styles.amenityContainer}`} id="amenityContainer">
          <div className={styles.selectAmenityContainer}>
            <Select
              name={"nearbyAmenity"}
              formValue={props.formState.nearbyAmenity}
              options={amenityValueToDisplay}
              onChange={handleClick}
            />
          </div>
          <div className={styles.formFieldText}>within</div>
          <div className={styles.selectDistanceContainer}>
            <InputNumber
              name={"nearbyAmenityDistance"}
              formValue={props.formState.nearbyAmenityDistance}
              onChange={handleClick}
              placeholder={"eg. 800m"}
            />
          </div>
        </div>
        <label className={styles.label} htmlFor="priceRangeContainer">
          Price range ($ per month)
        </label>
        <div className={`${styles.mainFormFieldContainer} ${styles.priceRangeContainer}`} id="priceRangeContainer">
          <div className={styles.lowerBoundContainer}>
            <InputNumber
              name={"priceLowerBound"}
              formValue={props.formState.priceLowerBound}
              onChange={handleClick}
              placeholder={"eg. 2000"}
            />
          </div>
          <div className={styles.formFieldText}>-</div>
          <div className={styles.upperBoundContainer}>
            <InputNumber
              name={"priceUpperBound"}
              formValue={props.formState.priceUpperBound}
              onChange={handleClick}
              placeholder={"eg. 4000"}
            />
          </div>
        </div>
        <input className={`${styles.button} ${styles.primary}`} type="submit" value="Search" />
      </form>
    );
  } else if (props.page == "searchResults") {
    return (
      <form className={`${styles.form} ${styles.searchResultsForm}`} onSubmit={props.handleSubmit}>
        <div className={styles.searchContainer}>
          <div className={styles.leftSearchContainer}>
            <div className={styles.smallFormFieldContainer}>
              <InputText
                label="Town"
                name={"town"}
                formValue={props.formState.town}
                size={"small"}
                onChange={handleClick}
                placeholder={"eg. Punggol"}
                wrap="nowrap"
              />
            </div>
            <div className={styles.smallFormFieldContainer}>
              <Select
                label="Room Type"
                name={"roomType"}
                formValue={props.formState.roomType}
                size={"small"}
                options={roomValuetoDisplay}
                onChange={handleClick}
                wrap="nowrap"
              />
            </div>
          </div>
          <div className={`${styles.centerSearchContainer} ${styles.small}`}>
            <div className={styles.labelInputNoWrap}>
              <label className={styles.label} htmlFor="amenityContainer">
                Nearby Amenities
              </label>
              <div className={`${styles.smallFormFieldContainer} ${styles.amenityContainer}`} id="amenityContainer">
                <div className={styles.selectAmenityContainer}>
                  <Select
                    name={"nearbyAmenity"}
                    formValue={props.formState.nearbyAmenity}
                    size={"small"}
                    options={amenityValueToDisplay}
                    onChange={handleClick}
                  />
                </div>
                <div className={styles.formFieldText}>within</div>
                <div className={styles.selectDistanceContainer}>
                  <InputNumber
                    name={"nearbyAmenityDistance"}
                    formValue={props.formState.nearbyAmenityDistance}
                    size={"small"}
                    onChange={handleClick}
                    placeholder={"eg. 800m"}
                  />
                </div>
              </div>
            </div>
            <div className={styles.labelInputNoWrap}>
              <label className={styles.label} htmlFor="priceRangeContainer">
                Price range ($ per month)
              </label>
              <div className={`${styles.smallFormFieldContainer} ${styles.priceRangeContainer}`} id="priceRangeContainer">
                <div className={styles.lowerBoundContainer}>
                  <InputNumber
                    name={"priceLowerBound"}
                    formValue={props.formState.priceLowerBound}
                    size={"small"}
                    onChange={handleClick}
                    placeholder={"eg. 2000"}
                  />
                </div>
                <div className={styles.formFieldText}>-</div>
                <div className={styles.upperBoundContainer}>
                  <InputNumber
                    name={"priceUpperBound"}
                    formValue={props.formState.priceUpperBound}
                    size={"small"}
                    onChange={handleClick}
                    placeholder={"eg. 4000"}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rightSearchContainer}>
            <button className={`${styles.button} ${styles.secondary}`} type="reset">Reset</button>
            <input className={`${styles.button} ${styles.primary}`} type="submit" value="Search" />
          </div>
        </div>
      </form>
    );
  } else if (props.page == "lookupResults") {
    return (
      <div className={`${styles.lookupResultsInteraction}`}>
        <div className={`${styles.button} ${styles.secondary}`}><Link href="/">
            <a>Back to Lookup</a>
          </Link></div>
        <input className={`${styles.button} ${styles.primary}`} type="submit" value="Save" />
      </div>
    );
  } else if (props.page == "choiceAdd") {
    return (
      <div className={styles.choicesInteraction}>
        <div className={`${styles.button} ${styles.secondary}`}>Unsave</div>
        <input className={`${styles.button} ${styles.primary}`} type="submit" value="Add to Comparison" />
      </div>
    );
  } else if (props.page == "choiceSubmit") {
    return (
      <div className={styles.summaryInteraction}>
        <input className={`${styles.button} ${styles.primary}`} type="submit" value="Compare Flats" />
      </div>
    );
  } else if (props.page == "comparisonRemove") {
    return (
      <div className={styles.comparisonInteraction}>
        <div className={`${styles.button} ${styles.secondary}`}><FontAwesomeIcon icon={faCircleMinus} style={{ fontSize: "1rem", opacity: "0.75", marginRight: "0.5rem"}} /> Remove from comparison</div>
      </div>
    );
  } else return;
}

