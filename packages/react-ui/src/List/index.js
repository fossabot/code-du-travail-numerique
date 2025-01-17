import PropTypes from "prop-types";
import styled from "styled-components";

export const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

List.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

List.defaultProps = {
  className: ""
};

export const ListItem = styled.li``;
