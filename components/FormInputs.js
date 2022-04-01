import styles from "./FormInputs.module.scss";
import { renderOptions } from "./data/formOptions";

export function InputText(props) {
  let size = "";
  let wrap = "";
  let onKeyPress = () => {};
  if (props.size == "small") {
    size = styles.small;
  }
  if (props.onKeyPress) {
    onKeyPress = props.onKeyPress;
  }
  if (props.wrap == "nowrap") {
    wrap = styles.wrap;
  }

  return (
    <div className={`${styles.formField} ${size} ${wrap}`}>
      {props.label ? (
        <label className={styles.label} htmlFor={props.name + "_input"}>
          {props.label}
        </label>
      ) : (
        ""
      )}
      <input
        style={{ textAlign: props.textAlign || "center" }}
        type="text"
        value={props.formValue}
        onChange={props.onChange}
        name={props.name}
        id={props.name + "_input"}
        placeholder={props.placeholder}
        onKeyPress={onKeyPress}
      />
    </div>
  );
}

export function InputNumber(props) {
  let size = "";
  let onKeyPress = () => {};
  if (props.size == "small") {
    size = styles.small;
  }
  if (props.onKeyPress) {
    onKeyPress = props.onKeyPress;
  }

  return (
    <div className={`${styles.formField} ${size}`}>
      {props.label ? (
        <label className={styles.label} htmlFor={props.name + "_input"}>
          {props.label}
        </label>
      ) : (
        ""
      )}
      <input
        style={{ textAlign: props.textAlign || "center" }}
        type="number"
        value={props.formValue}
        onChange={props.onChange}
        name={props.name}
        size="1"
        id={props.name + "_input"}
        placeholder={props.placeholder}
        onKeyPress={onKeyPress}
      />
    </div>
  );
}

export function Select(props) {
  let size = "";
  let wrap = "";
  if (props.size == "small") {
    size = styles.small;
  }
  if (props.wrap == "nowrap") {
    wrap = styles.wrap;
  }

  return (
    <div className={`${styles.formField} ${size} ${wrap}`}>
      {props.label ? (
        <label className={styles.label} htmlFor={props.name + "_select"}>
          {props.label}
        </label>
      ) : (
        ""
      )}
      <div className={styles.selectCustomContainer}>
        <select value={props.formValue} onChange={props.onChange} name={props.name} id={props.name + "_select"}>
          {renderOptions(props.options)}
        </select>
        <div className={styles.selectBg}></div>
      </div>
    </div>
  );
}
