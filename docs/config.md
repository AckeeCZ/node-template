# Configuration

## Using configuration

To overwrite the default config, create a valid json file from `.env.json`, rewrite the default config and set the `CFG_JSON_PATH` env variable, e.g. `CFG_JSON_PATH=~/.env/foo.json`.

You can read more in [Configuru readme](https://github.com/AckeeCZ/configuru).

## Adding new key

- To add a new key to `.env.json` (optionally to your config). Keep in mind that it is a flat structure only and keys are `UPPER_SNAKE_CASE`
- Add it to applications config definition (`src/config/config.ts`), here you can create a hierarchical structure.
- In the config definition, use a proper loader: `number`, `string`, `bool`, `json` (stringified JSON). You can add tags `nullable` and `hidden`.

```typescript
storage: {
    key: loader.json.nullable.hidden('STORAGE_KEY'),
},
```

- You can also use [custom loaders](https://github.com/AckeeCZ/configuru#custom-loaders).
