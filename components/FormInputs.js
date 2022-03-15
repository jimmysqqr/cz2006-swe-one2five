import styles from "./FormInputs.module.scss";


export function InputText(props) {
  return (
    <div className={styles.mainFormField}>
      <label htmlFor={props.name + "_input"}>{props.label}</label>
      <input
        style={{textAlign: props.textAlign || "center"}}
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
