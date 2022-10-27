module.exports = {
    entryPoints: ['./src/index.ts'],
    excludePrivate: true,
    media: "./tmp/swirly/svgs",
    out: "doc",
    exclude: ["**/*+(.test).ts", "src/tslint_rules/examples/**/*.ts", "**/*+(.test.diagram).ts"],
};
