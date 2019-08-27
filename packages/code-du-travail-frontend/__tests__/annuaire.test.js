import React from "react";
import { render } from "@testing-library/react";
import Annuaire from "../pages/annuaire.js";

describe("<Annuaire />", () => {
  it("should render", () => {
    const { container } = render(<Annuaire />);
    expect(container).toMatchSnapshot();
  });
});