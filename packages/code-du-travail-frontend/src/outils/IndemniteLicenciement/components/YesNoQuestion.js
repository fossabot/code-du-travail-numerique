import React from "react";
import PropTypes from "prop-types";
import { Field } from "react-final-form";
import { OnChange } from "react-final-form-listeners";
import {
  Label,
  RadioContainer,
  QuestionParagraphe
} from "../../common/stepStyles";
import { requiredBoolean } from "../../common/validators";
import { ErrorField } from "./ErrorField";

function YesNoQuestion({ name, label, onChange, ...otherProps }) {
  return (
    <>
      <QuestionParagraphe>{label}</QuestionParagraphe>
      <RadioContainer {...otherProps}>
        <Label>
          <Field
            parse={value => value === "true"}
            component="input"
            type="radio"
            name={name}
            value={true}
            validate={requiredBoolean}
          />
          <span>Oui</span>
        </Label>
        <Label>
          <Field
            parse={value => value === "true"}
            component="input"
            type="radio"
            name={name}
            value={false}
            validate={requiredBoolean}
          />
          <span>Non</span>
        </Label>
      </RadioContainer>
      <ErrorField name={name} />
      {onChange && (
        <OnChange name={name}>{values => onChange(values)}</OnChange>
      )}
    </>
  );
}
YesNoQuestion.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired
};

export { YesNoQuestion };
