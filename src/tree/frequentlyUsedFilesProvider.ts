import * as vscode from 'vscode';
import { loadConfigFile } from '../utils/loadConfigFile';
import { FUFFile } from '../utils/fufFile';
import { GroupOrFileTreeItem } from './groupOrFileTreeItem';

export class FrequentlyUsedFilesProvider implements vscode.TreeDataProvider<GroupOrFileTreeItem> {
  private fufFile: FUFFile | null;

  constructor(public readonly configFile: string) {
    this.fufFile = null;
  }

  /**
   *
   * @param element The group or file
   * @returns
   */
  getTreeItem(element: GroupOrFileTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: GroupOrFileTreeItem): Promise<GroupOrFileTreeItem[]> {
    // If we have an element that we return the files for that element
    if (element) {
      return element.files;
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
        return new GroupOrFileTreeItem(fileName, []);
      });

      return new GroupOrFileTreeItem(group.name, nestedTreeFiles);
    });

    return topLevelTreeGroups;
  }

  // Add a file to a  group and refresh the view
  async addFileToGroup(groupName: string, filePath: string) {
    if (this.fufFile) {
      await this.fufFile.addFileToGroup(groupName, filePath);
    }

    this.refresh();
  }

  // Add a file to a  group and refresh the view
  async removeFile(filePath: string) {
    if (this.fufFile) {
      await this.fufFile.removeFile(filePath);
    }
    this.refresh();
  }

  // Add a file to a  group and refresh the view
  async removeGroup(groupName: string) {
    if (this.fufFile) {
      await this.fufFile.removeGroup(groupName);
    }

    this.refresh();
  }
  // Refresh implementation
  private _onDidChangeTreeData: vscode.EventEmitter<GroupOrFileTreeItem | undefined> =
    new vscode.EventEmitter<GroupOrFileTreeItem | undefined>();

  readonly onDidChangeTreeData: vscode.Event<GroupOrFileTreeItem | undefined> =
    this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}
