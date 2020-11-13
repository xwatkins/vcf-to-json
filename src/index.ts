import * as fs from "fs";
import * as readline from "readline";
import axios from "axios";
import { Coordinates, Exon } from "./types";

const fetchMappings = async (accession: string) => {
  const url = `https://www.ebi.ac.uk/proteins/api/coordinates/${accession}`;
  const response = await axios.get<Coordinates>(url, {
    headers: { Accept: "application/json" },
  });
  return response.data.gnCoordinate[0].genomicLocation.exon;
};

const getProteinPositions = (genomeLocation: number, exons: Exon[]) => {
  const exonMatch = exons.find(
    (exon) =>
      exon.genomeLocation.begin.position >= genomeLocation &&
      exon.genomeLocation.end.position <= genomeLocation
  );
  if (!exonMatch) {
    return;
  }
  const offSet = genomeLocation - exonMatch?.genomeLocation.begin.position;
  return exonMatch?.proteinLocation.begin.position + offSet;
};

const readLines = async (filePath: fs.PathLike) => {
  const fileStream = fs.createReadStream(filePath);
  const jsonArray = [];

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
    if (line.startsWith("#")) {
      // Note: could check the column headers here
      continue;
    }
    /**
     * There are 9 fixed fields, labelled “CHROM”, “POS”, “ID”, “REF”, “ALT”, “QUAL”, “FILTER”, “INFO” and “FORMAT”
     * Following these are fields containing data about samples, which usually contain a genotype call for each
     * sample plus some associated data.
     * */
    const columns = line.split(/\t/g);
    const rowJSON = {
      chrom: columns[0],
      pos: new Number(columns[1]),
      id: columns[2],
      ref: columns[3],
      alt: columns[4],
      qual: columns[5],
      filter: columns[6],
      info: columns[7],
      format: columns[8],
      sampleData: columns.filter((item, i) => i > 8),
    };
    jsonArray.push(rowJSON);
  }
  return jsonArray;
};

export const vcfToJSON = async (filePath: fs.PathLike, accession: string) => {
  const jsonArray = await readLines(filePath);
  const exons = await fetchMappings(accession);
  return jsonArray.map((row) => getProteinPositions(row.pos, exons));
};
