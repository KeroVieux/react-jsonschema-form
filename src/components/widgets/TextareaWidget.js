import React from "react";
import PropTypes from "prop-types";

function TextareaWidget(props) {
  const {
    id,
    options,
    placeholder,
    value,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    onBlur,
    onFocus,
  } = props;
  const _onChange = ({ target: { value } }) => {
    return onChange(value === "" ? options.emptyValue : value);
  };
  return (
    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
      <div className="ant-form-item-control">
        <span className="ant-form-item-children">
          <textarea
            id={id}
            className="ant-input"
            value={typeof value === "undefined" ? "" : value}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            readOnly={readonly}
            autoFocus={autofocus}
            rows={options.rows}
            onBlur={onBlur && (event => onBlur(id, event.target.value))}
            onFocus={onFocus && (event => onFocus(id, event.target.value))}
            onChange={_onChange}
          />
        </span>
      </div>
    </div>
  );
}

TextareaWidget.defaultProps = {
  autofocus: false,
  options: {},
};

if (process.env.NODE_ENV !== "production") {
  TextareaWidget.propTypes = {
    schema: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.shape({
      rows: PropTypes.number,
    }),
    value: PropTypes.string,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
  };
}

export default TextareaWidget;
