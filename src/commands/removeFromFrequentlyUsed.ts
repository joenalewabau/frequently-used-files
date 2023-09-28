import * as vscode from 'vscode';
import { FrequentlyUsedFilesProvider } from '../tree/frequentlyUsedFilesProvider';
import { FrequentTreeItemBase } from '../tree/groupOrFileTreeItem';
/**
 * Add a file to the template
 */
export async function removeFromFrequentlyUsed(
  itemToRemove: FrequentTreeItemBase,
  frequentlyUsedFilesProvider: FrequentlyUsedFilesProvider,
) {
  // If this a specific file , then remove it from any group it is in
  if (itemToRemove.contextValue === 'file') {
    const relativePath = itemToRemove.label;

    // Find this label in a group
    frequentlyUsedFilesProvider.removeFile(relativePath);
  }
  // If this is a group, then remove all files from this group
  else if (itemToRemove.contextValue === 'group') {
    const groupName = itemToRemove.label;

    frequentlyUsedFilesProvider.removeGroup(groupName);
  }
}
