// spell-checker:ignore neverthrow Joi
import { err, ok, Result } from 'neverthrow';
import * as vscode from 'vscode';
import { FUFFile, LoadConfigFailure } from './fufFile';

export async function loadConfigFile(
  configFile: string,
): Promise<Result<FUFFile, LoadConfigFailure>> {
  try {
    const folders = vscode.workspace.workspaceFolders;

    if (folders) {
      vscode.commands.executeCommand('setContext', 'frequentlyUsedFiles.configFormatError', false);

      const uri = vscode.Uri.joinPath(folders[0].uri, configFile);

      const result = await FUFFile.loadConfigFile(uri);

      if (result.isErr()) {
        const message = `FUF Config format issue: ${result.error.message}`;
        vscode.window.showErrorMessage(message);
        vscode.commands.executeCommand('setContext', 'frequentlyUsedFiles.configFormatError', true);

        return err(result.error);
      }

      // Create matching tree structure or loaded file
      const fufFile = result.value;
      return ok(fufFile);
    }
    const message = `FUF: no VSCode workspace folders `;
    vscode.window.showErrorMessage(message);

    return err({
      code: 'code-no-workspace',
      message,
    });
  } catch (error) {
    const message = `FUF: config file ${configFile} is not present - ${JSON.stringify(error)}`;
    // No need to show the message
    // vscode.window.showErrorMessage(msg);
    return err({
      code: 'config-not-found',
      message,
    });
  }
}
