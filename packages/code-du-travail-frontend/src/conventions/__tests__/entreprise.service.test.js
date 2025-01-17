import {
  searchEntrepriseBySiret,
  searchEntrepriseByName,
  API_ENTREPRISE,
  SIRET2IDCC_URL
} from "../entreprise.service";
import {
  fulltextPayload,
  siretPayload,
  siretIdccPayload
} from "./api.entretrise.mock";

import fetch from "isomorphic-unfetch";
import { fetchResponse } from "../../../test/mockFetch";

jest.mock("isomorphic-unfetch");

fetch.mockImplementation(url => {
  if (url.startsWith(`${API_ENTREPRISE}/full_text`)) {
    return Promise.resolve(fetchResponse(fulltextPayload));
  } else if (url.startsWith(`${API_ENTREPRISE}/siret`)) {
    return Promise.resolve(fetchResponse(siretPayload));
  } else if (url.startsWith(`${SIRET2IDCC_URL}/80258570300027`)) {
    return Promise.resolve(fetchResponse(siretIdccPayload));
  } else if (url.startsWith(`${SIRET2IDCC_URL}/80258570300035`)) {
    return Promise.resolve(fetchResponse([]));
  } else {
    Promise.resolve(fetchResponse());
  }
});

beforeEach(() => fetch.mockClear());

describe("api entreprise", () => {
  it("can get entreprise data by name", async () => {
    const query = "Corso balard";
    const results = await searchEntrepriseByName(query);
    const apiEntrepriseMatcher = new RegExp(
      `${API_ENTREPRISE}/full_text/${encodeURIComponent(query)}`
    );
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[0][0]).toMatch(apiEntrepriseMatcher);
    expect(fetch.mock.calls[1][0]).toMatch(
      new RegExp(`${SIRET2IDCC_URL}/80258570300035,80258570300027`)
    );
    expect(results).toMatchSnapshot();
  });
  it("can get entreprise data by siret and resuse memoized call from previous siret2idcc", async () => {
    const query = "80258570300035";
    const results = await searchEntrepriseBySiret(query);
    const apiMatcher = new RegExp(
      `${API_ENTREPRISE}/siret/${encodeURIComponent(query)}`
    );

    expect(fetch).toHaveBeenCalledTimes(2);
    expect(fetch.mock.calls[0][0]).toMatch(apiMatcher);
    expect(results).toMatchSnapshot();

    const results2 = await searchEntrepriseBySiret(query);
    expect(fetch).toHaveBeenCalledTimes(2); // 2 not 4 because memoized
    expect(fetch.mock.calls[0][0]).toMatch(apiMatcher);
    expect(results2).toMatchSnapshot();
  });
});
