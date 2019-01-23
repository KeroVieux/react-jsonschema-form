import React from "react";

export default function IconButton(props) {
  const { type = "default", icon, className, ...otherProps } = props;
  return (
    <button
      type="button"
      icon={icon}
      className={`ant-btn ant-btn-${type} ${className}`}
      {...otherProps}
    />
  );
}
