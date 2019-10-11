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
 * as 'main source file for your Cloud Function'.
 */
const path = require('path');
const fs = require('fs');

const logger = console;

const Dir = {
    // Project root location
    Root: __dirname,
    // Compiled sources location
    Compiled: path.join(__dirname, 'dist'),
}

const File = {
    // Real package.json
    PackageJson: path.join(Dir.Root, 'package.json'),
    // To-be-created package.json clone. Slightly modified.
    CompiledPackageJson: path.join(Dir.Compiled, 'package.json'),
    // Cloud functions bootstrap file
    FunctionsIndex: path.join(Dir.Compiled, 'index.js'),
};

// (a) Copy ./package.json to {compiled}/package.json
(() => {
    logger.info([
        'Copying',
        path.relative(Dir.Root, File.PackageJson),
        'to',
        path.relative(Dir.Root, File.CompiledPackageJson),
    ].join(' '))
    fs.copyFileSync(File.PackageJson, File.CompiledPackageJson);
    logger.info(`OK created ${path.relative(Dir.Root, File.CompiledPackageJson)}`);
})();

// (b) Add `main` to {compiled}/package.json
(() => {
    const functionsIndex = path.relative(
        Dir.Compiled,
        File.FunctionsIndex
    );
    logger.info([
        'Modifying',
        `${path.relative(Dir.Root, File.CompiledPackageJson)}'s`,
        '\'main\' property to',
        `'${functionsIndex}'`,
    ].join(' '));
    const contents = JSON.parse(fs.readFileSync(File.CompiledPackageJson, 'utf8'));
    contents.main = functionsIndex;
    fs.writeFileSync(File.CompiledPackageJson, JSON.stringify(contents, null, 2));
    logger.info(`OK ${path.relative(Dir.Root, File.CompiledPackageJson)}.main=${functionsIndex}`);
})();
