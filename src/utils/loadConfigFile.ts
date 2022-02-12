import { err, ok, Result } from "neverthrow";
import * as vscode from "vscode";
import * as Joi from "joi";
import { GroupOrFile } from "../frequentlyUsedFilesProvider";

const groupSchema = Joi.object({
  name: Joi.string().required(),
  files: Joi.array().items(Joi.string()).required(),
});

const groupSettingsSchema = Joi.object({
  groups: Joi.array().items(groupSchema).required(),
});

export interface FUFGroupRaw {
  name: string;
  files: string[];
}

export interface FUFSettingsRaw {
  groups: FUFGroupRaw[];
}

export interface FUFGroup {
  name: GroupOrFile;
  files: GroupOrFile[];
}

export interface LoadConfigFailure {
  code: "config-not-found" | "config-format-error" | "code-no-workspace";
  message: string;
}

export async function loadConfigFile(
  configFile: string
): Promise<Result<GroupOrFile[], LoadConfigFailure>> {
  try {
    const folders = vscode.workspace.workspaceFolders;

    if (folders) {
      vscode.commands.executeCommand(
        "setContext",
        "frequentlyUsedFiles.configFormatError",
        false
      );

      const uri = vscode.Uri.joinPath(folders[0].uri, configFile);

      const doc = await vscode.workspace.openTextDocument(uri);
      const text = doc.getText();

      const jsonContents = JSON.parse(text);

      // Validate the contents against expected schema

      const { value, error } = groupSettingsSchema.validate(jsonContents);

      if (error) {
        const message = `FUF Config format issue: ${error.message}`;
        vscode.window.showErrorMessage(message);
        vscode.commands.executeCommand(
          "setContext",
          "frequentlyUsedFiles.configFormatError",
          true
        );

        return err({
          code: "config-format-error",
          message,
        });
      }

      // We have a valid config file - turn it into an object we understand
      const config: FUFSettingsRaw = value as FUFSettingsRaw;

      const groups: GroupOrFile[] = [];

      for (const group of config.groups) {
        const groupFiles = group.files.map((fileName) => {
          return new GroupOrFile(fileName, []);
        });

        const processedGroup = new GroupOrFile(group.name, groupFiles);

        groups.push(processedGroup);
      }

      return ok(groups);
    }
    const message = `FUF: no VSCode workspace folders `;
    vscode.window.showErrorMessage(message);

    return err({
      code: "code-no-workspace",
      message,
    });
  } catch (error) {
    const message = `FUF: config file ${configFile} is not present - ${JSON.stringify(
      error
    )}`;
    // No need to show the message
    // vscode.window.showErrorMessage(msg);
    return err({
      code: "config-not-found",
      message,
    });
  }
}
