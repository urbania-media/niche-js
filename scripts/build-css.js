#! /usr/bin/env node
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
const { program } = require('commander');
const postcss = require('postcss');
const postcssConfig = require('../postcss.config');

let srcFile = null;
let outFile = null;

program.arguments('<src> <out>').action((src, out) => {
    srcFile = path.join(process.cwd(), src);
    outFile = path.join(process.cwd(), out);
});

program.parse(process.argv);

const css = fs.readFileSync(srcFile);

postcss(postcssConfig.plugins)
    .process(css, {
        from: srcFile,
        to: outFile,
    })
    .then((postCssResult) => {
        mkdirp.sync(path.dirname(outFile));
        fs.writeFileSync(outFile, postCssResult.css);
        console.log(`Generated ${outFile}`);
    });
