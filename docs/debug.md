# Debug configuration

Here is a quick snippet to make the debug working. Mind the following:

- Register `source-map-support/register` to have mapped stack traces
- Optionally don't forget to set the `CFG_JSON_PATH`

## VS Code

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch",
      "type": "node",
      "request": "launch",
      "program": "${workspaceRoot}/dist/index.js",
      "stopOnEntry": false,
      "args": [],
      "cwd": "${workspaceRoot}",
      "preLaunchTask": "npm: build",
      "runtimeArgs": ["-r", "source-map-support/register"],
      "env": {
        "NODE_ENV": "development",
        "CFG_JSON_PATH": "path/to/local/.env"
      },
      "console": "internalConsole",
      "outputCapture": "std",
      "sourceMaps": true
    }
  ]
}
```
