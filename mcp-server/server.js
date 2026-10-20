const readline = require('node:readline');
const fs = require('node:fs');
const path = require('node:path');

// Loaded once at startup; __dirname makes the path work from any folder.
const lectures = JSON.parse(fs.readFileSync(path.join(__dirname, 'lectures.json'), 'utf8'));

// Descriptions are what the model reads when deciding which tool to call.
const tools = [
  {
    name: 'find_lecture',
    description: 'Return the title and topics of one course lecture by its number, 1 to 10. Use it when asked what a specific lecture covers.',
    inputSchema: {
      type: 'object',
      properties: {
        number: { type: 'integer', description: 'Lecture number, 1 to 10' },
      },
      required: ['number'],
    },
  },
  {
    name: 'search_lectures',
    description: 'Find course lectures whose title or topics contain a keyword, case-insensitive. Use it when asked which lecture covers a subject. Returns the number and title of each match.',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: { type: 'string', description: 'Word or phrase to search for, for example "security"' },
      },
      required: ['keyword'],
    },
  },
];

function send(reply) {
  process.stdout.write(JSON.stringify(reply) + '\n');
}

// Wraps tool output in the MCP result shape: a list of content parts plus an error flag.
function textResult(id, text, isError) {
  return {
    jsonrpc: '2.0',
    id,
    result: { content: [{ type: 'text', text }], isError },
  };
}

// Protocol-level failure: the request itself could not be handled.
function errorReply(id, code, message) {
  return { jsonrpc: '2.0', id, error: { code, message } };
}

function findLecture(id, args) {
  const lecture = lectures.find((l) => l.number === args.number);

  if (!lecture) {
    return textResult(id, `There is no lecture ${args.number}. The course has lectures 1 to ${lectures.length}.`, true);
  }

  return textResult(id, `Lecture ${lecture.number}: ${lecture.title}. Topics: ${lecture.topics}`, false);
}

function searchLectures(id, args) {
  if (typeof args.keyword !== 'string' || args.keyword.trim() === '') {
    return textResult(id, 'Provide a non-empty keyword to search for.', true);
  }

  const keyword = args.keyword.toLowerCase();
  const matches = lectures.filter((l) =>
    `${l.title} ${l.topics}`.toLowerCase().includes(keyword)
  );

  if (matches.length === 0) {
    return textResult(id, `No lectures mention "${args.keyword}".`, false);
  }

  const text = matches.map((l) => `${l.number}. ${l.title}`).join('\n');
  return textResult(id, text, false);
}

function handle(msg) {
  if (msg.method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id: msg.id,
      result: {
        protocolVersion: msg.params.protocolVersion,
        capabilities: { tools: {} },
        serverInfo: { name: 'lectures', version: '0.1.0' },
      },
    };
  }

  // Notifications have no id and get no reply.
  if (msg.method === 'notifications/initialized') {
    return null;
  }

  if (msg.method === 'tools/list') {
    return { jsonrpc: '2.0', id: msg.id, result: { tools } };
  }

  if (msg.method === 'tools/call') {
    const name = msg.params.name;
    const args = msg.params.arguments || {};

    if (name === 'find_lecture') return findLecture(msg.id, args);
    if (name === 'search_lectures') return searchLectures(msg.id, args);

    return errorReply(msg.id, -32602, `Unknown tool: ${name}`);
  }

  // Any other request (has an id) is an unknown method.
  if (msg.id !== undefined) {
    return errorReply(msg.id, -32601, `Unknown method: ${msg.method}`);
  }

  return null;
}

const lines = readline.createInterface({ input: process.stdin });

// stdout is reserved for protocol messages, so logs go to stderr.
lines.on('line', (line) => {
  console.error('got: ' + line);

  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    send(errorReply(null, -32700, 'Parse error'));
    return;
  }

  const reply = handle(msg);
  if (reply) send(reply);
});