import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import { Toast } from "@socialgouv/react-ui";
import data from "@cdt/data...preavis-demission/data.json";

import { SectionTitle } from "../../common/stepStyles";

import {
  filterSituations,
  getSituationsFor,
  isNotYetProcessed
} from "../../common/situations.utils";
import { recapSituation } from "./situation";

function StepResult({ form }) {
  const { values } = form.getState();
  const { ccn, criteria = {} } = values;
  const idcc = ccn ? ccn.num : "0000";

  const initialSituations = getSituationsFor(data, { idcc });
  const possibleSituations = filterSituations(initialSituations, criteria);

  if (!possibleSituations.length && isNotYetProcessed(data, idcc)) {
    return (
      <>
        <Toast variant="warning">
          Nous n’avons pas encore traité votre convention collective. Le code du
          travail ne prévoyant pas de durée précise du préavis de démission,
          nous vous invitons à consulter le contenu de votre convention
          collective.
          <br />
          <Link
            href="/fiche-service-public/[slug]"
            as={`/fiche-service-public/${ccn.slug}`}
          >
            <a>{ccn.title}</a>
          </Link>
        </Toast>
      </>
    );
  }

  switch (possibleSituations.length) {
    case 1: {
      const [situation] = possibleSituations;
      const { idcc } = situation;
      const { title: ccLabel } = ccn;
      if (idcc === "0000") {
        return (
          <>
            <p>
              Le code du travail ne prévoit pas une durée précise du préavis de
              démission. Il prévoit qu’une convention collective ou un accord
              d’entreprise, voire un usage, en prévoit les durées et modalités.
            </p>
            {situation.ref && situation.refUrl && getRef(situation)}
          </>
        );
      }
      return (
        <>
          <SectionTitle>Durée du préavis</SectionTitle>
          <p>
            En cas de démission, la {ccLabel} ({idcc}) prévoit le respect d’un
            préavis d’une durée de <strong>{situation.answer}</strong> pour un
            salarié {recapSituation(situation.criteria)}.
          </p>
          {situation.ref && situation.refUrl && getRef(situation)}
          <Toast variant="info">
            Si le contrat de travail, un accord collectif d’entreprise ou un
            usage prévoit une durée de préavis différente, il faut appliquer la
            durée la plus courte.
          </Toast>
        </>
      );
    }
    default:
      return null;
  }
}

StepResult.propTypes = {
  form: PropTypes.shape({
    getState: PropTypes.func.isRequired
  })
};

export { StepResult };

function getRef({ ref, refUrl }) {
  return (
    <p>
      <a href={refUrl} title={`Consultez l’${ref.toLowerCase()}`}>
        {ref}
      </a>
    </p>
  );
}
