import { describe, expect, it } from 'vitest';
import { parseClaudeCodeSettings } from './claude-code-config';

describe('parseClaudeCodeSettings', () => {
  it('creates a single anthropic ProviderEntry from ANTHROPIC_BASE_URL + MODEL', () => {
    const json = JSON.stringify({
      env: {
        ANTHROPIC_BASE_URL: 'https://gateway.example.com',
        ANTHROPIC_MODEL: 'claude-opus-4-1',
        ANTHROPIC_AUTH_TOKEN: 'sk-ant-test',
      },
    });
    const out = parseClaudeCodeSettings(json, { env: {} });
    expect(out.provider?.id).toBe('claude-code-imported');
    expect(out.provider?.wire).toBe('anthropic');
    expect(out.provider?.baseUrl).toBe('https://gateway.example.com');
    expect(out.provider?.defaultModel).toBe('claude-opus-4-1');
    expect(out.apiKey).toBe('sk-ant-test');
    expect(out.apiKeySource).toBe('settings-json');
    expect(out.userType).toBe('has-api-key');
  });

  it('accepts ANTHROPIC_API_KEY from settings.json as a fallback to ANTHROPIC_AUTH_TOKEN', () => {
    const json = JSON.stringify({ env: { ANTHROPIC_API_KEY: 'k' } });
    const out = parseClaudeCodeSettings(json, { env: {} });
    expect(out.apiKey).toBe('k');
    expect(out.apiKeySource).toBe('settings-json');
    expect(out.userType).toBe('has-api-key');
  });

  it('falls back to shell env ANTHROPIC_AUTH_TOKEN when settings.json has no key', () => {
    const json = JSON.stringify({ env: {} });
    const out = parseClaudeCodeSettings(json, { env: { ANTHROPIC_AUTH_TOKEN: 'shell-key' } });
    expect(out.apiKey).toBe('shell-key');
    expect(out.apiKeySource).toBe('shell-env');
    expect(out.userType).toBe('has-api-key');
  });

  it('attaches envKey: ANTHROPIC_AUTH_TOKEN on the provider for runtime fallback', () => {
    const json = JSON.stringify({ env: { ANTHROPIC_AUTH_TOKEN: 'k' } });
    const out = parseClaudeCodeSettings(json, { env: {} });
    expect(out.provider?.envKey).toBe('ANTHROPIC_AUTH_TOKEN');
  });

  it('classifies no-key + localhost baseUrl as local-proxy', () => {
    const json = JSON.stringify({ env: { ANTHROPIC_BASE_URL: 'http://localhost:8082' } });
    const out = parseClaudeCodeSettings(json, { env: {} });
    expect(out.userType).toBe('local-proxy');
    expect(out.apiKey).toBeNull();
    expect(out.provider?.baseUrl).toBe('http://localhost:8082');
  });

  it('classifies no-key + custom remote baseUrl as remote-gateway', () => {
    const json = JSON.stringify({ env: { ANTHROPIC_BASE_URL: 'https://api.custom.example.com' } });
    const out = parseClaudeCodeSettings(json, { env: {} });
    expect(out.userType).toBe('remote-gateway');
    expect(out.apiKey).toBeNull();
  });

  it('classifies no-key + OAuth evidence + default baseUrl as oauth-only and returns no provider', () => {
    const json = JSON.stringify({ env: {} });
    const out = parseClaudeCodeSettings(json, { env: {}, oauthEvidence: true });
    expect(out.userType).toBe('oauth-only');
    expect(out.provider).toBeNull();
    expect(out.hasOAuthEvidence).toBe(true);
  });

  it('classifies no-key + no OAuth evidence + default baseUrl as no-config', () => {
    const json = JSON.stringify({ env: {} });
    const out = parseClaudeCodeSettings(json, { env: {}, oauthEvidence: false });
    expect(out.userType).toBe('no-config');
    expect(out.provider).toBeNull();
  });

  it('surfaces apiKeyHelper presence as a warning without executing it', () => {
    const json = JSON.stringify({
      env: { ANTHROPIC_BASE_URL: 'http://localhost:8082' },
      apiKeyHelper: 'security find-generic-password -s anthropic -w',
    });
    const out = parseClaudeCodeSettings(json, { env: {} });
    expect(out.warnings.join(' ')).toMatch(/apiKeyHelper/);
    expect(out.apiKey).toBeNull();
  });

  it('ignores an empty ANTHROPIC_AUTH_TOKEN string and falls through to env', () => {
    const json = JSON.stringify({ env: { ANTHROPIC_AUTH_TOKEN: '   ' } });
    const out = parseClaudeCodeSettings(json, { env: { ANTHROPIC_API_KEY: 'real' } });
    expect(out.apiKey).toBe('real');
    expect(out.apiKeySource).toBe('shell-env');
  });

  it('returns a warning on non-JSON input', () => {
    const out = parseClaudeCodeSettings('{ bad json', { env: {} });
    expect(out.provider).toBeNull();
    expect(out.warnings[0]).toMatch(/not valid JSON/);
  });

  it('promotes malformed JSON with OAuth evidence to oauth-only so the banner still fires', () => {
    const out = parseClaudeCodeSettings('{ bad json', { env: {}, oauthEvidence: true });
    expect(out.userType).toBe('oauth-only');
  });
});
