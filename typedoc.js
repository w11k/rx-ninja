module.exports = {
    entryPoints: ['./src/index.ts'],
    excludePrivate: true,
    out: "doc",
    exclude: ["**/*+(.test).ts", "src/tslint_rules/examples/**/*.ts", "**/*+(.test.diagram).ts"],
};
