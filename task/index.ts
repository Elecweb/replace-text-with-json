const tl = require("azure-pipelines-task-lib/task");
const fs = require("fs");

async function run() {
  try {
    // const keyValue: string | undefined = tl.getInput("keyValue", true);
    // const keyValue = "john=doe\nsheep=keep\nphung=god";
    const keyValue: string = tl.getInput("keyValue");
    // const rootDir = "/Users/napat/Documents/works/replace-text-with-json";
    const rootDir: string = tl.getInput("rootDir");
    // const sourcePath = "index.html";
    const sourcePath: string = tl.getPathInput("source");

    const absolutePath = tl.resolve(rootDir, sourcePath);

    const contents = fs.readFileSync(absolutePath).toString();

    const keyValueArr = keyValue.split("\n").map((item) => item.trim());
    const keyValueObj = keyValueArr.reduce((keyValueObj, item) => {
      const [key, value] = item.split("=");
      return {
        ...keyValueObj,
        [key]: value,
      };
    }, {});

    const replacedContents = contents.replace(
      /"@RUNTIME_ENV"/g,
      JSON.stringify(keyValueObj)
    );

    fs.writeFileSync(absolutePath, replacedContents);
  } catch (err) {
    tl.setResult(tl.TaskResult.Failed, err.message);
  }
}

run();
