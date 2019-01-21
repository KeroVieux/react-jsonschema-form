import React from "react";
import PropTypes from "prop-types";
import DescriptionField from "../fields/DescriptionField.js";

function CheckboxWidget(props) {
  const {
    schema,
    id,
    value,
    required,
    disabled,
    readonly,
    label,
    autofocus,
    onChange,
  } = props;
  return (
    <div>
      {schema.description && (
        <DescriptionField description={schema.description} />
      )}
      <label
        className={`ant-checkbox-wrapper ${
          disabled || readonly ? "ant-checkbox-wrapper-disabled" : ""
        } ${value ? "ant-checkbox-wrapper-checked" : ""}`}>
        <span
          className={`ant-checkbox ${
            disabled || readonly ? "ant-checkbox-disabled" : ""
          } ${value ? "ant-checkbox-checked" : ""}`}>
          <input
            type="checkbox"
            className="ant-checkbox-input"
            id={id}
            checked={typeof value === "undefined" ? false : value}
            required={required}
            disabled={disabled || readonly}
            autoFocus={autofocus}
            onChange={event => onChange(event.target.checked)}
          />
          <span className="ant-checkbox-inner" />
        </span>
        <span>{label}</span>
      </label>
    </div>
  );
}

CheckboxWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  CheckboxWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    value: PropTypes.bool,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default CheckboxWidget;
