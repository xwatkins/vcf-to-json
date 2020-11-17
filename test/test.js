"use strict";
const expect = require("chai").expect;
const index = require("../dist/index.js");
const rewire = require("rewire");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const mockData = require("./mockData.json");
const output = require("./output.json");
const exons = require("./exons.json");

// Note should we rewire main import too?
const app = rewire("../dist/index.js");
const parseInfo = app.__get__("parseInfo");
const getProteinPositions = app.__get__("getProteinPositions");

const mock = new MockAdapter(axios);

mock.onGet().reply(200, mockData);

describe("vcfToJSON function test", () => {
  it("should parse file correctly and get protein coordinates", async () => {
    const json = await index.vcfToJSON("./examples/example_format_1.vcf", {
      accession: "P01008",
    });
    expect(json).to.eql(output);
  });

  it("should parse the INFO column", () => {
    const INFO =
      'hgmdAll:CLASS=DM?;MUT=ALT;GENE=SERPINC1;STRAND=-;DNA=NM_000488.3%3Ac.1307C>A;PROT=NP_000479.1%3Ap.A436D;PHEN="Antithrombin_deficiency";RANKSCORE=0.25;';
    const parsedInfo = parseInfo(INFO);
    expect(parsedInfo).to.eql([
      { "hgmdAll:CLASS": "DM?" },
      { MUT: "ALT" },
      { GENE: "SERPINC1" },
      { STRAND: "-" },
      { DNA: "NM_000488.3%3Ac.1307C>A" },
      { PROT: "NP_000479.1%3Ap.A436D" },
      { PHEN: "Antithrombin_deficiency" },
      { RANKSCORE: "0.25" },
    ]);
  });

  it("should map coordinates for first NT", () => {
    const positions = getProteinPositions(10, exons);
    expect(positions).to.equal(1);
  });

  it("should map coordinates for NT in first exon", () => {
    const positions = getProteinPositions(15, exons);
    expect(positions).to.equal(2);
  });

  it("should map coordinates for last NT", () => {
    const positions = getProteinPositions(16, exons);
    expect(positions).to.equal(3);
  });

  it("should map coordinates for the second exon", () => {
    const positions = getProteinPositions(23, exons);
    expect(positions).to.equal(3);
  });

  it("should map coordinates for the third exon", () => {
    const positions = getProteinPositions(51, exons);
    expect(positions).to.equal(5);
  });

  it("should map not map coordinates outside of the lower range", () => {
    const positions = getProteinPositions(0, exons);
    expect(positions).to.be.null;
  });

  it("should map not map coordinates outside of the higher range", () => {
    const positions = getProteinPositions(70, exons);
    expect(positions).to.be.null;
  });
});
