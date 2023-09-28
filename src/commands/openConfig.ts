import * as vscode from 'vscode';
import { FrequentlyUsedFilesProvider } from '../tree/frequentlyUsedFilesProvider';
import { DEFAULT_CONFIG_FILE_NAME } from '../constants';
/**
 * Opens the configuration file for the user so they can manually edit if required.
 */
export async function openConfig(frequentlyUsedFilesProvider: FrequentlyUsedFilesProvider) {
  const folders = vscode.workspace.workspaceFolders;
  if (folders) {
    const uri = vscode.Uri.joinPath(folders[0].uri, DEFAULT_CONFIG_FILE_NAME);

    await vscode.commands.executeCommand('vscode.open', uri);
  }
}
