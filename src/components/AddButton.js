import React from "react";

export default function AddButton({ className, onClick, disabled }) {
  return (
    <div className="row">
      <p className={`col-xs-3 col-xs-offset-9 text-right ${className}`}>
        <button
          type="button"
          tabIndex="0"
          onClick={onClick}
          disabled={disabled}
          className="ant-btn ant-btn-primary">
          <i className="fa fa-plus" />
        </button>
      </p>
    </div>
  );
}
