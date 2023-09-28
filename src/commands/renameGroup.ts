import * as vscode from 'vscode';
import { FrequentlyUsedFilesProvider } from '../tree/frequentlyUsedFilesProvider';
import { FrequentGroupTreeItem } from '../tree/groupOrFileTreeItem';
/**
 * Rename a group
 */
export async function renameGroup(
  groupToRename: FrequentGroupTreeItem,
  frequentlyUsedFilesProvider: FrequentlyUsedFilesProvider,
) {
  const newGroupName = await vscode.window.showInputBox({
    placeHolder: `New group name for ${groupToRename.label}`,
    title: `Rename group`,
  });

  if (newGroupName) {
    await frequentlyUsedFilesProvider.renameGroup(groupToRename.label, newGroupName);
  }
}
