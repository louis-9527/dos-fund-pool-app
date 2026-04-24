import { Injectable, OnModuleInit } from '@nestjs/common';
import { config } from 'dotenv';
import * as NodeVault from 'node-vault';
type VaultClient = NodeVault.client;
config();

@Injectable()
export class VaultFetcher implements OnModuleInit {
  private readonly vaultClient: VaultClient;
  private readonly environment: string;
  private readonly defaultPath = 'dosGameFundPool';

  constructor() {
    const env = process.env.ENVIRONMENT;
    console.log('[VaultFetcher] env: ', env);

    const environmentMapping: Record<string, string> = {
      LOCAL: 'local',
      QAT: 'qat',
      'QAT-2': 'qat2',
      'QAT-3': 'qat3',
      UAT: 'uat',
      'UAT-2': 'uat2',
      PROD: 'prod',
    };

    this.environment = environmentMapping[env ?? ''] ?? 'prod';
    console.info('[VaultFetcher] this.environment', this.environment);

    this.vaultClient = NodeVault({
      apiVersion: 'v1',
      endpoint: process.env.VAULT_ADDR,
      token: process.env.VAULT_TOKEN,
    });
  }

  onModuleInit() {
    console.info('[VaultFetcher] has been initialized.');
  }

  async getSecret(namespace: string, key: string, suffix?: string): Promise<any> {
    const vaultPath = `${this.defaultPath}/data/${namespace}/${suffix ?? this.environment}`;
    console.info('[VaultFetcher] vaultPath', vaultPath);
    try {
      const response = await this.vaultClient.read(vaultPath);
      const data = response?.data?.data?.[key];

      if (!data && data !== '') {
        throw new Error(`[VaultFetcher] Key "${key}" not found in Vault response.`);
      }

      return data;
    } catch (error) {
      console.error(`[VaultFetcher] getSecret error vaultPath [${vaultPath}]`, error);
      throw new Error(`[VaultFetcher] Failed to fetch secret from Vault: ${error.message}`);
    }
  }
}
