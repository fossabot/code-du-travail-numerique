import React from "react";
import { render } from "@testing-library/react";
import GlobalStyles from "../css/index.js";

describe("<GlobalStyles />", () => {
  it("should render", () => {
    const { container } = render(<GlobalStyles />);
    expect(container).toMatchSnapshot();
  });
});
