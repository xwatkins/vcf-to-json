import axios from "axios";
import { BeginEnd, Coordinates, GenomicLocation, VCFJSON } from "./types";

const fetchMappings = async (accession: string) => {
  const url = `https://www.ebi.ac.uk/proteins/api/coordinates/${accession}`;
  const response = await axios.get<Coordinates>(url, {
    headers: { Accept: "application/json" },
  });
  // TODO handle error
  // TODO handle multiple gnCoordinate
  return response.data.gnCoordinate[0].genomicLocation;
};

const getProteinPositions = (
  genomeLocation: number,
  genomicLocation: GenomicLocation
) => {
  const { exon, reverseStrand } = genomicLocation;
  let found = false;
  let offset = 0;

  let begin = BeginEnd.BEGIN;
  let end = BeginEnd.END;

  if (reverseStrand) {
    begin = BeginEnd.END;
    end = BeginEnd.BEGIN;
  }

  // TODO make sure exons are ordered correctly
  for (const currentItem of exon) {
    // Further exon
    if (genomeLocation > currentItem.genomeLocation[end].position) {
      offset +=
        currentItem.genomeLocation[begin].position -
        currentItem.genomeLocation[end].position -
        1;
    }
    // Current exon
    else if (
      currentItem.genomeLocation[begin].position <= genomeLocation &&
      currentItem.genomeLocation[end].position >= genomeLocation
    ) {
      offset += currentItem.genomeLocation[begin].position - 1;
      // exit from loop early
      found = true;
      break;
    }
  }

  if (offset === 0 || !found) {
    return null;
  }
  // Take the rounded up value
  const protValue = Math.ceil((genomeLocation - offset) / 3);
  return protValue;
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

const readLines = (fileContents: string) => {
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

export const vcfToJSON = async (
  vcf: string,
  options: { accession?: string }
) => {
  const { accession } = options;
  const jsonArray = readLines(vcf);
  let genomicLocation: GenomicLocation;
  if (accession) {
    genomicLocation = await fetchMappings(accession);
  }
  return jsonArray.map((row) => ({
    ...row,
    proteinPos:
      genomicLocation && getProteinPositions(row.pos, genomicLocation),
  }));
};
