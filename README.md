# @pipeworx/simbad

[SIMBAD](https://simbad.cds.unistra.fr) MCP — CDS Strasbourg astronomical database of objects beyond the Solar System (~14M objects). Keyless TAP+sim-script interface.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

- `object(identifier)` — resolve and fetch the basic record for an object name
- `script(script)` — run a SIMBAD sim-script (advanced)
- `tap(query, format?)` — ADQL TAP query against the SIMBAD database
- `cone_search(ra, dec, radius_deg)` — objects in a cone

## Data source

`https://simbad.cds.unistra.fr` — sim-script + TAP/ADQL.

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

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

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

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
