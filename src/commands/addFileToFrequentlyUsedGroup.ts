import * as vscode from 'vscode';
import { FrequentlyUsedFilesProvider } from '../tree/frequentlyUsedFilesProvider';

/**
 * Add a file to a frequently used group. When the user selects a file, they are prompted to select a
 * group to add the file to.
 */
export async function addFileToFrequentlyUsedGroup(
  resourceUri: vscode.Uri,
  frequentlyUsedFilesProvider: FrequentlyUsedFilesProvider,
) {
  const folders = vscode.workspace.workspaceFolders;
  if (folders) {
    // Get the relative file name from the file selected
    const relativePath = vscode.workspace.asRelativePath(resourceUri, false);

    // Get a list of the groups that are available
    const currentGroups = await frequentlyUsedFilesProvider.getChildren();

    const frequentGroups = currentGroups.map((group) => {
      return {
        label: group.label,
      };
    });

    const groupToAddTo = await vscode.window.showQuickPick(frequentGroups, {
      placeHolder: 'Add to which frequently used group?',
      title: 'Add file to frequently used group',
    });

    if (groupToAddTo) {
      frequentlyUsedFilesProvider.addFileToGroup(groupToAddTo.label, relativePath);
    }
  }
}
