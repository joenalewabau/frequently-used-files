import * as vscode from "vscode";
import { loadConfigFile } from "./utils/loadConfigFile";

export class FrequentlyUsedFilesProvider
  implements vscode.TreeDataProvider<BranchOrFile>
{
  constructor(public readonly configFile: string) {}

  getTreeItem(element: BranchOrFile): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: BranchOrFile): Promise<BranchOrFile[]> {
    if (element) {
      return Promise.resolve(element.files);
    }

    // Attempt to load the config file
    const loadFilesFromConfig = await loadConfigFile(this.configFile);

    if (loadFilesFromConfig.isErr()) {
      vscode.window.showInformationMessage(loadFilesFromConfig.error);
      return Promise.resolve([]);
    }

    return Promise.resolve(loadFilesFromConfig.value);
  }
}

export class BranchOrFile extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly files: BranchOrFile[]
  ) {
    super(label);

    this.tooltip = `${this.label}`;
    // this.description = `${this.label} - Description`;

    if (files.length > 0) {
      this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
      this.contextValue = "branch";
    } else {
      this.collapsibleState = vscode.TreeItemCollapsibleState.None;
      this.contextValue = "file";
    }
  }
}
