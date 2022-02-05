// spell-checker:ignore fufconfig

import * as vscode from "vscode";
import {
  GroupOrFile,
  FrequentlyUsedFilesProvider,
} from "./frequentlyUsedFilesProvider";

export function activate(context: vscode.ExtensionContext) {
  // Samples of `window.registerTreeDataProvider`
  const frequentlyUsedFilesProvider = new FrequentlyUsedFilesProvider(
    "fufconfig.json"
  );
  vscode.window.registerTreeDataProvider(
    "frequentlyUsedFiles",
    frequentlyUsedFilesProvider
  );

  vscode.commands.registerCommand("frequentlyUsedFiles.refresh", () => {
    frequentlyUsedFilesProvider.refresh();
    vscode.window.showInformationMessage(`Refreshed frequentlyUsedFiles`);
  });

  vscode.commands.registerCommand(
    "frequentlyUsedFiles.openGroup",
    async (branchPressed: GroupOrFile) => {
      const folders = vscode.workspace.workspaceFolders;
      if (folders) {
        // Open up all the files in this group
        for (const file of branchPressed.files) {
          const uri = vscode.Uri.joinPath(folders[0].uri, file.label);
          const doc = await vscode.workspace.openTextDocument(uri);
          vscode.window.showTextDocument(doc);
        }
      }
    }
  );

  vscode.commands.registerCommand(
    "frequentlyUsedFiles.openFile",
    async (filePressed: GroupOrFile) => {
      const folders = vscode.workspace.workspaceFolders;
      if (folders) {
        const uri = vscode.Uri.joinPath(folders[0].uri, filePressed.label);

        const doc = await vscode.workspace.openTextDocument(uri);
        vscode.window.showTextDocument(doc);
      }
    }
  );
}

export function deactivate() {}
