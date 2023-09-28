import * as vscode from 'vscode';
import { DEFAULT_CONFIG_FILE_NAME } from './constants';
import { FrequentlyUsedFilesProvider } from './tree/frequentlyUsedFilesProvider';
import { addFileToFrequentlyUsedGroup } from './commands/addFileToFrequentlyUsedGroup';
import { createDefaultConfig } from './commands/createDefaultConfig';
import { openFileViaClickInTreeWindow } from './commands/openFileViaClickInTreeWindow';
import { openFileOrGroup } from './commands/openFileOrGroup';
import { collapseAllGroups } from './commands/collapseAllGroups';
import { openConfig } from './commands/openConfig';
import { refresh } from './commands/refresh';
import { GroupOrFileTreeItem } from './tree/groupOrFileTreeItem';
import { removeFromFrequentlyUsed } from './commands/removeFromFrequentlyUsed';

export function activate(context: vscode.ExtensionContext) {
  // Register the core tree provider
  const frequentlyUsedFilesProvider = new FrequentlyUsedFilesProvider(DEFAULT_CONFIG_FILE_NAME);
  vscode.window.registerTreeDataProvider('frequentlyUsedFiles', frequentlyUsedFilesProvider);

  //* Top level commands for the tree view
  vscode.commands.registerCommand('frequentlyUsedFiles.refresh', () =>
    refresh(frequentlyUsedFilesProvider),
  );

  vscode.commands.registerCommand('frequentlyUsedFiles.openConfig', async () =>
    openConfig(frequentlyUsedFilesProvider),
  );

  vscode.commands.registerCommand('frequentlyUsedFiles.collapseAll', async () =>
    collapseAllGroups(frequentlyUsedFilesProvider),
  );

  vscode.commands.registerCommand('frequentlyUsedFiles.createDefaultConfig', async () =>
    createDefaultConfig(frequentlyUsedFilesProvider),
  );

  //* Commands for a frequently used group or file
  vscode.commands.registerCommand(
    'frequentlyUsedFiles.openFileOrGroup',
    async (fileOrGroupPressed: GroupOrFileTreeItem) => openFileOrGroup(fileOrGroupPressed),
  );
  vscode.commands.registerCommand(
    'frequentlyUsedFiles.removeFileOrGroup',
    async (fileOrGroupPressed: GroupOrFileTreeItem) =>
      removeFromFrequentlyUsed(fileOrGroupPressed, frequentlyUsedFilesProvider),
  );

  //* Commands for a frequently used file
  vscode.commands.registerCommand(
    'frequentlyUsedFiles.openFileViaClickInTreeWindow',
    async (fileClicked: GroupOrFileTreeItem) => openFileViaClickInTreeWindow(fileClicked),
  );

  //* Other Commands
  // Command to add a specific file to a group. This will kick off the quick pick process for a group
  vscode.commands.registerCommand(
    'frequentlyUsedFiles.addFileToFrequentFiles',
    async (resourceUri: vscode.Uri) =>
      addFileToFrequentlyUsedGroup(resourceUri, frequentlyUsedFilesProvider),
  );
}
