module.exports = {
    excludePrivate: true,
    media: "./tmp/swirly/svgs",
    entryPoints: ["src/index.ts"],
    out: "doc",
    exclude: ["**/*+(.test).ts", "src/tslint_rules/examples/**/*.ts", "**/*+(.test.diagram).ts"],
};
