import React, { useState } from "react";
import Image from "next/image";

import { InputText, Select } from "/components/FormInputs";
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
      <div className={styles.mainFormFieldContainer}>
        <InputText
          label="Target Address"
          name={"targetAddr"}
          formValue={form.targetAddr}
          onChange={handleClick}
          placeholder={"eg. Bishan Street 23 Block 229"}
        />
      </div>
      <div className={styles.mainFormFieldContainer}>
        <Select label="Room Type" name={"roomType"} formValue={form.roomType} onChange={handleClick} />
      </div>
      <input className={styles.submit} type="submit" value="Lookup" />
    </form>
  );
}
