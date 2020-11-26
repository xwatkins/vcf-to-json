[![Build Status](https://travis-ci.org/ebi-uniprot/vcf-to-json.svg?branch=master)](https://travis-ci.org/ebi-uniprot/vcf-to-json)

# VCF to JSON converter

A module to parse [Variant Call Format (VCF)](https://en.wikipedia.org/wiki/Variant_Call_Format) into JSON. An optional parameter allows to map the genomic coordinates to the protein coordinates using the [UniProt Coordinates API](https://www.ebi.ac.uk/proteins/api/doc/).

## Installation

`npm i --save vcftojson`

## API

1. fileContent:
2. options

- _runVEP_: a boolean used to fetch additional data from [VEP](https://www.ensembl.org/info/docs/tools/vep/vep_formats.html). VEP determines the effect of your variants (SNPs, insertions, deletions, CNVs or structural variants) on genes, transcripts, and protein sequence, as well as regulatory regions.

## Usage

### From a node script:

```
import {vcfToJSON} from 'vcftojson`;

const fileContent = await fs.readFileSync(
  "./path_to/my_file.vcf",
  { encoding: "utf-8" } //if you don't provide this it will come as a Stream
);

const json = await index.vcfToJSON(fileContent);
```
