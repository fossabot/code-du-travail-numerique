import crypto from "crypto";
import { selectAll } from "unist-util-select";
import find from "unist-util-find";

import { logger } from "./logger";
import slugify from "../slugify";
import { SOURCES } from "@cdt/sources";

function flattenTags(tags = []) {
  return Object.entries(tags).reduce((state, [key, value]) => {
    return value instanceof Array
      ? state.concat(value.map(value => `${key}:${value}`))
      : state.concat(`${key}:${value}`);
  }, []);
}

function makeSlug(text, seed) {
  const shasum = crypto.createHash("sha1");
  const value = shasum.update(text + seed);
  return slugify(
    `${text}-${Buffer.from(value.digest().slice(0, 10))
      .toString("base64")
      // we replace + / with urlsafe char to mimic python urlsafe_b64encode
      // since it was used originally
      .replace(/\+/g, "-")
      .replace(/\//g, "_")}}`
  );
}

function getArticleUrl(id) {
  return `https://www.legifrance.gouv.fr/affichCodeArticle.do;?idArticle=${id}&cidTexte=LEGITEXT000006072050`;
}

function fixArticleNum(id, num) {
  if (num.match(/^annexe\s/i) && !num.includes("article")) {
    return `${num} ${id}`;
  }
  return num;
}

/**
 * Find duplicate slugs
 * @param {iterable} allDocuments is an iterable generator
 */
function getDuplicateSlugs(allDocuments) {
  let slugs = [];
  for (const documents of allDocuments) {
    slugs = slugs.concat(
      documents.map(({ source, slug }) => `${source}/${slug}`)
    );
  }

  return slugs
    .map(slug => ({ slug, count: slugs.filter(s => slug === s).length }))
    .filter(({ count }) => count > 1)
    .reduce((state, { slug, count }) => ({ ...state, [slug]: count }), {});
}

function* cdtnDocumentsGen() {
  logger.info("=== Conventions Collectives ===");
  yield require("@socialgouv/kali-data/data/index.json").map(
    ({ id, num, title }) => ({
      source: SOURCES.CCN,
      id,
      idcc: num,
      title,
      slug: slugify(`${num}-${title}`.substring(0, 80)),
      text: `IDCC ${num} ${title}`,
      url: `https://www.legifrance.gouv.fr/affichIDCC.do?idConvention=${id}`
    })
  );

  logger.info("=== Code du travail ===");
  yield selectAll(
    "article",
    require("@socialgouv/legi-data/data/LEGITEXT000006072050.json")
  ).map(({ data: { id, num, date_debut, texte, texteHtml } }) => ({
    source: SOURCES.CDT,
    title: fixArticleNum(id, num),
    slug: slugify(fixArticleNum(id, num)),
    description: texte.slice(0, texte.indexOf("…", 150)),
    html: texteHtml,
    text: texte,
    date_debut,
    url: getArticleUrl(id)
  }));

  logger.info("=== Fiches SP ===");
  yield require("../dataset/fiches_service_public/fiches-sp.json").map(
    ({
      id,
      title,
      description,
      breadcrumbs,
      theme,
      text,
      raw,
      date,
      references_juridiques,
      url
    }) => ({
      id,
      source: SOURCES.SHEET_SP,
      title,
      slug: slugify(title),
      description,
      breadcrumbs,
      theme,
      text,
      raw,
      date,
      references_juridiques,
      url
    })
  );

  logger.info("=== Fiches MT ===");
  yield require("../dataset/fiches_ministere_travail/fiches-mt.json").map(
    ({
      title,
      slug,
      text,
      description,
      anchor,
      intro,
      html,
      breadcrumbs,
      theme,
      date,
      url
    }) => ({
      source: SOURCES.SHEET_MT,
      title,
      slug,
      intro,
      description,
      text,
      html,
      breadcrumbs,
      theme,
      date,
      url,
      anchor
    })
  );

  logger.info("=== Themes ===");
  yield require("../dataset/datafiller/themes.data.json").map(
    ({ slug, title }) => ({
      source: SOURCES.THEMES,
      title: title,
      slug
    })
  );

  logger.info("=== Courriers ===");
  yield require("../dataset/export-courriers.json").map(
    ({
      titre,
      filename,
      description,
      questions,
      html,
      tags,
      date_redaction,
      redacteur,
      source
    }) => ({
      source: SOURCES.LETTERS,
      title: titre,
      slug: slugify(titre),
      description,
      text: questions.join("\n"),
      html,
      filename,
      date: date_redaction,
      editor: source,
      author: redacteur,
      tags: flattenTags(tags)
    })
  );
  logger.info("=== Outils ===");
  yield require("../dataset/outils.json").map(
    ({ date, description, questions, titre }) => ({
      source: SOURCES.TOOLS,
      title: titre,
      slug: slugify(titre),
      description,
      text: questions.join("\n"),
      date
    })
  );
  // Temporary removed from ES
  // logger.info("=== Contributions ===");
  // yield require("../dataset/contributions/contributions.data.json").map(
  //   ({ value, answers }) => {
  //     return {
  //       source: SOURCES.CONTRIBUTIONS,
  //       title: value,
  //       slug: slugify(value),
  //       text: (answers.general && answers.general.value) || value,
  //       answers
  //     };
  //   }
  // );
}

export const conventionTextType = {
  BASE: "base",
  SALARY: "salaires",
  ATTACHED: "attaches"
};

/**
 *
 * @param {array} list - a array of document absctract
 * @param {number} batchSize - the max size of the batch
 */
function* cdtnCcnGen(list, batchSize = 10000000) {
  let buffer = [];
  let bufferSize = 0;

  for (const { id, shortTitle, date_publi, url } of list) {
    const jsonPath = `@socialgouv/kali-data/data/${id}.json`;
    const tree = require(jsonPath);
    const {
      data: { num, title, categorisation }
    } = tree;
    const texteDeBase = find(tree, node =>
      node.data.title.startsWith("Texte de base")
    );
    const textesAttaches = find(
      tree,
      node => node.data.title === "Textes Attachés"
    );
    const texteSalaires = find(
      tree,
      node => node.data.title === "Textes Salaires"
    );
    const data = [];
    const meta = {
      idcc: num,
      title,
      shortTitle,
      date_publi,
      categorisation,
      conventionId: id,
      url
    };
    data.push({
      ...meta,
      type: conventionTextType.BASE,
      content: texteDeBase
    });

    if (textesAttaches) {
      data.push({
        ...meta,
        title: textesAttaches.data.title,
        type: conventionTextType.ATTACHED,
        content: textesAttaches
      });
    }
    if (texteSalaires) {
      data.push({
        ...meta,
        title: texteSalaires.data.title,
        type: conventionTextType.SALARY,
        content: texteSalaires
      });
    }

    const jsonSize = JSON.stringify(data).length;

    if (bufferSize + jsonSize >= batchSize) {
      logger.debug(`batch max size ${bufferSize}`);
      yield buffer;
      buffer = [].concat(data);
      bufferSize = jsonSize;
    } else {
      buffer = buffer.concat(data);
      bufferSize += jsonSize;
    }
  }
  if (buffer.length > 0) {
    yield buffer;
  }
}

export {
  flattenTags,
  makeSlug,
  getDuplicateSlugs,
  cdtnDocumentsGen,
  cdtnCcnGen
};
