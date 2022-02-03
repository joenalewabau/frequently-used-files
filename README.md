# frequently-used-files README

## Features

This extension provides the ability to open groups of files with one click.  

It's common for developers to be working on a large code base with many logical sections, for example:

- Transaction processing
- Configuration
- Help files  
- Message formatting 
- Cloud Functions 
- ...

 This extension allows you to define a set of logical file groups so you can easily open up files when working on a logical section of you app/service. 
 
## Requirements

A config file is fufconfig.json is required at the root of your project with 
the following format:

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
      "name": "templates",
      "files": [
        "templates\\prod\\config.json",
        "templates\\dev\\config.json",
        "templates\\staging\\config.json"
      ]
    }
  ]
}
```

Note that the file path is a simple string so you may need to escape any 
path delimiters. 
## Extension Settings


## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1

Initial release ...

