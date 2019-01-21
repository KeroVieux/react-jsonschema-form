import React from "react";
import PropTypes from "prop-types";

function RadioWidget(props) {
  const {
    options,
    value,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    id,
  } = props;
  // Generating a unique field name to identify this set of radio buttons
  const name = Math.random().toString();
  const { enumOptions, enumDisabled, inline } = options;
  // checked={checked} has been moved above name={name}, As mentioned in #349;
  // this is a temporary fix for radio button rendering bug in React, facebook/react#7630.
  return (
    <div className="ant-radio-group ant-radio-group-outline" id={id}>
      {enumOptions.map((option, i) => {
        const checked = option.value === value;
        const itemDisabled =
          enumDisabled && enumDisabled.indexOf(option.value) != -1;
        const disabledCls =
          disabled || itemDisabled || readonly ? "disabled" : "";
        const radio = (
          <label
            className={`ant-radio-wrapper ${
              checked ? "ant-radio-wrapper-checked" : ""
            }`}>
            <span className={`ant-radio ${checked ? "ant-radio-checked" : ""}`}>
              <input
                type="radio"
                className="ant-radio-input"
                checked={checked}
                name={name}
                required={required}
                value={option.value}
                disabled={disabled || itemDisabled || readonly}
                autoFocus={autofocus && i === 0}
                onChange={_ => onChange(option.value)}
              />
              <span className="ant-radio-inner" />
            </span>
            <span>{option.label}</span>
          </label>
        );

        return inline ? (
          <div key={i} className={`dib ${disabledCls}`}>
            {radio}
          </div>
        ) : (
          <div key={i} className={`db ${disabledCls}`}>
            {radio}
          </div>
        );
      })}
    </div>
  );
}

RadioWidget.defaultProps = {
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  RadioWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
      inline: PropTypes.bool,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}
export default RadioWidget;
