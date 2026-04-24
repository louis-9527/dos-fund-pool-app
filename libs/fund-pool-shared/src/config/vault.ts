import * as Vault from 'node-vault';

/**
 * Loads secrets from HashiCorp Vault KV v2 and merges them into process.env.
 *
 * Required env vars (set before this runs, e.g. via .env):
 *   VAULT_ADDR        - Vault server address, e.g. https://vault.example.com
 *   VAULT_TOKEN       - Vault token with read access to the secret path
 *   VAULT_SECRET_PATH - Full KV v2 path including "data/", e.g. secret/data/dosGameFundPool/qat
 */
export async function loadVaultSecrets(): Promise<void> {
  const { VAULT_ADDR, VAULT_TOKEN, VAULT_SECRET_PATH } = process.env;

  if (!VAULT_ADDR || !VAULT_TOKEN || !VAULT_SECRET_PATH) {
    throw new Error(
      'Missing required Vault config: VAULT_ADDR, VAULT_TOKEN, and VAULT_SECRET_PATH must all be set',
    );
  }

  const vaultClient = Vault({
    apiVersion: 'v1',
    endpoint: VAULT_ADDR,
    token: VAULT_TOKEN,
  });

  // KV v2 response: { data: { data: { KEY: "value", ... }, metadata: {...} } }
  const result = await vaultClient.read(VAULT_SECRET_PATH);
  const secrets: Record<string, string> = result.data.data;

  for (const [key, value] of Object.entries(secrets)) {
    process.env[key] = String(value);
  }

  console.log(
    `[Vault] Loaded ${Object.keys(secrets).length} secrets from "${VAULT_SECRET_PATH}"`,
  );
}
