import { z } from 'zod';

export const DesignSnapshotV1 = z.object({
  schemaVersion: z.literal(1).default(1),
  id: z.string().min(1),
  designId: z.string().min(1),
  parentId: z.string().nullable(),
  type: z.enum(['initial', 'edit', 'fork']),
  prompt: z.string().nullable(),
  artifactType: z.enum(['html', 'react', 'svg']),
  artifactSource: z.string(),
  createdAt: z.string(),
  message: z.string().optional(),
});
export type DesignSnapshot = z.infer<typeof DesignSnapshotV1>;

export const DesignV1 = z.object({
  schemaVersion: z.literal(1).default(1),
  id: z.string().min(1),
  name: z.string().default('Untitled design'),
  createdAt: z.string(),
  updatedAt: z.string(),
  thumbnailText: z.string().nullable().default(null),
  deletedAt: z.string().nullable().default(null),
});
export type Design = z.infer<typeof DesignV1>;

export const DesignMessageV1 = z.object({
  schemaVersion: z.literal(1).default(1),
  designId: z.string().min(1),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  ordinal: z.number().int().nonnegative(),
  createdAt: z.string(),
});
export type DesignMessage = z.infer<typeof DesignMessageV1>;

export const ChatMessageKind = z.enum([
  'user',
  'assistant_text',
  'tool_call',
  'artifact_delivered',
  'error',
]);
export type ChatMessageKind = z.infer<typeof ChatMessageKind>;

/**
 * Row from the chat_messages table. `payload` is a JSON string on disk; the
 * typed variants are parsed at the IPC boundary. Schema must anticipate
 * Phase 2 tool events (tool_call with verbGroup) even though Phase 1 only
 * emits user / assistant_text / artifact_delivered.
 */
export const ChatMessageRowV1 = z.object({
  schemaVersion: z.literal(1).default(1),
  id: z.number().int(),
  designId: z.string().min(1),
  seq: z.number().int().nonnegative(),
  kind: ChatMessageKind,
  payload: z.unknown(),
  snapshotId: z.string().nullable(),
  createdAt: z.string(),
});
export type ChatMessageRow = z.infer<typeof ChatMessageRowV1>;

export interface ChatAppendInput {
  designId: string;
  kind: ChatMessageKind;
  payload: unknown;
  snapshotId?: string | null;
}

// Payload shapes (not strictly validated — payload is opaque JSON in DB).
export interface ChatUserPayload {
  text: string;
  attachedSkills?: string[];
}
export interface ChatAssistantTextPayload {
  text: string;
}
export interface ChatArtifactDeliveredPayload {
  filename?: string;
  createdAt: string;
}
export interface ChatErrorPayload {
  message: string;
  code?: string;
}
export interface ChatToolCallPayload {
  toolName: string;
  command?: string;
  args: Record<string, unknown>;
  status: 'running' | 'done' | 'error';
  result?: unknown;
  error?: { message: string; code?: string };
  startedAt: string;
  durationMs?: number;
  verbGroup: string;
}

export interface SnapshotCreateInput {
  designId: string;
  parentId: string | null;
  type: 'initial' | 'edit' | 'fork';
  prompt: string | null;
  artifactType: 'html' | 'react' | 'svg';
  artifactSource: string;
  message?: string;
}
