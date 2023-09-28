import * as vscode from 'vscode';
import { GroupOrFileTreeItem } from '../tree/groupOrFileTreeItem';
/**
 * Add a file to the template
 */
export async function openFileViaClickInTreeWindow(fileClicked: GroupOrFileTreeItem) {
  const folders = vscode.workspace.workspaceFolders;
  if (folders) {
    const uri = vscode.Uri.joinPath(folders[0].uri, fileClicked.label);

    await vscode.commands.executeCommand('vscode.open', uri);
  }
}
