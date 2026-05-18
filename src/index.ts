interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  meter?: { credits: number };
  cost?: Record<string, unknown>;
  provider?: string;
}

/**
 * SIMBAD MCP — CDS astronomical object database.
 *
 * Auth: none. Docs: https://simbad.cds.unistra.fr/simbad/sim-help
 */


const BASE = 'https://simbad.cds.unistra.fr/simbad';
const TAP = 'https://simbad.cds.unistra.fr/simbad/sim-tap/sync';
const UA = 'pipeworx-mcp-simbad/1.0 (+https://pipeworx.io)';

const tools: McpToolExport['tools'] = [
  {
    name: 'object',
    description: 'Resolve and fetch the basic record for an object identifier (e.g. "M31", "HD 209458").',
    inputSchema: {
      type: 'object',
      properties: { identifier: { type: 'string' } },
      required: ['identifier'],
    },
  },
  {
    name: 'script',
    description: 'Run a SIMBAD sim-script. See https://simbad.cds.unistra.fr/simbad/sim-fscript.',
    inputSchema: {
      type: 'object',
      properties: { script: { type: 'string' } },
      required: ['script'],
    },
  },
  {
    name: 'tap',
    description: 'ADQL TAP query against the SIMBAD database (sync). Returns JSON by default.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'ADQL, e.g. "SELECT TOP 5 main_id FROM basic WHERE otype = \'G\'"' },
        format: { type: 'string', description: 'json (default) | votable | csv | tsv' },
      },
      required: ['query'],
    },
  },
  {
    name: 'cone_search',
    description: 'Objects within a radius of (RA, Dec) decimal degrees.',
    inputSchema: {
      type: 'object',
      properties: {
        ra: { type: 'number' },
        dec: { type: 'number' },
        radius_deg: { type: 'number' },
        max: { type: 'number', description: 'Top-N rows to return (default 100).' },
      },
      required: ['ra', 'dec', 'radius_deg'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'object': {
      const id = reqStr(args, 'identifier', '"M31"');
      return runScript(`format object "%MAIN_ID|%COO(d;A);%COO(d;D)|%OTYPE|%PLX(V)|%FLUXLIST"\nresult full\nquery id ${id}`);
    }
    case 'script':
      return runScript(reqStr(args, 'script', '"format object \\"%MAIN_ID\\"\\nquery id M31"'));
    case 'tap': {
      const q = reqStr(args, 'query', '"SELECT TOP 1 main_id FROM basic"');
      const fmt = String(args.format ?? 'json');
      const params = new URLSearchParams({ REQUEST: 'doQuery', LANG: 'ADQL', FORMAT: fmt, QUERY: q });
      const res = await fetch(`${TAP}?${params}`, { headers: { Accept: 'application/json', 'User-Agent': UA } });
      if (!res.ok) throw new Error(`SIMBAD TAP: ${res.status} ${await res.text().then((t) => t.slice(0, 200))}`);
      const text = await res.text();
      try { return JSON.parse(text); } catch { return { format: fmt, body: text }; }
    }
    case 'cone_search': {
      const ra = args.ra as number;
      const dec = args.dec as number;
      const r = args.radius_deg as number;
      const max = Math.max(1, Math.min(10000, (args.max as number) ?? 100));
      if (typeof ra !== 'number' || typeof dec !== 'number' || typeof r !== 'number') {
        throw new Error('cone_search requires ra, dec, radius_deg.');
      }
      const adql = `SELECT TOP ${max} main_id, ra, dec, otype FROM basic WHERE 1=CONTAINS(POINT('ICRS', ra, dec), CIRCLE('ICRS', ${ra}, ${dec}, ${r}))`;
      return callTool('tap', { query: adql });
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function runScript(script: string): Promise<unknown> {
  const params = new URLSearchParams({ submit: 'submit script', script });
  const res = await fetch(`${BASE}/sim-script?${params}`, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`SIMBAD: ${res.status}`);
  return { format: 'text', body: await res.text() };
}

function reqStr(args: Record<string, unknown>, key: string, example: string): string {
  const v = args[key];
  if (typeof v !== 'string' || !v.trim()) throw new Error(`Required argument "${key}" is missing. Pass a string like ${example}.`);
  return v;
}

export default { tools, callTool, meter: { credits: 1 } } satisfies McpToolExport;
