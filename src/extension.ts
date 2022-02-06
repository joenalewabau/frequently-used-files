import * as vscode from "vscode";
import {
  DEFAULT_CONFIG_FILE_CONTENTS,
  DEFAULT_CONFIG_FILE_NAME,
} from "./constants";
import {
  GroupOrFile,
  FrequentlyUsedFilesProvider,
} from "./frequentlyUsedFilesProvider";

export function activate(context: vscode.ExtensionContext) {
  // Register the core tree provider
  const frequentlyUsedFilesProvider = new FrequentlyUsedFilesProvider(
    DEFAULT_CONFIG_FILE_NAME
  );
  vscode.window.registerTreeDataProvider(
    "frequentlyUsedFiles",
    frequentlyUsedFilesProvider
  );

  // Register all the commands
  vscode.commands.registerCommand("frequentlyUsedFiles.refresh", () => {
    frequentlyUsedFilesProvider.refresh();
    vscode.window.showInformationMessage(`Refreshed frequentlyUsedFiles`);
  });

  vscode.commands.registerCommand(
    "frequentlyUsedFiles.openGroup",
    async (groupPressed: GroupOrFile) => {
      const folders = vscode.workspace.workspaceFolders;
      if (folders) {
        // Open up all the files in this group
        for (const file of groupPressed.files) {
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

  /**
   * Create a default config file
   */
  vscode.commands.registerCommand(
    "frequentlyUsedFiles.createDefaultConfig",
    async () => {
      const folders = vscode.workspace.workspaceFolders;
      if (folders) {
        const uri = vscode.Uri.joinPath(
          folders[0].uri,
          DEFAULT_CONFIG_FILE_NAME
        );

        const edit = new vscode.WorkspaceEdit();

        edit.createFile(uri, { ignoreIfExists: true });

        const position = new vscode.Position(0, 0);
        edit.insert(uri, position, DEFAULT_CONFIG_FILE_CONTENTS);

        await vscode.workspace.applyEdit(edit);

        frequentlyUsedFilesProvider.refresh();
      }
    }
  );
}

export function deactivate() {}
