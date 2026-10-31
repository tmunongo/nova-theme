---
title: "Building Agent-Native Tools with Model Context Protocol"
description: "How to expose transactional backend services to autonomous AI agents using typed JSON-RPC contracts and predictable schema definitions."
date: 2025-06-22
tags: ["ai", "mcp", "typescript", "architecture"]
series: ["Agentic Systems"]
draft: false
readTime: true
recommended: false
fediverse: "author@example.social"
---

As autonomous agents become primary consumers of developer infrastructure, designing machine-first APIs requires a shift in ergonomics. Human web APIs often rely on fuzzy documentation and tolerance for partial data; agent tools demand deterministic schemas and structured error payloads.

## The Model Context Protocol (MCP) Primitive

The Model Context Protocol standardizes how language models interact with external capabilities over stdio or SSE connections.

```json
{
  "name": "lookup_customer_order",
  "description": "Retrieves the latest order status and tracking metadata for a given customer ID.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "customerId": { "type": "string", "description": "Customer UUID" },
      "includeFulfillments": { "type": "boolean", "default": true }
    },
    "required": ["customerId"]
  }
}
```

## Handling Tool Recoveries

When an agent encounters an error, returning human prose often causes hallucinations. Structured error responses allow the model to adjust its parameters autonomously:

```typescript
export async function executeTool(name: string, args: Record<string, unknown>) {
  try {
    const result = await handleToolCall(name, args);
    return { content: [{ type: "text", text: JSON.stringify(result) }] };
  } catch (err) {
    return {
      isError: true,
      content: [{
        type: "text",
        text: JSON.stringify({
          errorCode: "INVALID_CUSTOMER_ID",
          message: "Customer ID must be a valid v4 UUID.",
          suggestion: "Query search_customers first to retrieve matching records."
        })
      }]
    };
  }
}
```

Predictable contracts produce dependable agent workflows.
