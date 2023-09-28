import * as vscode from 'vscode';
import { FrequentlyUsedFilesProvider } from '../tree/frequentlyUsedFilesProvider';
/**
 * Add a file to the template
 */
export async function addGroup(frequentlyUsedFilesProvider: FrequentlyUsedFilesProvider) {
  const groupName = await vscode.window.showInputBox({
    placeHolder: 'Group Name',
  });

  if (groupName) {
    await frequentlyUsedFilesProvider.addGroup(groupName);
  }
}
