import * as vscode from "vscode";
import { loadConfigFile } from "./utils/loadConfigFile";

export class FrequentlyUsedFilesProvider
  implements vscode.TreeDataProvider<GroupOrFile>
{
  constructor(public readonly configFile: string) {}

  getTreeItem(element: GroupOrFile): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: GroupOrFile): Promise<GroupOrFile[]> {
    if (element) {
      return Promise.resolve(element.files);
    }

    // Attempt to load the config file
    const loadFilesFromConfig = await loadConfigFile(this.configFile);

    if (loadFilesFromConfig.isErr()) {
      const errorMessage = loadFilesFromConfig.error;
      // Only show error message if error is not the file being found.
      // If config file is not found then the welcome view will be displayed
      if (errorMessage.indexOf("is not present") === -1) {
        // No need to show a message as
        vscode.window.showInformationMessage(loadFilesFromConfig.error);
      }
      return Promise.resolve([]);
    }

    return Promise.resolve(loadFilesFromConfig.value);
  }

  // Refresh implementation
  private _onDidChangeTreeData: vscode.EventEmitter<
    GroupOrFile | undefined | null | void
  > = new vscode.EventEmitter<GroupOrFile | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    GroupOrFile | undefined | null | void
  > = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }
}

export class GroupOrFile extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly files: GroupOrFile[]
  ) {
    super(label);

    this.tooltip = `${this.label}`;

    if (files.length > 0) {
      this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
      this.contextValue = "group";
    } else {
      this.collapsibleState = vscode.TreeItemCollapsibleState.None;
      this.contextValue = "file";
      this.command = {
        command: "frequentlyUsedFiles.openFileViaClick",
        title: "Open",
        arguments: [label],
      };
    }
  }
}
