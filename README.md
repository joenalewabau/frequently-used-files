# Frequently Used Files 

This VS Code extension provides the ability to open groups of files with one click.  

It's common for developers to be working on a large code base with many logical sections, for example:

- Transaction processing
- Configuration
- Help files  
- Message formatting 
- Cloud Functions 
- ...

 This extension allows you to define a set of logical file groups so you can easily open up files when working on a logical section of you app/service. 
 
## Details 

A config file called `fufconfig.json` is required at the root of your project for this extension to work.

This file has the following format:

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
        "templates\\prod\\config.json",
        "templates\\dev\\config.json",
        "templates\\staging\\config.json"
      ]
    }
  ]
}
```

Note that the path to files is a simple string. The path is assumed to be relative to the project and will needed to be escaped.

Once loaded a new windows is available inside VS Code ("Frequent Files") that lists these groups and allows you to:
- Open a specific file, or 
- Open all files in a group 

You can make changes to `fufconfig.json` and then refresh the Frequently Use Files window to see the new files.    

## Extension Settings
None at this time.

## Known Issues

Upcoming features to be added:
- Add open file(s) to groups via extension UI
- Remove a file from a group via extension UI
- Add/remove groups via extension UI      

## Release Notes

Initial release to the world.

### 0.0.1

Hello World!

