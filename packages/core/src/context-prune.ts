/**
 * Per-message size-based context compaction for pi-agent-core's
 * `transformContext` hook. Runs before every LLM call.
 *
 * Philosophy: **history is intent tracking, not payload storage.**
 *
 * What the model needs from prior turns is the DECISION trail — which tools
 * it called, in what order, with what shape. What it does NOT need is its own
 * verbatim 9 MB artifact dump, or the full view() return of a 100 KB file it
 * already touched. Current state is always recoverable via view(), so there
 * is no information loss from stubbing prior payloads.
 *
 * v1 (window-based) failed in production because the 9 MB payload was the
 * LATEST assistant text block (the model streaming out the final artifact as
 * prose right before `done`). It sat inside the "keep verbatim" window, and
 * the request still shipped 3.97 M tokens.
 *
 * v3 (this file) drops the window entirely. Every message is inspected per
 * block; any block whose serialized size exceeds its per-type cap is stubbed.
 * Caps are small on purpose — 8 KB fits any reasonable paragraph of reasoning
 * or normal tool argument, but cannot carry an HTML/JSX artifact, a base64
 * image, or a whole-file view return. The model's most recent decision is
 * still visible at full fidelity for small outputs.
 *
 * Three block-level caps:
 *   - `assistant.content[*].text` — model prose / streamed artifact text.
 *   - `assistant.content[*].toolCall.input` — args the model sent to a tool.
 *   - `toolResult.content[*].text` — host-side tool return payload.
 *
 * Stub format carries bytes + a short preview so the model can tell what
 * got dropped, and (for tool calls) keeps tool NAME + id so pi-ai's shape
 * validation remains happy.
 *
 * Safety net: after per-block stubbing, if the grand total still exceeds
 * `HARD_CAP_BYTES`, we shrink caps further and re-run. Catches pathological
 * runs with many just-under-threshold blocks.
 */

import type { AgentMessage } from '@mariozechner/pi-agent-core';
import { type CoreLogger, NOOP_LOGGER } from './logger.js';

const TEXT_BLOCK_LIMIT = 8 * 1024;
const TOOL_INPUT_LIMIT = 8 * 1024;
const TOOL_RESULT_LIMIT = 8 * 1024;
const HARD_CAP_BYTES = 200_000;
const AGGRESSIVE_BLOCK_LIMIT = 2 * 1024;

function estimateBytes(messages: AgentMessage[]): number {
  let total = 0;
  for (const m of messages) {
    try {
      total += JSON.stringify(m).length;
    } catch {
      /* circular or unserializable — ignore */
    }
  }
  return total;
}

function preview(text: string): string {
  const firstLine = text.split('\n')[0] ?? '';
  return firstLine.slice(0, 80);
}

function stubText(text: string, label: string): string {
  return `[${label} — ${text.length}B, head: "${preview(text)}"]`;
}

function compactAssistant(m: AgentMessage, textLimit: number, toolLimit: number): AgentMessage {
  const original = m as unknown as {
    role: 'assistant';
    content?: Array<Record<string, unknown>>;
  };
  if (!Array.isArray(original.content)) return m;
  let changed = false;
  const nextContent = original.content.map((block) => {
    const type = block?.['type'];
    if (type === 'text') {
      const text = typeof block['text'] === 'string' ? (block['text'] as string) : '';
      if (text.length <= textLimit) return block;
      changed = true;
      return { ...block, text: stubText(text, 'prior assistant output dropped') };
    }
    if (type === 'toolCall') {
      const input = block['input'];
      let origBytes = 0;
      let preview = '';
      try {
        const serialized = JSON.stringify(input ?? null);
        origBytes = serialized.length;
        preview = serialized.slice(0, 80);
      } catch {
        /* ignore */
      }
      if (origBytes <= toolLimit) return block;
      changed = true;
      return {
        ...block,
        input: { _summarized: true, _origBytes: origBytes, _preview: preview },
      };
    }
    return block;
  });
  if (!changed) return m;
  return { ...(original as object), content: nextContent } as unknown as AgentMessage;
}

function compactToolResult(m: AgentMessage, limit: number): AgentMessage {
  const original = m as unknown as {
    role: 'toolResult';
    content?: Array<{ type: string; text?: string }>;
  };
  if (!Array.isArray(original.content)) return m;
  let changed = false;
  const nextContent = original.content.map((block) => {
    if (block?.type !== 'text') return block;
    const text = typeof block.text === 'string' ? block.text : '';
    if (text.length <= limit) return block;
    changed = true;
    return { ...block, text: stubText(text, 'tool result dropped — use view() for current state') };
  });
  if (!changed) return m;
  return { ...(original as object), content: nextContent } as unknown as AgentMessage;
}

function applyCaps(
  messages: AgentMessage[],
  textLimit: number,
  toolInputLimit: number,
  toolResultLimit: number,
): AgentMessage[] {
  return messages.map((m) => {
    if (m.role === 'assistant') return compactAssistant(m, textLimit, toolInputLimit);
    if (m.role === 'toolResult') return compactToolResult(m, toolResultLimit);
    return m;
  });
}

export function buildTransformContext(
  log: CoreLogger = NOOP_LOGGER,
): (messages: AgentMessage[], signal?: AbortSignal) => Promise<AgentMessage[]> {
  return async (messages) => {
    if (messages.length === 0) return messages;

    const before = estimateBytes(messages);
    const first = applyCaps(messages, TEXT_BLOCK_LIMIT, TOOL_INPUT_LIMIT, TOOL_RESULT_LIMIT);
    const firstSize = estimateBytes(first);

    log.info('[context-prune] step=caps', {
      messages: messages.length,
      before,
      after: firstSize,
      textLimit: TEXT_BLOCK_LIMIT,
      toolLimit: TOOL_INPUT_LIMIT,
    });

    if (firstSize <= HARD_CAP_BYTES) return first;

    const aggressive = applyCaps(
      messages,
      AGGRESSIVE_BLOCK_LIMIT,
      AGGRESSIVE_BLOCK_LIMIT,
      AGGRESSIVE_BLOCK_LIMIT,
    );
    const aggressiveSize = estimateBytes(aggressive);
    log.info('[context-prune] step=aggressive', {
      messages: messages.length,
      before,
      first: firstSize,
      after: aggressiveSize,
      blockLimit: AGGRESSIVE_BLOCK_LIMIT,
    });
    return aggressive;
  };
}
