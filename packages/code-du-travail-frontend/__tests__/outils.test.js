import React from "react";
import { render } from "@testing-library/react";
import Tool from "../pages/outils/[slug]";

describe("<Tool />", () => {
  it("should render", () => {
    const { container } = render(<Tool />);
    expect(container).toMatchSnapshot();
  });
});
