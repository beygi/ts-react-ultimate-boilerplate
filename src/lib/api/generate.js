// generate api files using swagger spec file
var fs = require('fs');
var CodeGen = require('swagger-typescript-codegen').CodeGen;

var file = "./swager-specs/" + process.argv[2]
// './api-docs.json';

function jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

var swagger = JSON.parse(fs.readFileSync(file, 'UTF-8').replace(/«/g, "").replace(/»/g, "").replace(/string,Link/g, "StringLink"));
var tsSourceCode = CodeGen.getCustomCode({
    className: jsUcfirst(process.argv[2].split(".")[0] + "Api"),
    swagger: swagger,
    beautify: false,
    lint: false,
    template: {
        class: fs.readFileSync('./swager-specs/templates/class.mustache', 'utf-8'),
        method: fs.readFileSync('./swager-specs/templates/method.mustache', 'utf-8'),
        type: fs.readFileSync('./swager-specs/templates/type.mustache', 'utf-8')
    }
});

fs.writeFile("./src/lib/api/" + process.argv[2].split(".")[0] + ".ts", tsSourceCode, function (err) {
    if (err) {
        return console.log(err);
    }

    console.log(process.argv[2].split(".")[0] + ".ts was saved!");
});
