module.exports = {
    excludeNotExported: true,
    excludePrivate: true,
    media: "./tmp/swirly/svgs",
    out: "doc",
    exclude: ["**/*+(.test).ts", "src/tslint_rules/examples/**/*.ts", "**/*+(.test.diagram).ts"],
};
