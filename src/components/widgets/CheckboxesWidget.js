import React from "react";
import PropTypes from "prop-types";

function selectValue(value, selected, all) {
  const at = all.indexOf(value);
  const updated = selected.slice(0, at).concat(value, selected.slice(at));
  // As inserting values at predefined index positions doesn't work with empty
  // arrays, we need to reorder the updated selection to match the initial order
  return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
}

function deselectValue(value, selected) {
  return selected.filter(v => v !== value);
}

function CheckboxesWidget(props) {
  const { id, disabled, options, value, autofocus, readonly, onChange } = props;
  const { enumOptions, enumDisabled, inline } = options;
  return (
    <span id={id}>
      {enumOptions.map((option, index) => {
        const checked = value.indexOf(option.value) !== -1;
        const itemDisabled =
          enumDisabled && enumDisabled.indexOf(option.value) !== -1;
        const disabledCls =
          disabled || itemDisabled || readonly ? "disabled" : "";
        const checkbox = (
          <label
            className={`ant-checkbox-group-item ant-checkbox-wrapper ${
              disabled || itemDisabled || readonly
                ? "ant-checkbox-wrapper-disabled"
                : ""
            } ${checked ? "ant-checkbox-wrapper-checked" : ""}`}>
            <span
              className={`ant-checkbox ${
                disabled || itemDisabled || readonly
                  ? "ant-checkbox-disabled"
                  : ""
              } ${checked ? "ant-checkbox-checked" : ""}`}>
              <input
                type="checkbox"
                className="ant-checkbox-input"
                value={option.value}
                id={`${id}_${index}`}
                checked={checked}
                disabled={disabled || itemDisabled || readonly}
                autoFocus={autofocus && index === 0}
                onChange={event => {
                  const all = enumOptions.map(({ value }) => value);
                  if (event.target.checked) {
                    onChange(selectValue(option.value, value, all));
                  } else {
                    onChange(deselectValue(option.value, value));
                  }
                }}
              />
              <span className="ant-checkbox-inner" />
            </span>
            <span>{option.label}</span>
          </label>
        );
        return inline ? (
          <div key={index} className={`ant-checkbox-group dib ${disabledCls}`}>
            {checkbox}
          </div>
        ) : (
          <div key={index} className={`ant-checkbox-group db ${disabledCls}`}>
            {checkbox}
          </div>
        );
      })}
    </span>
  );
}

CheckboxesWidget.defaultProps = {
  autofocus: false,
  options: {
    inline: false,
  },
};

if (process.env.NODE_ENV !== "production") {
  CheckboxesWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    options: PropTypes.shape({
      enumOptions: PropTypes.array,
      inline: PropTypes.bool,
    }).isRequired,
    value: PropTypes.any,
    required: PropTypes.bool,
    readonly: PropTypes.bool,
    disabled: PropTypes.bool,
    multiple: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
  };
}

export default CheckboxesWidget;
