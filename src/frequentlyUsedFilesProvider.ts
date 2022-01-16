import * as vscode from "vscode";
import * as path from "path";

export class FrequentlyUsedFilesProvider
  implements vscode.TreeDataProvider<Dependency>
{
  constructor() {}

  getTreeItem(element: Dependency): vscode.TreeItem {
    return element;
  }

  getChildren(element?: Dependency): Thenable<Dependency[]> {
    vscode.window.showInformationMessage("No dependency in empty workspace");
    return Promise.resolve([new Dependency("foo"), new Dependency("bar")]);
    // }

    // if (element) {
    // 	return Promise.resolve(
    // 		this.getDepsInPackageJson(
    // 			path.join(this.workspaceRoot, 'node_modules', element.label, 'package.json')
    // 		)
    // 	);
    // } else {
    // 	const packageJsonPath = path.join(this.workspaceRoot, 'package.json');
    // 	if (this.pathExists(packageJsonPath)) {
    // 		return Promise.resolve(this.getDepsInPackageJson(packageJsonPath));
    // 	} else {
    // 		vscode.window.showInformationMessage('Workspace has no package.json');
    // 		return Promise.resolve([]);
    // 	}
    // }
  }

  // 	/**
  // 	 * Given the path to package.json, read all its dependencies and devDependencies.
  // 	 */
  // 	private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
  // 		if (this.pathExists(packageJsonPath)) {
  // 			const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  // 			const toDep = (moduleName: string, version: string): Dependency => {
  // 				if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
  // 					return new Dependency(
  // 						moduleName,
  // 						version,
  // 						vscode.TreeItemCollapsibleState.Collapsed
  // 					);
  // 				} else {
  // 					return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None, {
  // 						command: 'extension.openPackageOnNpm',
  // 						title: '',
  // 						arguments: [moduleName],
  // 					});
  // 				}
  // 			};

  // 			/*eslint no-mixed-spaces-and-tabs: 0*/
  // 			const deps = packageJson.dependencies
  // 				? Object.keys(packageJson.dependencies).map((dep) =>
  // 						toDep(dep, packageJson.dependencies[dep])
  // 				  )
  // 				: [];
  // 			const devDeps = packageJson.devDependencies
  // 				? Object.keys(packageJson.devDependencies).map((dep) =>
  // 						toDep(dep, packageJson.devDependencies[dep])
  // 				  )
  // 				: [];
  // 			return deps.concat(devDeps);
  // 		} else {
  // 			return [];
  // 		}
  // 	}

  // 	private pathExists(p: string): boolean {
  // 		try {
  // 			fs.accessSync(p);
  // 		} catch (err) {
  // 			return false;
  // 		}

  // 		return true;
  // 	}
}

export class Dependency extends vscode.TreeItem {
  constructor(
    public readonly label: string // private readonly version: string, // public readonly collapsibleState: vscode.TreeItemCollapsibleState, // public readonly command?: vscode.Command
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);

    this.tooltip = `${this.label}`;
    this.description = `${this.label} - Description`;
  }

  // iconPath = {
  //   light: path.join(
  //     "JoeJoe" + __filename,
  //     "..",
  //     "..",
  //     "resources",
  //     "light",
  //     "dependency.svg"
  //   ),
  //   dark: path.join(
  //     "JoeJoe" + __filename,
  //     "..",
  //     "..",
  //     "resources",
  //     "dark",
  //     "dependency.svg"
  //   ),
  // };

  contextValue = "dependency";
}
