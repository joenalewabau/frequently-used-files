import * as vscode from "vscode";
import * as path from "path";

export class FrequentlyUsedFilesProvider
  implements vscode.TreeDataProvider<BranchOrFile>
{
  private info: BranchOrFile[] = [
    new BranchOrFile("Group A", [
      new BranchOrFile("groupA - file 1", []),
      new BranchOrFile("groupA - file 2", []),
    ]),
    new BranchOrFile("Group B", [
      new BranchOrFile("groupB - file 1", []),
      new BranchOrFile("groupB - file 2", []),
      new BranchOrFile("groupB - file 3", []),
    ]),
    new BranchOrFile("Group C", []),
  ];

  constructor() {}

  getTreeItem(element: BranchOrFile): vscode.TreeItem {
    return element;
  }

  getChildren(element?: BranchOrFile): Thenable<BranchOrFile[]> {
    if (element) {
      return Promise.resolve(element.files);
    }

    return Promise.resolve(this.info);
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
      this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
      this.contextValue = "branch";
    } else {
      this.collapsibleState = vscode.TreeItemCollapsibleState.None;
      this.contextValue = "file";
    }
  }
}
