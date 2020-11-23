export interface Vep {
  seq_region_name: string;
  id: string;
  input: string;
  transcript_consequences: TranscriptConsequence[];
  end: number;
  strand: number;
  allele_string: string;
  regulatory_feature_consequences: RegulatoryFeatureConsequence[];
  assembly_name: string;
  colocated_variants: ColocatedVariant[];
  start: number;
  most_severe_consequence: string;
}

export interface ColocatedVariant {
  start: number;
  id: string;
  phenotype_or_disease: number;
  allele_string: string;
  strand: number;
  seq_region_name: string;
  end: number;
  clin_sig?: string[];
  pubmed?: number[];
  clin_sig_allele?: string;
  var_synonyms?: VarSynonyms;
}

export interface VarSynonyms {
  Uniprot: string[];
  OMIM: number[];
  ClinVar: string[];
}

export interface RegulatoryFeatureConsequence {
  impact: string;
  regulatory_feature_id: string;
  variant_allele: string;
  biotype: string;
  consequence_terms: string[];
}

export interface TranscriptConsequence {
  hgnc_id: string;
  gene_symbol: string;
  cds_end?: number;
  sift_prediction?: string;
  polyphen_score?: number;
  amino_acids?: string;
  codons?: string;
  protein_start?: number;
  biotype: string;
  sift_score?: number;
  impact: string;
  cds_start?: number;
  consequence_terms: string[];
  variant_allele: string;
  strand: number;
  gene_id: string;
  polyphen_prediction?: string;
  gene_symbol_source: string;
  transcript_id: string;
  cdna_start?: number;
  protein_end?: number;
  uniparc: string[];
  trembl?: string[];
  cdna_end?: number;
  swissprot?: string[];
  distance?: number;
}
