import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Content from "./Content";
import { Section, theme } from "@socialgouv/react-ui";

const ContentWrapper = ({ node, title }) => {
  return (
    <StyledSection>
      {title && <H2>{title}</H2>}
      <Content depth={0} node={node} />
    </StyledSection>
  );
};

ContentWrapper.propTypes = {
  node: PropTypes.object.isRequired
};

export default ContentWrapper;

const { breakpoints, spacing } = theme;

const StyledSection = styled(Section)`
  @media (min-width: ${breakpoints.tablet}) {
    flex: 0 1 65%;
    overflow: scroll;
  }
`;

const H2 = styled.h2`
  margin-top: 0;
  margin-bottom: ${spacing.large};
`;
