import * as vscode from "vscode";
import { FrequentlyUsedFilesProvider } from "./frequentlyUsedFilesProvider";

export function activate(context: vscode.ExtensionContext) {
  // Samples of `window.registerTreeDataProvider`
  const frequentlyUsedFilesProvider = new FrequentlyUsedFilesProvider();
  vscode.window.registerTreeDataProvider(
    "frequentlyUsedFiles",
    frequentlyUsedFilesProvider
  );
}

export function deactivate() {}
