"use strict";
var expect = require("chai").expect;
var index = require("../dist/index.js");

describe("vcfToJSON function test", () => {
  it("should run this", async () => {
    const json = await index.vcfToJSON(
      "./examples/example_format_1.vcf",
      "P01008"
    );
    expect(json).to.equal([{}]);
  });
});
