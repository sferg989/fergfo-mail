import { ICloudConfig } from './types';

export interface ICloudMailService {
  moveToFolder(messageId: string, folder: string): Promise<void>;
  createFolder(folder: string): Promise<void>;
}

export class CloudMailService implements ICloudMailService {
  // eslint-disable-next-line no-use-before-define
  private static instance: CloudMailService | null = null;
  private readonly config: ICloudConfig;

  private constructor(config: ICloudConfig) {
    this.config = config;
  }

  public static getInstance(config: ICloudConfig): CloudMailService {
    if (!CloudMailService.instance) {
      CloudMailService.instance = new CloudMailService(config);
    }
    return CloudMailService.instance;
  }

  private async getImapConnection() {
    // Using native fetch for Cloudflare Workers environment
    const encoder = new TextEncoder();
    const credentials = encoder.encode(
      `${this.config.username}:${this.config.appSpecificPassword}`
    );
    const base64Credentials = btoa(String.fromCharCode(...credentials));

    return {
      headers: {
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json'
      }
    };
  }

  public async moveToFolder(messageId: string, folder: string): Promise<void> {
    const conn = await this.getImapConnection();

    // Construct the IMAP URL for the iCloud mail server
    const url = `https://${this.config.host}:${this.config.port}/move`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: conn.headers,
        body: JSON.stringify({
          messageId,
          destinationFolder: folder
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to move email: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error moving email:', error);
      throw error;
    }
  }

  public async createFolder(folder: string): Promise<void> {
    const conn = await this.getImapConnection();

    const url = `https://${this.config.host}:${this.config.port}/folders`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: conn.headers,
        body: JSON.stringify({
          folderName: folder
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create folder: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating folder:', error);
      throw error;
    }
  }
}
