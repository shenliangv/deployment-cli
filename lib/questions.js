function versionValidator(version) {
  return version ? true : "version is required";
}

module.exports = {
  DEPLOY: [
    { type: "input", name: "tag", message: "Input git tag:" },
    {
      type: "input",
      name: "version",
      validate: versionValidator,
      message: "Input app version:"
    },
    { type: "confirm", name: "backup", message: "Backup after deploy?" }
  ],
  ROLLBACK: [
    {
      type: "input",
      name: "version",
      validate: versionValidator,
      message: "Input rollback version:"
    }
  ]
};
