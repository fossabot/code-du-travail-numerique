import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { StepInfosGenerales } from "../InfosGenerales";
import { Form } from "react-final-form";
import { CONTRACT_TYPE } from "../../components/TypeContrat";

function renderForm(data) {
  return render(
    <Form
      validate={StepInfosGenerales.validate}
      initialValues={{ ...data }}
      onSubmit={jest.fn()}
    >
      {({ form }) => <StepInfosGenerales form={form} />}
    </Form>
  );
}

describe("<StepInfosGenerales />", () => {
  it("should render", () => {
    const { container } = renderForm({});
    expect(container).toMatchSnapshot();
  });

  it("should render with CDD", () => {
    const { container } = renderForm({
      contractType: CONTRACT_TYPE.CDD
    });
    expect(container).toMatchSnapshot();
  });

  it("should render with CTT", () => {
    const { container } = renderForm({ contractType: CONTRACT_TYPE.CTT });
    expect(container).toMatchSnapshot();
  });

  it("should display and error if ctt and contrat is mission-formation", () => {
    const { getByTestId, getByText } = renderForm({
      contractType: CONTRACT_TYPE.CTT
    });
    const missionFormation = getByTestId("cttFormation").querySelector(
      `input[value=true]`
    );
    fireEvent.click(missionFormation);
    // blur is need to force validation in react-testing-lib
    fireEvent.blur(missionFormation);
    expect(getByText(/ne vous permet pas/i)).toBeTruthy();
  });
  it("should display and info alert if ctt and contrat is not mission-formation", () => {
    const { getByTestId, getByText } = renderForm({
      contractType: CONTRACT_TYPE.CTT
    });
    const missionFormation = getByTestId("cttFormation").querySelector(
      `input[value=false]`
    );
    fireEvent.click(missionFormation);
    // blur is need to force validation in react-testing-lib
    fireEvent.blur(missionFormation);
    expect(getByText(/attention/i)).toBeTruthy();
  });
});
