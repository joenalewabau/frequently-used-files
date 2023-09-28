import * as vscode from 'vscode';
import { FrequentGroupTreeItem, FrequentTreeItemBase } from '../tree/groupOrFileTreeItem';
/**
 * Opens a frequently used file or group
 */
export async function openFileOrGroup(fileOrGroupToOpen: FrequentTreeItemBase) {
  const folders = vscode.workspace.workspaceFolders;
  if (folders) {
    if (fileOrGroupToOpen.contextValue === 'file') {
      const uri = vscode.Uri.joinPath(folders[0].uri, fileOrGroupToOpen.label);

      await vscode.commands.executeCommand('vscode.open', uri);
    } else if (fileOrGroupToOpen.contextValue === 'group') {
      const group = fileOrGroupToOpen as FrequentGroupTreeItem;
      // Open up all the files in this group
      for (const file of group.files) {
        const uri = vscode.Uri.joinPath(folders[0].uri, file.label);
        await vscode.commands.executeCommand('vscode.open', uri);
      }
    }
  }
}
