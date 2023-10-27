import * as vscode from 'vscode';
import { loadConfigFile } from '../utils/loadConfigFile';
import { FUFFile } from '../utils/fufFile';
import {
  FrequentFileTreeItem,
  FrequentGroupTreeItem,
  FrequentTreeItemBase,
} from './groupOrFileTreeItem';

export class FrequentlyUsedFilesProvider implements vscode.TreeDataProvider<FrequentTreeItemBase> {
  private fufFile: FUFFile | null;

  constructor(public readonly configFile: string) {
    this.fufFile = null;

    // Watch the config file for changes
    const folders = vscode.workspace.workspaceFolders;

    if (folders) {
      const uri = vscode.Uri.joinPath(folders[0].uri, configFile);
      let fileWatcher = vscode.workspace.createFileSystemWatcher(uri.fsPath);
      fileWatcher.onDidChange(() => {
        this.getChildren();
        this.refresh();
      });
    }
  }

  /**
   *
   * @param element The group or file
   * @returns
   */
  getTreeItem(element: FrequentTreeItemBase): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: FrequentTreeItemBase): Promise<FrequentTreeItemBase[]> {
    // If we have an element that we return the files for that element
    if (element) {
      // If this is a group then return the files in that group
      if (element instanceof FrequentGroupTreeItem) {
        return element.files;
      }
    }

    // Attempt to load the config file
    const loadFilesFromConfig = await loadConfigFile(this.configFile);

    if (loadFilesFromConfig.isErr()) {
      // Only show error message if error is not the file being found.
      // If config file is not found then the welcome view will be displayed
      const error = loadFilesFromConfig.error;

      if (error.code !== 'config-not-found') {
        // No need to show a message as
        vscode.window.showInformationMessage(error.message);
      }
      return [];
    }

    this.fufFile = loadFilesFromConfig.value;
    const topLevelTreeGroups = this.fufFile.groups.map((group) => {
      const nestedTreeFiles = group.files.map((fileName) => {
        return new FrequentFileTreeItem(fileName, group.name);
      });

      return new FrequentGroupTreeItem(group.name, nestedTreeFiles);
    });

    return topLevelTreeGroups;
  }

  /**
   * Add a group
   * @param groupName
   */
  async addGroup(groupName: string) {
    if (this.fufFile) {
      await this.fufFile.addGroup(groupName);
    }
  }

  /**
   * Rename a group
   * @param groupName
   */
  async renameGroup(existingGroupName: string, newGroupName: string) {
    if (this.fufFile) {
      await this.fufFile.renameGroup(existingGroupName, newGroupName);
    }
  }

  // Add a file to a  group and refresh the view
  async addFileToGroup(groupName: string, filePath: string) {
    if (this.fufFile) {
      await this.fufFile.addFileToGroup(groupName, filePath);
    }
  }

  // Add a file to a  group and refresh the view
  async removeFile(filePath: string, group: string) {
    if (this.fufFile) {
      await this.fufFile.removeFile(filePath, group);
    }
  }

  // Add a file to a  group and refresh the view
  async removeGroup(groupName: string) {
    if (this.fufFile) {
      await this.fufFile.removeGroup(groupName);
    }
  }
  // Refresh implementation
  private _onDidChangeTreeData: vscode.EventEmitter<FrequentTreeItemBase | undefined> =
    new vscode.EventEmitter<FrequentTreeItemBase | undefined>();

  readonly onDidChangeTreeData: vscode.Event<FrequentTreeItemBase | undefined> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}
