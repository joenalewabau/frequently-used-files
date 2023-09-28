import * as vscode from 'vscode';
import { FrequentlyUsedFilesProvider } from '../tree/frequentlyUsedFilesProvider';
/**
 * Collapse the entire tree of frequently used files
 */
export async function collapseAllGroups(frequentlyUsedFilesProvider: FrequentlyUsedFilesProvider) {
  const children = await frequentlyUsedFilesProvider.getChildren();
  children.forEach(async (child) => {
    child.collapsibleState = vscode.TreeItemCollapsibleState.None;
    const grandchildren = await frequentlyUsedFilesProvider.getChildren(child);
    grandchildren.forEach((grandchild) => {
      grandchild.collapsibleState = vscode.TreeItemCollapsibleState.None;
    });
  });

  frequentlyUsedFilesProvider.refresh();
}
