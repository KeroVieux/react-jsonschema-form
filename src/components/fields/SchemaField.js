import { ADDITIONAL_PROPERTY_FLAG } from "../../utils";
import React from "react";
import PropTypes from "prop-types";
import * as types from "../../types";

import {
  isMultiSelect,
  isSelect,
  retrieveSchema,
  toIdSchema,
  getDefaultRegistry,
  mergeObjects,
  getUiOptions,
  isFilesArray,
  deepEquals,
  getSchemaType,
} from "../../utils";
import UnsupportedField from "./UnsupportedField";

const COMPONENT_TYPES = {
  array: "ArrayField",
  boolean: "BooleanField",
  integer: "NumberField",
  number: "NumberField",
  object: "ObjectField",
  string: "StringField",
};

function getFieldComponent(schema, uiSchema, idSchema, fields) {
  const field = uiSchema["ui:field"];
  if (typeof field === "function") {
    return field;
  }
  if (typeof field === "string" && field in fields) {
    return fields[field];
  }

  const componentName = COMPONENT_TYPES[getSchemaType(schema)];

  // If the type is not defined and the schema uses 'anyOf' or 'oneOf', don't
  // render a field and let the MultiSchemaField component handle the form display
  if (!componentName && (schema.anyOf || schema.oneOf)) {
    return () => null;
  }

  return componentName in fields
    ? fields[componentName]
    : () => {
        return (
          <UnsupportedField
            schema={schema}
            idSchema={idSchema}
            reason={`Unknown field type ${schema.type}`}
          />
        );
      };
}

function Label(props) {
  const { label, required, id } = props;
  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  return (
    <div className="ant-col-xs-24 ant-col-sm-6 ant-form-item-label">
      <label className={required ? "ant-form-item-required" : ""} htmlFor={id}>
        {label}
      </label>
    </div>
  );
}

function LabelInput(props) {
  const { id, label, onChange } = props;
  return (
    <div className="ant-form-item-control-wrapper ant-col-xs-24 ant-col-sm-18">
      <div className="ant-form-item-control">
        <span className="ant-form-item-children">
          <input
            className="ant-input"
            type="text"
            id={id}
            onBlur={event => onChange(event.target.value)}
            defaultValue={label}
          />
        </span>
      </div>
    </div>
  );
}

function Help(props) {
  const { help } = props;
  if (!help) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  return (
    <div className="ant-row" style={{ clear: "both" }}>
      <div className="ant-col-xs-24 ant-col-sm-6" />
      <div className="ant-col-xs-24 ant-col-sm-18">
        <div className="ant-form-extra a">{help}</div>
      </div>
    </div>
  );
}

function ErrorList(props) {
  const { errors = [] } = props;
  if (errors.length === 0) {
    return <div />;
  }
  return (
    <ul className="error-detail" style={{ clear: "both" }}>
      {errors.map((error, index) => {
        return (
          <li className="ant-form-explain" key={index}>
            {error}
          </li>
        );
      })}
    </ul>
  );
}
function DefaultTemplate(props) {
  const {
    id,
    classNames,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
    onKeyChange,
    onDropPropertyClick,
  } = props;
  if (hidden) {
    return <div className="hidden">{children}</div>;
  }

  const additional = props.schema.hasOwnProperty(ADDITIONAL_PROPERTY_FLAG);
  const keyLabel = `${label} Key`;

  return (
    <div className={classNames}>
      <div className={additional ? "ant-row form-additional" : ""}>
        {additional && (
          <div className="ant-col-10 form-additional">
            <div className="ant-form-item-control ant">
              <Label label={keyLabel} required={required} id={`${id}-key`} />
              <LabelInput
                label={label}
                required={required}
                id={`${id}-key`}
                onChange={onKeyChange}
              />
            </div>
          </div>
        )}

        <div
          className={
            additional
              ? "form-additional ant-form-item-control ant-col-10"
              : "ant-row"
          }>
          {displayLabel && <Label label={label} required={required} id={id} />}
          {children}
          {displayLabel && description ? description : null}
          {errors}
          {help}
        </div>
        <div
          className="ant-col-4"
          style={{ paddingLeft: "10px", paddingTop: "4px" }}>
          {additional && (
            <button
              type="danger"
              tabIndex="-1"
              style={{ border: "0" }}
              disabled={props.disabled || props.readonly}
              onClick={onDropPropertyClick(props.label)}
              className="array-item-remove ant-btn ant-btn-danger">
              <i className="fa fa-remove" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
if (process.env.NODE_ENV !== "production") {
  DefaultTemplate.propTypes = {
    id: PropTypes.string,
    classNames: PropTypes.string,
    label: PropTypes.string,
    children: PropTypes.node.isRequired,
    errors: PropTypes.element,
    rawErrors: PropTypes.arrayOf(PropTypes.string),
    help: PropTypes.element,
    rawHelp: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    description: PropTypes.element,
    rawDescription: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    hidden: PropTypes.bool,
    required: PropTypes.bool,
    readonly: PropTypes.bool,
    displayLabel: PropTypes.bool,
    fields: PropTypes.object,
    formContext: PropTypes.object,
  };
}

DefaultTemplate.defaultProps = {
  hidden: false,
  readonly: false,
  required: false,
  displayLabel: true,
};

function SchemaFieldRender(props) {
  const {
    uiSchema,
    formData,
    errorSchema,
    idPrefix,
    name,
    onKeyChange,
    onDropPropertyClick,
    required,
    registry = getDefaultRegistry(),
  } = props;
  const {
    definitions,
    fields,
    formContext,
    FieldTemplate = DefaultTemplate,
  } = registry;
  let idSchema = props.idSchema;
  const schema = retrieveSchema(props.schema, definitions, formData);
  idSchema = mergeObjects(
    toIdSchema(schema, null, definitions, formData, idPrefix),
    idSchema
  );
  const FieldComponent = getFieldComponent(schema, uiSchema, idSchema, fields);
  const { DescriptionField } = fields;
  const disabled = Boolean(props.disabled || uiSchema["ui:disabled"]);
  const readonly = Boolean(props.readonly || uiSchema["ui:readonly"]);
  const autofocus = Boolean(props.autofocus || uiSchema["ui:autofocus"]);

  if (Object.keys(schema).length === 0) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }

  const uiOptions = getUiOptions(uiSchema);
  let { label: displayLabel = true } = uiOptions;
  if (schema.type === "array") {
    displayLabel =
      isMultiSelect(schema, definitions) ||
      isFilesArray(schema, uiSchema, definitions);
  }
  if (schema.type === "object") {
    displayLabel = false;
  }
  if (schema.type === "boolean" && !uiSchema["ui:widget"]) {
    displayLabel = false;
  }
  if (uiSchema["ui:field"]) {
    displayLabel = false;
  }

  const { __errors, ...fieldErrorSchema } = errorSchema;

  // See #439: uiSchema: Don't pass consumed class names to child components
  const field = (
    <FieldComponent
      {...props}
      idSchema={idSchema}
      schema={schema}
      uiSchema={{ ...uiSchema, classNames: undefined }}
      disabled={disabled}
      readonly={readonly}
      autofocus={autofocus}
      errorSchema={fieldErrorSchema}
      formContext={formContext}
      rawErrors={__errors}
    />
  );

  const { type } = schema;
  const id = idSchema.$id;
  const label =
    uiSchema["ui:title"] || props.schema.title || schema.title || name;
  const description =
    uiSchema["ui:description"] ||
    props.schema.description ||
    schema.description;
  const errors = __errors;
  const help = uiSchema["ui:help"];
  const hidden = uiSchema["ui:widget"] === "hidden";
  const classNames = [
    "ant-form-item",
    "field",
    `field-${type}`,
    errors && errors.length > 0 ? "has-error" : "",
    uiSchema.classNames,
  ]
    .join(" ")
    .trim();

  const fieldProps = {
    description: (
      <DescriptionField
        id={id + "__description"}
        description={description}
        formContext={formContext}
      />
    ),
    rawDescription: description,
    help: <Help help={help} />,
    rawHelp: typeof help === "string" ? help : undefined,
    errors: <ErrorList errors={errors} />,
    rawErrors: errors,
    id,
    label,
    hidden,
    onKeyChange,
    onDropPropertyClick,
    required,
    disabled,
    readonly,
    displayLabel,
    classNames,
    formContext,
    fields,
    schema,
    uiSchema,
  };

  const _AnyOfField = registry.fields.AnyOfField;
  const _OneOfField = registry.fields.OneOfField;

  return (
    <FieldTemplate {...fieldProps}>
      {field}

      {/*
        If the schema `anyOf` or 'oneOf' can be rendered as a select control, don't
        render the selection and let `StringField` component handle
        rendering
      */}
      {schema.anyOf && !isSelect(schema) && (
        <_AnyOfField
          disabled={disabled}
          errorSchema={errorSchema}
          formData={formData}
          idPrefix={idPrefix}
          idSchema={idSchema}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          options={schema.anyOf}
          baseType={schema.type}
          registry={registry}
          safeRenderCompletion={props.safeRenderCompletion}
          uiSchema={uiSchema}
        />
      )}

      {schema.oneOf && !isSelect(schema) && (
        <_OneOfField
          disabled={disabled}
          errorSchema={errorSchema}
          formData={formData}
          idPrefix={idPrefix}
          idSchema={idSchema}
          onBlur={props.onBlur}
          onChange={props.onChange}
          onFocus={props.onFocus}
          options={schema.oneOf}
          baseType={schema.type}
          registry={registry}
          safeRenderCompletion={props.safeRenderCompletion}
          uiSchema={uiSchema}
        />
      )}
    </FieldTemplate>
  );
}

class SchemaField extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    // if schemas are equal idSchemas will be equal as well,
    // so it is not necessary to compare
    return !deepEquals(
      { ...this.props, idSchema: undefined },
      { ...nextProps, idSchema: undefined }
    );
  }

  render() {
    return SchemaFieldRender(this.props);
  }
}

SchemaField.defaultProps = {
  uiSchema: {},
  errorSchema: {},
  idSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false,
};

if (process.env.NODE_ENV !== "production") {
  SchemaField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    idSchema: PropTypes.object,
    formData: PropTypes.any,
    errorSchema: PropTypes.object,
    registry: types.registry.isRequired,
  };
}

export default SchemaField;
