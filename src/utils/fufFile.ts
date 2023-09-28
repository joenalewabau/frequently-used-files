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

  /**
   * Add a new group to the config file
   * @param groupName
   */
  async addGroup(groupName: string) {
    const newGroup = new FUFGroup(groupName, []);
    this.groups.push(newGroup);
    // Save this change to disk
    await this.writeToConfigFile(this.uri);
  }

  /**
   * Add a new group to the config file
   * @param groupName
   */
  async renameGroup(existingGroupName: string, newGroupName: string) {
    const existingGroup = this.groups.find((group) => group.name === existingGroupName);

    if (existingGroup) {
      existingGroup.name = newGroupName;
    }

    // Save this change to disk
    await this.writeToConfigFile(this.uri);
  }

  /**
   * Add a file to a group or create a new group if it doesn't exist
   * @param groupName
   * @param filePath
   */
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

  /**
   * Remove a file from a group
   * @param filePath
   * @param groupName
   */
  async removeFile(filePath: string, groupName: string) {
    // Find the group and remove the file from it
    const group = this.groups.find((group) => group.name === groupName);

    if (group) {
      group.files = group.files.filter((file) => file !== filePath);
    }

    // Save this change to disk
    await this.writeToConfigFile(this.uri);
  }

  /**
   * Remove a group
   * @param groupName
   */
  async removeGroup(groupName: string) {
    this.groups = this.groups.filter((group) => group.name !== groupName);
    await this.writeToConfigFile(this.uri);
  }

  /**
   * Load a config file from disk. Note that this works from disk and not
   * from the `openTextDocument` as VS Code might be holding onto a buffered
   * version and all of our manipulation is done on the file itself and not
   * the buffer.
   *
   * @param uri
   * @returns
   */
  static async readConfigFileFromDisk(
    uri: vscode.Uri,
  ): Promise<Result<FUFFile, LoadConfigFailure>> {
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

  /**
   * Write the config file to disk
   * @param uri
   * @returns
   */
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
