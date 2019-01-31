/**
 * @module Config
 */
import { DEPLOY_TYPE } from "./constants";
import Languages from "./services/trans/languages";

/**
 * configuration object
 */
const config = {
    apiUrl: (DEPLOY_TYPE === "development") ? "https://staging-api.domain.com" : "https://api.domain.com",
    webSocketUrl: "https://socket.domain.com",
    language: Languages.en,
    languages: Languages,
};

export default config;
