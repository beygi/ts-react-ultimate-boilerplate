/**
 * @module Services/i18n
 */

import i18next from "i18next";
import config from "../../config";
import persianDate from "./pdate";

/**
 * our translation class.
 * po files converted to the i18next supported objects
 * using webpack's po loader. stings in po files collected
 * from srouce code using poedit
 */
i18next.init({
    interpolation: {
        // React already does escaping
        escapeValue: false,
    },
    keySeparator: false,
    lng: config.language.codeName, // 'en' | 'fa'
    nsSeparator: false,
    react:
    {
        wait: false,
    },
    resources: {
        en: { translation: require("./en.po") },
        fa: { translation: require("./fa.po") },
        ar: { translation: require("./ar.po") },
    },
}, () => {
    // initialized and ready to go!

});

// to get current lang : i18next.language
const localDate = (langCode: string) => {
    let pDate: any;
    if (langCode === "fa") {
        pDate = persianDate;
    } else {
        pDate = Date;
    }
    return pDate;
};

export default i18next;
export { localDate };
