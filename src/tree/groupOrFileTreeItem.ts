import * as vscode from 'vscode';

export class FrequentTreeItemBase extends vscode.TreeItem {
  constructor(public readonly label: string) {
    super(label);

    this.tooltip = `${this.label}`;
  }
}

export class FrequentGroupTreeItem extends FrequentTreeItemBase {
  constructor(public readonly label: string, public readonly files: FrequentFileTreeItem[]) {
    super(label);
    this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    this.contextValue = 'group';
  }
}

export class FrequentFileTreeItem extends FrequentTreeItemBase {
  constructor(public readonly label: string) {
    super(label);

    this.collapsibleState = vscode.TreeItemCollapsibleState.None;
    this.contextValue = 'file';
    this.command = {
      command: 'frequentlyUsedFiles.openFileViaClickInTreeWindow',
      title: 'Open',
      arguments: [this],
    };
  }
}

// export class GroupOrFileTreeItem extends vscode.TreeItem {
//   constructor(public readonly label: string, public readonly files: GroupOrFileTreeItem[]) {
//     super(label);

//     this.tooltip = `${this.label}`;

//     if (files.length > 0) {
//       this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
//       this.contextValue = 'group';
//     } else {
//       this.collapsibleState = vscode.TreeItemCollapsibleState.None;
//       this.contextValue = 'file';
//       this.command = {
//         command: 'frequentlyUsedFiles.openFileViaClickInTreeWindow',
//         title: 'Open',
//         arguments: [this],
//       };
//     }
//   }
// }
