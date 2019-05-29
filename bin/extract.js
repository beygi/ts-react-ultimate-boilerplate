const {
    GettextExtractor,
    JsExtractors,
    HtmlExtractors
} = require('gettext-extractor');

let extractor = new GettextExtractor();

extractor
    .createJsParser([
        JsExtractors.callExpression(['t.t', '[this].translations.get'], {
            arguments: {
                text: 0,
                context: 1
            }
        }),
        JsExtractors.callExpression('[this].translations.plural', {
            arguments: {
                text: 1,
                textPlural: 2,
                context: 3
            }
        })
    ])
    .parseFilesGlob('./src/**/*.@(ts|js|tsx|jsx)');

extractor.savePotFile('./src/services/trans/translation.pot');

extractor.printStats();
