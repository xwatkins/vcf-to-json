import axios from "axios";
import { VCFJSON } from "./types";
import { Vep } from "./VEPTypes";

const fetchVEP = async (vepInput: string[]) => {
  const url = `https://rest.ensembl.org/vep/homo_sapiens/region?uniprot=true`;
  const response = await axios
    .post<Vep[]>(
      url,
      {
        variants: vepInput,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
    .catch((e) => console.error(e.response));
  if (response) {
    return new Map(
      response.data.map((vepLine) => [
        `${vepLine.strand}:${vepLine.start}`,
        vepLine,
      ])
    );
  }
  return null;
};

const parseInfo = (info?: string) => {
  if (!info) {
    return null;
  }
  const infoArray = info.split(";");
  return (
    infoArray
      .map((infoItem) => {
        // NOTE: should maybe use a regex here?
        const splitItem = infoItem.split(/=/);
        if (splitItem.length < 2) {
          return null;
        }
        return { [splitItem[0]]: splitItem[1].replace(/"/g, "") };
      })
      // Filter out null
      .filter((item) => item)
  );
};

const readLines = async (fileContents: string) => {
  const jsonArray = [];

  const rl = fileContents.split(/\r?\n/g);

  for (const line of rl) {
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
    const rowJSON: VCFJSON = {
      vcfLine: line,
      chrom: columns[0],
      pos: parseInt(columns[1]),
    };
    if (columns[2]) {
      rowJSON["id"] = columns[2];
    }
    if (columns[3]) {
      rowJSON["ref"] = columns[3];
    }
    if (columns[4]) {
      rowJSON["alt"] = columns[4];
    }
    if (columns[5]) {
      rowJSON["qual"] = columns[5];
    }
    if (columns[6]) {
      rowJSON["filter"] = columns[6];
    }
    if (columns[7]) {
      rowJSON["info"] = parseInfo(columns[7]);
    }
    if (columns[8]) {
      rowJSON["format"] = columns[8];
    }
    if (columns.length > 8) {
      rowJSON["sampleData"] = columns.filter((item, i) => {
        return item.length && i > 8;
      });
    }
    jsonArray.push(rowJSON);
  }
  return jsonArray;
};

export const vcfToJSON = async (vcf: string, options?: { runVEP?: string }) => {
  const jsonArray = await readLines(vcf);
  if (options?.runVEP) {
    const VEPData = await fetchVEP(jsonArray.map(({ vcfLine }) => vcfLine));
    if (VEPData) {
      return jsonArray.map((row) => ({
        ...row,
        ...VEPData.get(`${row.chrom}:${row.pos}`),
      }));
    } // TODO throw error
  }
  return jsonArray;
};
