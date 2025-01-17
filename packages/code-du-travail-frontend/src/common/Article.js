import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { Tag, Container, Section, theme, Wrapper } from "@socialgouv/react-ui/";

const Article = ({
  title,
  tags,
  sourceType,
  date,
  wide,
  onTagClick,
  children
}) => {
  return (
    <Section data-main-content>
      <Container>
        <Wrapper variant="light">
          <Section>
            <Header narrow={!wide} noPadding>
              <h1>{title}</h1>
              <Meta>
                {sourceType && <Type>{sourceType}</Type>}
                {date && (
                  <Date>
                    Mis à jour le&nbsp;: <DateValue>{date}</DateValue>
                  </Date>
                )}
              </Meta>
              <Tags>
                {tags.map(tag => (
                  <StyledTag key={tag} onClick={() => onTagClick(tag)}>
                    {tag}
                  </StyledTag>
                ))}
              </Tags>
            </Header>
            {children && (
              <Container narrow={!wide} noPadding>
                {children}
              </Container>
            )}
          </Section>
        </Wrapper>
      </Container>
    </Section>
  );
};

Article.propTypes = {
  /** article title */
  title: PropTypes.string.isRequired,
  /** article content */
  children: PropTypes.node,
  date: PropTypes.string,
  sourceType: PropTypes.string,
  wide: PropTypes.bool,
  /** list of tags */
  tags: PropTypes.array,
  className: PropTypes.string,
  style: PropTypes.object,
  /** when user clicks some tag */
  onTagClick: PropTypes.func
};

Article.defaultProps = {
  tags: []
};

export default Article;

const { breakpoints, colors, fonts, spacing } = theme;

const Header = styled(Container)`
  position: relative;
  margin-bottom: ${spacing.interComponent};
`;

const Meta = styled.div`
  display: flex;
  align-items: flex-end;
  @media (max-width: ${breakpoints.mobile}) {
    flex-flow: column;
    align-items: flex-start;
  }
`;

const Type = styled.span`
  color: ${colors.lightText};
  font-weight: 600;
`;

const Date = styled.span`
  display: inline-block;
  margin-left: ${spacing.base};
  color: ${colors.lightText};
  font-size: ${fonts.sizeSmall};
  @media (max-width: ${breakpoints.mobile}) {
    margin-left: 0;
  }
`;
const DateValue = styled.span`
  color: ${colors.lightText};
  font-weight: 600;
`;

const Tags = styled.div`
  margin-left: -10px;
`;

const StyledTag = styled(Tag)`
  cursor: pointer;
`;
