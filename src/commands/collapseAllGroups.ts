import * as vscode from 'vscode';
import { FrequentlyUsedFilesProvider } from '../tree/frequentlyUsedFilesProvider';
/**
 * Collapse the entire tree of frequently used files
 */
export async function collapseAllGroups() {
  // https://stackoverflow.com/questions/72170016/i-want-to-collapse-a-vscode-tree-view-programatically
  vscode.commands.executeCommand('workbench.actions.treeView.frequentlyUsedFiles.collapseAll');
}
