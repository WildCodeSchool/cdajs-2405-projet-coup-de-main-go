import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    setupFilesAfterEnv: ["./src/tests_mockTypeorm-config.ts"],
};

export default config;
