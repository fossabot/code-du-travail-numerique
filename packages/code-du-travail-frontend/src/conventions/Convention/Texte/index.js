import React from "react";
import PropTypes from "prop-types";

import { theme } from "@socialgouv/react-ui";
import Sidebar from "./Sidebar";
import ContentWrapper from "./ContentWrapper";
import styled from "styled-components";

const Texte = ({ node, title }) => {
  let rootSection = node;
  // skip the first content level if it's only a "wrapper"
  if (
    rootSection.children &&
    rootSection.children.length === 1 &&
    rootSection.children[0].children
  ) {
    rootSection = node.children[0];
  }
  return (
    <Wrapper>
      <Sidebar node={rootSection} />
      <ContentWrapper node={rootSection} title={title} />
    </Wrapper>
  );
};

Texte.propTypes = {
  title: PropTypes.string,
  node: PropTypes.shape({
    type: PropTypes.string,
    data: PropTypes.object,
    children: PropTypes.array
  }).isRequired
};

export default Texte;

const Wrapper = styled.div`
  @media (min-width: ${theme.breakpoints.tablet}) {
    display: flex;
    justify-content: center;
  }
`;
