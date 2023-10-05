# Frequently Used Files

If you work in large code bases with many subsystems, tracking critical files in the project can be challenging. You'll typically have some essential entry-point files in each subsystem, but how do you remember which ones?

This extension lets you easily remember groups of "frequently used files" inside your code. You can create a group and then files to it that you want to remember.

You can create a group per subsystem, per platform, or common files across subsystems - it's up to you.

The extension stores groups and file information in a file called fufconfig.json, which lives at the root of your project. See below for more details.

## UI

Access the extension via the bookmark icon in the main Tree View container.

![Frequently Used Files VS code UI](/media/extension-tree-view.png?raw=true)

From the extension window, you can maintain groups and:

- Create a group,
- Rename a group,
- Delete a group,
- Open all the files associated with that group.

To add a file to a group:

- Open it in the editor,
- Right-click on the files editor tab,
- Select the option to add a frequently used file, and
- Choose the group you want to add the file to

Once a file has been added to a group, you can open it directly or delete it from the group.

## Configuration details

An example file looks like this:

```
{
  "groups": [
    {
      "name": "Group1",
      "files": [
        "file1.ts",
        "file2.json"
      ]
    },
    {
      "name": "Group 2",
      "files": [
        "templates/prod/config.json",
        "templates/dev/config.json",
        "templates/staging/config.json"
      ]
    }
  ]
}
```

You can edit this file directly and reload it from the extension UI.

Note that the path to files is a simple string. The path is assumed to be relative to the project and will needed to be escaped.

## Extension Settings

None at this time.

## Known Issues

Upcoming features to be added:

- File watch on fufconfig.json to dynamically load UI based on file changes.

## Release Notes

Initial release to the world.

### 0.0.1 - Hello World!
