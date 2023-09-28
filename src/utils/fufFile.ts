import * as vscode from 'vscode';
import { Result, err, ok } from 'neverthrow';
import * as Joi from 'joi';
import { TextDecoder, TextEncoder } from 'util';

const groupSchema = Joi.object({
  name: Joi.string().required(),
  files: Joi.array().items(Joi.string()).required(),
});

const groupSettingsSchema = Joi.object({
  groups: Joi.array().items(groupSchema).required(),
});

class FUFGroup {
  constructor(public name: string, public files: string[]) {}
}

export interface LoadConfigFailure {
  code: 'config-not-found' | 'config-format-error' | 'code-no-workspace';
  message: string;
}

export class FUFFile {
  constructor(private uri: vscode.Uri, public groups: FUFGroup[]) {}

  // Add a file to an existing group or create a new group
  async addFileToGroup(groupName: string, filePath: string) {
    const existingGroup = this.groups.find((group) => group.name === groupName);

    if (existingGroup) {
      existingGroup.files.push(filePath);
    } else {
      // Create a new group and add the file to it
      const newGroup = new FUFGroup(groupName, [filePath]);
      this.groups.push(newGroup);
    }

    // Save this change to disk
    await this.writeToConfigFile(this.uri);
  }

  // Add a file to an existing group or create a new group
  async removeFile(filePath: string) {
    // Go through all the groups and remove any match to the file
    this.groups.forEach((group) => {
      group.files = group.files.filter((file) => file !== filePath);
    });
    // Save this change to disk
    await this.writeToConfigFile(this.uri);
  }

  // Go through all the groups and remove any group with this name
  async removeGroup(groupName: string) {
    this.groups = this.groups.filter((group) => group.name !== groupName);
    await this.writeToConfigFile(this.uri);
  }

  static async loadConfigFile(uri: vscode.Uri): Promise<Result<FUFFile, LoadConfigFailure>> {
    // Note that we always load the data from the file on disk not from VS Code's openTextDocuments as
    // it may have the old contents in it.
    const fileContents = await vscode.workspace.fs.readFile(uri);
    const text = new TextDecoder().decode(fileContents);
    const json = JSON.parse(text);

    const { value, error } = groupSettingsSchema.validate(json);

    if (error) {
      const message = `FUF Config format issue: ${error.message}`;
      vscode.window.showErrorMessage(message);
      vscode.commands.executeCommand('setContext', 'frequentlyUsedFiles.configFormatError', true);

      return err({
        code: 'config-format-error',
        message,
      });
    }

    // Construct the FUFFile object from the data
    const groups = value.groups.map((group: any) => {
      return new FUFGroup(group.name, group.files);
    });

    return ok(new FUFFile(uri, groups));
  }
  async writeToConfigFile(uri: vscode.Uri): Promise<Result<true, string>> {
    try {
      const content = new TextEncoder().encode(JSON.stringify({ groups: this.groups }, null, 2));
      await vscode.workspace.fs.writeFile(uri, content);

      return ok(true);
    } catch (error) {
      return err('Unable to write config file');
    }
  }
}
