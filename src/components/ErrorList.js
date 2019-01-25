import React from "react";

export default function ErrorList(props) {
  const { errors } = props;
  return (
    <div className="ant-card ant-card-bordered">
      <div className="ant-card-head">
        <div className="ant-card-head-wrapper">
          <div className="ant-card-head-title">错误列表</div>
        </div>
      </div>
      <div className="ant-card-body">
        <ul>
          {errors.map((error, i) => {
            return (
              <li key={i} className="has-error">
                {error.stack}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
