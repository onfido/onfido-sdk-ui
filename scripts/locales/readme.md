## Locales utility

A small utility tool to help gain insights in to our locale files.

**Step 1:**
Download the locales from our development branch:
`npm run websdk locales:download`

###Commands:

**List the difference between current branch and development:**
`npm run websdk locales:compare`

**Compare all languages against the base language (en_US) and find differences**
`npm run websdk locales:bugs`

**Generate a new section for the MIGRATION md changelog**
`npm run websdk locales:changelog`
