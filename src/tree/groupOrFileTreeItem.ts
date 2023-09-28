import * as vscode from 'vscode';

export class GroupOrFileTreeItem extends vscode.TreeItem {
  constructor(public readonly label: string, public readonly files: GroupOrFileTreeItem[]) {
    super(label);

    this.tooltip = `${this.label}`;

    if (files.length > 0) {
      this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
      this.contextValue = 'group';
    } else {
      this.collapsibleState = vscode.TreeItemCollapsibleState.None;
      this.contextValue = 'file';
      this.command = {
        command: 'frequentlyUsedFiles.openFileViaClickInTreeWindow',
        title: 'Open',
        arguments: [this],
      };
    }
  }
}
