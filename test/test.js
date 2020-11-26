"use strict";
const fs = require("fs");
const expect = require("chai").expect;
const index = require("../dist/index.js");
const rewire = require("rewire");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");
const vepOutput = require("./vepOutput.json");
const output = require("./output.json");

// Note should we rewire main import too?
const app = rewire("../dist/index.js");
const parseInfo = app.__get__("parseInfo");

const mock = new MockAdapter(axios);
mock.onPost().reply(200, vepOutput);

describe("vcfToJSON function test", () => {
  it("should parse file correctly and get protein coordinates", async () => {
    const fileContent = await fs.readFileSync(
      "./examples/example_format_1.vcf",
      { encoding: "utf-8" }
    );
    const json = await index.vcfToJSON(fileContent, {
      runVEP: true,
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
});
