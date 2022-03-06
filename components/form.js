
import React, { useState } from "react";
import Image from "next/image";

import styles from "./Form.module.scss";

export function Form() {

  const [form, setForm] = useState({
    targetAddr: "",
    roomType: "",
  });

  function handleClick(event) {
    let changedValue = event.target.value;
    let fieldChanged = event.target.name;
    const updatedForm = {
      ...form,
      [fieldChanged]: changedValue,
    };
    setForm(updatedForm);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log(form);
  }

  return (
    <form className={styles.mainForm} onSubmit={handleSubmit}>
      <InputText
        label="Target Address"
        name={"targetAddr"}
        formValue={form.targetAddr}
        onChange={handleClick}
        placeholder={"eg. Bishan Street 23 Block 229"}
      />
      <Select label="Room Type" name={"roomType"} formValue={form.roomType} onChange={handleClick} />
      <input className={styles.submit} type="submit" value="Lookup" />
    </form>
  );
}


export function InputText(props) {
  return (
    <div className={styles.mainFormField}>
      <label htmlFor={props.name + "_input"}>{props.label}</label>
      <input
        type="text"
        value={props.formValue}
        onChange={props.onChange}
        name={props.name}
        id={props.name + "_input"}
        placeholder={props.placeholder}
      />
    </div>
  );
}

export function Select(props) {
  return (
    <div className={styles.mainFormField}>
      <label htmlFor={props.name + "_select"}>{props.label}</label>
      <select value={props.formValue} onChange={props.onChange} name={props.name} id={props.name + "_select"}>
        <option value="">All</option>
        <option value="1room">1-Room</option>
        <option value="2room">2-Room</option>
        <option value="3room">3-Room</option>
        <option value="4room">4-Room</option>
      </select>
      <div className={styles.selectBg}>
      </div>
    </div>
  );
}
