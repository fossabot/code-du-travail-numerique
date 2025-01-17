import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field } from "react-final-form";
import { theme } from "@socialgouv/react-ui";
import { OnChange } from "react-final-form-listeners";

import { Label, QuestionParagraphe } from "../common/stepStyles";
import { required } from "../common/validators";
import { ErrorField } from "../IndemniteLicenciement/components/ErrorField";

function RadioQuestion({ name, label, options, onChange }) {
  return (
    <>
      <Fieldset>
        <QuestionParagraphe as="legend">{label}</QuestionParagraphe>
        <Radios name={name} options={options} />
        <ErrorField name={name} />
        {onChange && (
          <OnChange name={name}>{values => onChange(values)}</OnChange>
        )}
      </Fieldset>
    </>
  );
}

RadioQuestion.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.object.isRequired,
  onChange: PropTypes.func
};

export { RadioQuestion };

function Radios({ name, options }) {
  return Object.entries(options).map(([key, label]) => (
    <RadioContainer key={`${name}-${key}`}>
      <Label>
        <Field
          component="input"
          type="radio"
          name={name}
          value={key}
          validate={required}
        />
        <span>{label}</span>
      </Label>
    </RadioContainer>
  ));
}

const { spacing } = theme;

const Fieldset = styled.fieldset`
  margin-left: 0;
  padding-left: 0;
  border: none;
`;
const RadioContainer = styled.div`
  margin-bottom: ${spacing.small};
`;
