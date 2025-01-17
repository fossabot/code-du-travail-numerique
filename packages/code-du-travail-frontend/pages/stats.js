import React from "react";
import styled from "styled-components";
import Head from "next/head";
import {
  Grid,
  GridCell,
  Container,
  Section,
  Wrapper
} from "@socialgouv/react-ui";

import { Layout } from "../src/layout/Layout";

const About = () => (
  <Layout>
    <Head>
      <title>Statistiques du code du travail numérique</title>
      <meta
        name="description"
        content="Statistiques du code du travail numérique"
      />
    </Head>
    <Section>
      <Container>
        <Wrapper variant="light">
          <h1>Statistiques du code du travail numérique</h1>
          <br />
          <Grid>
            <GridCell>
              <h3>Contenus référencés</h3>
              <Num>14369</Num>
            </GridCell>
            <GridCell>
              <h3>Visites</h3>
              <Num>2992</Num>
            </GridCell>
            <GridCell>
              <h3>Recherches</h3>
              <Num>15368</Num>
            </GridCell>
            <GridCell>
              <h3>Consultations</h3>
              <Num>30736</Num>
            </GridCell>
          </Grid>
          <br />
          <p>Statistiques d’usage depuis le 1er Janvier 2019</p>
          <br />
          <br />
        </Wrapper>
      </Container>
    </Section>
  </Layout>
);

const Num = styled.div`
  font-size: 2em;
`;

export default About;
