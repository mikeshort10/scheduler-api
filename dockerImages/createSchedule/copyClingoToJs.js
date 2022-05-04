// Copies clingo rules to variable for quicker consumption in AWS

const fs = require("fs");
const path = require("path");

const clingoFolder = "clingo";

const content = fs
  .readdirSync(path.join(__dirname, clingoFolder), "utf-8")
  .map((fileName) =>
    fs.readFileSync(path.join(__dirname, clingoFolder, fileName), "utf-8")
  )
  .reduce(
    (acc, content) => acc + content.replace(/%.+$/gm, "").replace(/\n/g, ""),
    ""
  );

fs.writeFileSync("./utils/rules.ts", `export const rules = \`${content}\``);
