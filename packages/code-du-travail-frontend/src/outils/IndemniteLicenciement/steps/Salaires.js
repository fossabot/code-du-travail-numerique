import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Field } from "react-final-form";
import { theme } from "@socialgouv/react-ui";
import { differenceInMonths, subMonths, format } from "date-fns";
import frLocale from "date-fns/locale/fr";
import { Input, InlineError } from "../../common/stepStyles";
import { isNumber } from "../../common/validators";
import { parse } from "../../common/date";
import { YesNoQuestion } from "../components/YesNoQuestion";
import {
  SalaireTempsPartiel,
  TEMPS_PARTIEL,
  TEMPS_PLEIN
} from "../components/SalaireTempsPartiel";
import { SalaireTempsPlein } from "../components/SalaireTempsPlein";
import { motifs } from "../components/AbsencePeriods";

function StepSalaires({ form }) {
  return (
    <>
      <YesNoQuestion
        name="hasTempsPartiel"
        label="Avez-vous alterné, au cours de votre contrat de travail des périodes
              de travail à temps plein et à temps partiel&nbsp;?"
        onChange={hasTempsPartiel => {
          if (hasTempsPartiel) {
            form.batch(() => {
              form.change("salairePeriods", [
                { type: TEMPS_PLEIN, duration: null, salary: null },
                { type: TEMPS_PARTIEL, duration: null, salary: null }
              ]);
              form.change("salaire", null);
              form.change("salaires", []);
              form.change("hasSameSalaire", null);
            });
          } else {
            form.change("salairePeriods", []);
          }
        }}
      />
      <Field name="hasTempsPartiel">
        {({ input }) => (
          <>
            <SalaireTempsPartiel
              name="salairePeriods"
              visible={input.value}
              onChange={salairePeriods => {
                if (salairePeriods.length === 0) {
                  form.change("hasTempsPartiel", false);
                }
              }}
            />

            {input.value === false && (
              <>
                <YesNoQuestion
                  name="hasSameSalaire"
                  label="Avez-vous eu le même salaire lors des 12 derniers mois&nbsp;?"
                  onChange={hasSameSalaire => {
                    if (hasSameSalaire) {
                      form.change("salaires", []);
                    } else {
                      form.batch(() => {
                        const { values } = form.getState();
                        form.change("salaires", getSalairesPeriods(values));
                        form.change("salaire", null);
                      });
                    }
                  }}
                />
                <Field name="hasSameSalaire">
                  {({ input }) => (
                    <>
                      {input.value && (
                        <Field
                          name="salaire"
                          validate={isNumber}
                          subscription={{
                            value: true,
                            error: true,
                            touched: true,
                            invalid: true
                          }}
                        >
                          {({ input, meta: { touched, error, invalid } }) => (
                            <>
                              <p>
                                Salaire mensuel brut (prendre en compte les
                                primes et avantages en nature)
                              </p>
                              <CurrencyWrapper>
                                <NumberInput
                                  {...input}
                                  size="10"
                                  type="number"
                                  invalid={touched && invalid}
                                />
                                <Currency aria-hidden="true">€</Currency>
                              </CurrencyWrapper>
                              {error && touched && invalid ? (
                                <InlineError>{error}</InlineError>
                              ) : null}
                            </>
                          )}
                        </Field>
                      )}
                      <SalaireTempsPlein name="salaires" />
                    </>
                  )}
                </Field>
              </>
            )}
          </>
        )}
      </Field>
    </>
  );
}

function getSalairesPeriods({ dateEntree, dateSortie, absencePeriods }) {
  const dEntree = parse(dateEntree);
  const dSortie = parse(dateSortie);

  const totalAbsence = (absencePeriods || [])
    .filter(period => Boolean(period.duration))
    .reduce((total, item) => {
      const motif = motifs.find(motif => motif.label === item.type);
      return total + item.duration * motif.value;
    }, 0);

  const nbMonthes = Math.min(
    differenceInMonths(dSortie, dEntree) - totalAbsence,
    12
  );

  return Array.from({ length: nbMonthes }).map((_, index) => {
    return {
      label: format(subMonths(dSortie, index), "MMMM yyyy", {
        locale: frLocale
      }),
      salary: null
    };
  });
}

StepSalaires.propTypes = {
  form: PropTypes.object.isRequired
};

export { StepSalaires, getSalairesPeriods };

const { colors, spacing } = theme;

const NumberInput = styled(Input)`
  padding-right: ${spacing.base};
  text-align: right;
`;

const CurrencyWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-right: ${spacing.interComponent};
`;

const Currency = styled.span`
  position: absolute;
  top: 50%;
  right: 0.25rem;
  color: ${colors.grey};
  transform: translateY(-50%);
`;
