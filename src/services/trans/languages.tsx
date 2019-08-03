/**
 * @module Services/i18n/Languages
 */

import ar from "antd/lib/locale-provider/ar_EG";
import en from "antd/lib/locale-provider/en_US";
import fa from "antd/lib/locale-provider/fa_IR";
import "moment/locale/fa";

/** languages which is supported currently must be add here */
const languages = {
    en: {
        codeName: "en",
        dir: "ltr",
        name: "English",
        locale: "en-US",
        antLocale: en,
    },
    fa: {
        codeName: "fa",
        dir: "rtl",
        name: "فارسی",
        locale: "fa-IR",
        antLocale: fa,
    },
    ar: {
        codeName: "ar",
        dir: "rtl",
        name: "العربية",
        locale: "ar-EG",
        antLocale: ar,
    },
};

export default languages;
