"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const tl = require("azure-pipelines-task-lib/task");
const fs = require("fs");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // const keyValue: string | undefined = tl.getInput("keyValue", true);
            // const keyValue = "john=doe\nsheep=keep\nphung=god";
            const keyValue = tl.getInput("keyValue");
            // const rootDir = "/Users/napat/Documents/works/replace-text-with-json";
            const rootDir = tl.getInput("rootDir");
            // const sourcePath = "index.html";
            const sourcePath = tl.getPathInput("source");
            const absolutePath = tl.resolve(rootDir, sourcePath);
            const contents = fs.readFileSync(absolutePath).toString();
            const keyValueArr = keyValue.split("\n").map((item) => item.trim());
            const keyValueObj = keyValueArr.reduce((keyValueObj, item) => {
                const [key, value] = item.split("=");
                return Object.assign({}, keyValueObj, { [key]: value });
            }, {});
            const replacedContents = contents.replace(/"@RUNTIME_ENV"/g, JSON.stringify(keyValueObj));
            fs.writeFileSync(absolutePath, replacedContents);
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
