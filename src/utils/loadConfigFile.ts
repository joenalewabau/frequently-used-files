import { err, ok, Result } from "neverthrow";
import * as vscode from "vscode";
import * as Joi from "joi";
import { BranchOrFile } from "../frequentlyUsedFilesProvider";
import { groupCollapsed } from "console";

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
  name: BranchOrFile;
  files: BranchOrFile[];
}

export async function loadConfigFile(
  configFile: string
): Promise<Result<BranchOrFile[], string>> {
  try {
    const folders = vscode.workspace.workspaceFolders;

    if (folders) {
      const uri = vscode.Uri.joinPath(folders[0].uri, configFile);

      const doc = await vscode.workspace.openTextDocument(uri);
      const text = doc.getText();

      const jsonContents = JSON.parse(text);

      // Validate the contents against expected schema

      const { value, error } = groupSettingsSchema.validate(jsonContents);

      if (error) {
        const msg = `FUF Config format issue: ${error.message}`;
        vscode.window.showErrorMessage(msg);

        return err(msg);
      }

      // We have a valid config file - turn it into an object we understand
      const config: FUFSettingsRaw = value as FUFSettingsRaw;

      const groups: BranchOrFile[] = [];

      for (const group of config.groups) {
        const groupFiles = group.files.map((fileName) => {
          return new BranchOrFile(fileName, []);
        });

        const processedGroup = new BranchOrFile(group.name, groupFiles);

        groups.push(processedGroup);
      }

      return ok(groups);
    }
    const msg = `FUF: no VSCode workspace folders `;
    vscode.window.showErrorMessage(msg);
    return err(msg);
  } catch (error) {
    const msg = `FUF: config file ${configFile} is not present - ${JSON.stringify(
      error
    )}`;
    vscode.window.showErrorMessage(msg);
    return err(msg);
  }
}
