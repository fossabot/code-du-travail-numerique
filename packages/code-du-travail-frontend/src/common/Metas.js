import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Metas({ url, title, description, image }) {
  const router = useRouter();
  if (typeof window !== "undefined") {
    const { asPath: path } = router || { asPath: "POFPOF" };
    url = url || `${location.protocol}//${location.host}${path}`;
    image =
      image ||
      `${location.protocol}//${location.hostname}/static/images/social-preview.png`;
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="twitter:card" content="summary" />
      <meta property="og:title" content={title} />
      <meta property="og:type" content="article" />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="code du travail numérique" />
      <meta property="og:locale" content="fr" />
    </Head>
  );
}

Metas.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  url: PropTypes.string,
  image: PropTypes.string
};
