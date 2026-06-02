# mcp-simbad

SIMBAD MCP — CDS astronomical object database.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `object` | Resolve and fetch the basic record for an object identifier (e.g. "M31", "HD 209458"). |
| `script` | Run a SIMBAD sim-script. See https://simbad.cds.unistra.fr/simbad/sim-fscript. |
| `tap` | ADQL TAP query against the SIMBAD database (sync). Returns JSON by default. |
| `cone_search` | Objects within a radius of (RA, Dec) decimal degrees. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "simbad": {
      "url": "https://gateway.pipeworx.io/simbad/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Simbad data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
