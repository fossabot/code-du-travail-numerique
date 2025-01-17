import React from "react";
import { withRouter } from "next/router";
import fetch from "isomorphic-unfetch";
import styled from "styled-components";
import getConfig from "next/config";
import FicheServicePublic from "@socialgouv/react-fiche-service-public";
import ReferencesJuridiques from "../../src/common/ReferencesJuridiques";
import Answer from "../../src/common/Answer";
import { Layout } from "../../src/layout/Layout";
import Metas from "../../src/common/Metas";

const ServicePublic = styled.div`
  .sp__Titre {
    font-size: 1.5rem;
  }
`;

const {
  publicRuntimeConfig: { API_URL }
} = getConfig();

const fetchFiche = ({ slug }) =>
  fetch(`${API_URL}/items/fiches_service_public/${slug}`);

const Source = ({ name, url }) => (
  <a href={url} target="_blank" rel="noopener noreferrer">
    Voir le contenu original sur : {name}{" "}
  </a>
);

class Fiche extends React.Component {
  static async getInitialProps({ query }) {
    const response = await fetchFiche(query);
    if (!response.ok) {
      return { statusCode: response.status };
    }

    const data = await response.json();
    if (data._source.raw) {
      data._source.raw = JSON.parse(data._source.raw);
    }
    return { data };
  }

  render() {
    const { data = { _source: {} }, pageUrl, ogImage } = this.props;
    const {
      _source: {
        breadcrumbs,
        date,
        description,
        html,
        raw,
        references_juridiques,
        title,
        url
      },
      relatedItems
    } = data;
    const footer = <Source name="service-public.fr" url={url} />;
    return (
      <Layout>
        <Metas
          url={pageUrl}
          title={title}
          description={description}
          image={ogImage}
        />
        <ServicePublic>
          <Answer
            title={title}
            relatedItems={relatedItems}
            emptyMessage="Cette fiche n'a pas été trouvée"
            html={html}
            footer={footer}
            date={date}
            sourceType="Fiche service-public.fr"
            additionalContent={
              <ReferencesJuridiques references={references_juridiques} />
            }
            breadcrumbs={breadcrumbs}
          >
            {// Without the check, the prop children of the Answer will evaluate to true
            // even if in the end, <FicheServicePublic /> returns null
            raw && <FicheServicePublic data={raw.children} />}
          </Answer>
        </ServicePublic>
      </Layout>
    );
  }
}

export default withRouter(Fiche);
