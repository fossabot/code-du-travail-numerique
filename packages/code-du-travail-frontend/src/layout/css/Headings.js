import { createGlobalStyle } from "styled-components";
import { theme } from "@socialgouv/react-ui";

const { colors, fonts, spacing } = theme;

export default createGlobalStyle`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: ${spacing.xsmall} 0 ${spacing.small} 0;
    color: ${colors.blueDark};
    font-weight: normal;
    line-height: ${fonts.lineHeight};
  }

  h1 {
    font-size: ${fonts.sizeH1};
  }

  h2 {
    font-size: ${fonts.sizeH2};
  }

  h3 {
    font-size: ${fonts.sizeH3};
  }

  h4 {
    font-size: ${fonts.sizeH4};
  }

  h5 {
    font-size: ${fonts.sizeH5};
  }

  h6 {
    font-size: ${fonts.sizeH6};
  }

`;
