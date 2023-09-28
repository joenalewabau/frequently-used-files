import * as vscode from 'vscode';
import { GroupOrFileTreeItem } from '../tree/groupOrFileTreeItem';
/**
 * Opens a frequently used file or group
 */
export async function openFileOrGroup(fileOrGroupToOPen: GroupOrFileTreeItem) {
  const folders = vscode.workspace.workspaceFolders;
  if (folders) {
    if (fileOrGroupToOPen.contextValue === 'file') {
      const uri = vscode.Uri.joinPath(folders[0].uri, fileOrGroupToOPen.label);

      await vscode.commands.executeCommand('vscode.open', uri);
    } else if (fileOrGroupToOPen.contextValue === 'group') {
      // Open up all the files in this group
      for (const file of fileOrGroupToOPen.files) {
        const uri = vscode.Uri.joinPath(folders[0].uri, file.label);
        await vscode.commands.executeCommand('vscode.open', uri);
      }
    }
  }
}
