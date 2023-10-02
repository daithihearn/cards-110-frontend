/** @type {import("jest").Config} */
const { defaults: tsjPreset } = require("ts-jest/presets")

module.exports = {
    ...tsjPreset,
    testTimeout: 10000,
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testMatch: ["**/*.(spec|test).(ts|tsx|js|jsx)"],
    maxWorkers: 2,
    reporters: ["default", "jest-junit"],
    moduleNameMapper: {
        "^model/(.*)$": "<rootDir>/src/model/$1",
    },
}
