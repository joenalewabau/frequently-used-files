import { getVSCodeDownloadUrl } from "@vscode/test-electron/out/util";
import * as vscode from "vscode";
import { FrequentlyUsedFilesProvider } from "./frequentlyUsedFilesProvider";

export function activate(context: vscode.ExtensionContext) {
  // Samples of `window.registerTreeDataProvider`
  const frequentlyUsedFilesProvider = new FrequentlyUsedFilesProvider();
  vscode.window.registerTreeDataProvider(
    "frequentlyUsedFiles",
    frequentlyUsedFilesProvider
  );

  vscode.commands.registerCommand("frequentlyUsedFiles.refresh", () =>
    vscode.window.showInformationMessage(`Refresh frequentlyUsedFiles.`)
  );

  vscode.commands.registerCommand("frequentlyUsedFiles.refreshABranch", () => {
    console.log(`Workspace name ${vscode.workspace.name}`);
    console.log(`Workspace folders `, vscode.workspace.workspaceFolders);

    vscode.workspace.workspaceFolders?.forEach((folder) =>
      console.log({ folder })
    );
    const currentDocs = vscode.workspace.textDocuments;

    currentDocs.forEach((doc) => {
      console.log(`Doc fsPath is ${doc.uri.fsPath}`);
    });
  });

  vscode.commands.registerCommand("frequentlyUsedFiles.addAFile", () =>
    vscode.window.showInformationMessage(`Add a file.`)
  );
}

export function deactivate() {}
