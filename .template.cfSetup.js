/**
 * @file Cloud functions typescript modification. Allows the project to have
 * src/functions and not the other way around functions/src, as proposed in
 * https://firebase.google.com/docs/functions/typescript.
 *
 * WHY. This is a better fit for this template. Differences between CF template and
 * project template would be only minor.
 * 
 * WHEN. Script is meant run before firebase publish and after typescript
 * compilation. See firebase.json functions.predeploy steps how this is done.
 * 
 * HOW. Result needs to be (a) {compiled}/package.json with it's (b) main
 * property pointing to the CF bootstrap file, in the docs referred to
 * as 'main source file for your Cloud Function'. (c) copy all necessary files
 * from project root to dist - .env.json etc.
 */
const path = require('path');
const fs = require('fs');

const logger = console;

const DIR = {
    // Project root location
    ROOT: __dirname,
    // Compiled sources location
    COMPILED: path.join(__dirname, 'dist'),
}

const FILE = {
    // Real package.json
    PACKAGE_JSON: path.join(DIR.ROOT, 'package.json'),
    // To-be-created package.json clone. Slightly modified.
    COMPILED_PACKAGE_JSON: path.join(DIR.COMPILED, 'package.json'),
    // Cloud functions bootstrap file
    FUNCTIONS_INDEX: path.join(DIR.COMPILED, 'index.js'),
};

// (a) Copy ./package.json to {compiled}/package.json
(() => {
    logger.info([
        'Copying',
        path.relative(DIR.ROOT, FILE.PACKAGE_JSON),
        'to',
        path.relative(DIR.ROOT, FILE.COMPILED_PACKAGE_JSON),
    ].join(' '))
    fs.copyFileSync(FILE.PACKAGE_JSON, FILE.COMPILED_PACKAGE_JSON);
    logger.info(`OK created ${path.relative(DIR.ROOT, FILE.COMPILED_PACKAGE_JSON)}`);
})();

// (b) Add `main` to {compiled}/package.json
(() => {
    const functionsIndex = path.relative(
        DIR.COMPILED,
        FILE.FUNCTIONS_INDEX
    );
    logger.info([
        'Modifying',
        `${path.relative(DIR.ROOT, FILE.COMPILED_PACKAGE_JSON)}'s`,
        '\'main\' property to',
        `'${functionsIndex}'`,
    ].join(' '));
    const contents = JSON.parse(fs.readFileSync(FILE.COMPILED_PACKAGE_JSON, 'utf8'));
    contents.main = functionsIndex;
    fs.writeFileSync(FILE.COMPILED_PACKAGE_JSON, JSON.stringify(contents, null, 2));
    logger.info(`OK ${path.relative(DIR.ROOT, FILE.COMPILED_PACKAGE_JSON)}.main=${functionsIndex}`);
})();

// (c) Copy configuration files
(() => {
    const files = [
        '.env.json',
        'credentials.json',
    ];
    files.forEach(fileName => {
        const file = path.join(DIR.ROOT, fileName);
        const destination = path.join(DIR.COMPILED, path.basename(fileName));
        if (fs.existsSync(file)) {
            logger.info([
                'Copying',
                file,
                'to',
                path.relative(file, destination),
            ].join(' '));
            fs.copyFileSync(file, destination)
            logger.info(`OK. Copied ${fileName}.`);
        }
    });
})();
