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
  code: string;
}

export interface DBReference {
  id: string;
  type: string;
}

export enum BeginEnd {
  BEGIN = "begin",
  END = "end",
}

export interface Location {
  [BeginEnd.BEGIN]: Position;
  [BeginEnd.END]: Position;
}

export interface Position {
  position: number;
  status: Status;
}

export enum Status {
  Certain = "certain",
}

export interface LocationClass {
  position?: Position;
  begin?: Position;
  end?: Position;
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
  vcfLine: string;
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
