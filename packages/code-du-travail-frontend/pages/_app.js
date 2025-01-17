import React from "react";
import PropTypes from "prop-types";
import App from "next/app";
import getConfig from "next/config";
import { ThemeProvider } from "styled-components";
import * as Sentry from "@sentry/browser";
import { theme } from "@socialgouv/react-ui";
import ErrorPage from "./_error";

import { initPiwik } from "../src/piwik";
import { initializeSentry } from "../src/sentry";

import GlobalStyles from "../src/layout/css/index.js";

const {
  publicRuntimeConfig: { PIWIK_URL, PIWIK_SITE_ID }
} = getConfig();

initializeSentry();

export default class MyApp extends App {
  // HACK @lionelb from https://github.com/zeit/next.js/issues/4687#issuecomment-432608667
  // This is to fix withRouter() from next/router
  // IE10 static props hoisting doesn't work
  static childContextTypes = {
    headManager: PropTypes.object,
    router: PropTypes.object
  };
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      try {
        pageProps = await Component.getInitialProps(ctx);
      } catch (err) {
        pageProps = { statusCode: 500, message: err.message };
      }
    }
    // pageUrl and ogImage are only defined on serverside request
    if (ctx.req) {
      pageProps.pageUrl = `${ctx.req.protocol}://${ctx.req.headers.host}${ctx.req.path}`;
      pageProps.ogImage = `${ctx.req.protocol}://${ctx.req.headers.host}/static/images/social-preview.png`;
    }

    return { pageProps };
  }

  componentDidMount() {
    initPiwik({ siteId: PIWIK_SITE_ID, piwikUrl: PIWIK_URL });
  }

  componentDidCatch(error, errorInfo) {
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });

      Sentry.captureException(error);
    });
    super.componentDidCatch(error, errorInfo);
  }

  render() {
    const { Component, pageProps } = this.props;
    if (pageProps.statusCode) {
      return (
        <ThemeProvider theme={theme.colors}>
          <GlobalStyles />
          <ErrorPage statusCode={pageProps.statusCode} />
        </ThemeProvider>
      );
    }
    return (
      <ThemeProvider theme={theme.colors}>
        <GlobalStyles />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }
}
