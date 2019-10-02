# Debug configuration

Debug configuration is more complex than the bare default. Beware of the following obstacles:
- ts-node must be registered
- tsconfig paths must be included
- `TS_NODE_FILES` must be enabled to use the declarations file
- Optionally don't forget to set the `CFG_JSON_PATH`

## VS Code

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "Debug TypeScript in Node.js",
            // register ts-node and tsconfig paths
            "runtimeArgs": ["-r", "ts-node/register", "-r", "tsconfig-paths/register"],
            "args": ["${workspaceFolder}/src/index.ts"],
            "cwd": "${workspaceFolder}",
            "protocol": "inspector",
            "env": {
                // env variables
                "CFG_JSON_PATH": "path/to/local/.env",
                // load files from tsconfig to allow declerations
                "TS_NODE_FILES": "true"
            }
        }
    ]
}
```