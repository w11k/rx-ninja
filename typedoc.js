module.exports = {
    excludeNotExported: true,
    excludePrivate: true,
    media: "./tmp/diagrams",
    out: "doc",
    exclude: ["**/*+(.test).ts", "src/tslint_rules/examples/**/*.ts", "**/*+(.test.diagram).ts"],
};
