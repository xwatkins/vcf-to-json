export interface Coordinates {
  accession: string;
  name: string;
  taxid: number;
  sequence: string;
  protein: Protein;
  gene: Gene[];
  gnCoordinate: GnCoordinate[];
}

export interface Gene {
  value: string;
  type: string;
}

export interface GnCoordinate {
  genomicLocation: GenomicLocation;
  feature: Feature[];
  ensemblGeneId: string;
  ensemblTranscriptId: string;
  ensemblTranslationId: string;
}

export interface Feature {
  original?: string;
  variation?: string[];
  location: LocationClass;
  description?: string;
  evidence?: Evidence[];
  type: string;
  id?: string;
  genomeLocation: Location;
}

export interface Evidence {
  dbReference?: DBReference;
  code: Code;
}

export enum Code {
  Eco0000244 = "ECO:0000244",
  Eco0000250 = "ECO:0000250",
  Eco0000255 = "ECO:0000255",
  Eco0000269 = "ECO:0000269",
  Eco0000303 = "ECO:0000303",
  Eco0000305 = "ECO:0000305",
}

export interface DBReference {
  id: string;
  type: Type;
}

export enum Type {
  PROSITEProRule = "PROSITE-ProRule",
  Pdb = "PDB",
  PubMed = "PubMed",
  UniProtKB = "UniProtKB",
}

export interface Location {
  begin: Begin;
  end: Begin;
}

export interface Begin {
  position: number;
  status: Status;
}

export enum Status {
  Certain = "certain",
}

export interface LocationClass {
  position?: Begin;
  begin?: Begin;
  end?: Begin;
}

export interface GenomicLocation {
  exon: Exon[];
  chromosome: string;
  start: number;
  end: number;
  reverseStrand: boolean;
}

export interface Exon {
  proteinLocation: Location;
  genomeLocation: Location;
  id: string;
}

export interface Protein {
  recommendedName: Name;
  alternativeName: Name[];
}

export interface Name {
  fullName: string;
  shortName?: string[];
}

export interface VCFJSON {
  chrom: string;
  pos: number;
  id?: string;
  ref?: string;
  alt?: string;
  qual?: string;
  filter?: string;
  info?: ({ [x: string]: string } | null)[] | null;
  format?: string;
  sampleData?: string[];
}
