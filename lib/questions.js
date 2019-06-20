const operates = require("./operates");

function versionValidator(version) {
  return version ? true : "version is required";
}

module.exports = {
  [operates.DEPLOY]: [
    { type: "input", name: "tag", message: "Input git tag:" },
    {
      type: "input",
      name: "version",
      validate: versionValidator,
      message: "Input app version:"
    },
    { type: "confirm", name: "backup", message: "Backup after deploy?" },
    {
      type: "confirm",
      name: "remove",
      message: "Remove original source code files?",
      default: false
    }
  ],
  [operates.ROLLBACK]: [
    {
      type: "input",
      name: "version",
      validate: versionValidator,
      message: "Input rollback version:"
    }
  ]
};
