[![Build Status](https://travis-ci.org/ebi-uniprot/vcf-to-json.svg?branch=master)](https://travis-ci.org/ebi-uniprot/vcf-to-json)

# VCF to JSON converter
A module to parse [Variant Call Format (VCF)](https://en.wikipedia.org/wiki/Variant_Call_Format) into JSON. An optional parameter allows to map the genomic coordinates to the protein coordinates using the [UniProt Coordinates API](https://www.ebi.ac.uk/proteins/api/doc/).

## Installation
`npm i --save vcftojson`

## API
1. fileContent:
2. options
  - *accession*: a UniProt identifier used to fetch and map the coordinates

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
