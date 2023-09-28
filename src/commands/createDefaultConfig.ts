import * as vscode from 'vscode';
import { FrequentlyUsedFilesProvider } from '../tree/frequentlyUsedFilesProvider';
import { DEFAULT_CONFIG_FILE_CONTENTS, DEFAULT_CONFIG_FILE_NAME } from '../constants';
/**
 * Create a default configuration file for the user
 */
export async function createDefaultConfig(
  frequentlyUsedFilesProvider: FrequentlyUsedFilesProvider,
) {
  const folders = vscode.workspace.workspaceFolders;
  if (folders) {
    const uri = vscode.Uri.joinPath(folders[0].uri, DEFAULT_CONFIG_FILE_NAME);

    const edit = new vscode.WorkspaceEdit();

    edit.createFile(uri, { ignoreIfExists: true });

    const position = new vscode.Position(0, 0);
    edit.insert(uri, position, DEFAULT_CONFIG_FILE_CONTENTS);

    await vscode.workspace.applyEdit(edit);

    frequentlyUsedFilesProvider.refresh();
  }
}
