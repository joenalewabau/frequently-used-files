import * as vscode from 'vscode';
import { FrequentlyUsedFilesProvider } from '../tree/frequentlyUsedFilesProvider';
import {
  FrequentFileTreeItem,
  FrequentGroupTreeItem,
  FrequentTreeItemBase,
} from '../tree/groupOrFileTreeItem';
/**
 * Add a file to the template
 */
export async function removeFromFrequentlyUsed(
  itemToRemove: FrequentTreeItemBase,
  frequentlyUsedFilesProvider: FrequentlyUsedFilesProvider,
) {
  // If this a specific file , then remove it from any group it is in
  if (itemToRemove instanceof FrequentFileTreeItem) {
    const relativePath = itemToRemove.label;

    // Find this label in a group
    frequentlyUsedFilesProvider.removeFile(relativePath, itemToRemove.group);
  }
  // If this is a group, then remove all files from this group
  else if (itemToRemove instanceof FrequentGroupTreeItem) {
    // Confirm removal for a group if it has files in it
    const groupName = itemToRemove.label;
    if (itemToRemove.files.length !== 0) {
      const confirmRemove = await vscode.window.showInformationMessage(
        `Remove group ${groupName}?`,
        'Yes',
        'No',
      );

      if (confirmRemove !== 'Yes') {
        return;
      }
    }

    frequentlyUsedFilesProvider.removeGroup(groupName);
  }
}
