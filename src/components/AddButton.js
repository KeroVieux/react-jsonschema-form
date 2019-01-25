import React from "react";

export default function AddButton({ className, onClick, disabled }) {
  return (
    <div className="ant-row">
      <p className={`ant-col-6 ant-col-offset-18 text-right ${className}`}>
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
