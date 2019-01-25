import React from "react";
import PropTypes from "prop-types";

function DescriptionField(props) {
  const { id, description } = props;
  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  return (
    <div className="ant-row">
      <div className="ant-col-xs-24 ant-col-sm-6" />
      <div className="ant-col-xs-24 ant-col-sm-18">
        <div id={id} className="ant-form-explain">
          {description}
        </div>
      </div>
    </div>
  );
}

if (process.env.NODE_ENV !== "production") {
  DescriptionField.propTypes = {
    id: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  };
}

export default DescriptionField;
