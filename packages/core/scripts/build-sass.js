#! /usr/bin/env node
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const { program } = require('commander');
const sass = require('sass');
const postcss = require('postcss');
const tildeImporter = require('./import-tilde');
const postcssConfig = require('../../../postcss.config');

let srcFile = null;
let outFile = null;

program
    .argument('<src>')
    .argument('<out>')
    .action((src, out) => {
        srcFile = path.join(process.cwd(), src);
        outFile = path.join(process.cwd(), out);
    });

program.parse(process.argv);

const result = sass.compile(srcFile, {
    outFile,
    importer: tildeImporter,
    // outputStyle: 'compressed',
    sourceMap: true,
    loadPaths: [
        path.join(process.cwd(), 'node_modules'),
        path.join(process.cwd(), '../../node_modules'),
    ],
});

postcss(postcssConfig.plugins)
    .process(result.css, {
        from: srcFile,
        to: outFile,
    })
    .then((postCssResult) => {
        mkdirp.sync(path.dirname(outFile));
        fs.writeFileSync(outFile, postCssResult.css);
        console.log(`Generated ${outFile} from ${srcFile}`);
    });
