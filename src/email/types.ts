export interface EmailMessage {
  from: string;
  content: string;
  subject: string;
  messageId?: string;
  date?: string;
}

export type FilterRule = {
  domains: string[];
  keywords: string[];
  destinationFolder: string;
};

export interface ICloudConfig {
  username: string;
  appSpecificPassword: string;
  host: string;
  port: number;
}
export interface Env {
  ICLOUD_USERNAME: string;
  ICLOUD_APP_PASSWORD: string;
  ICLOUD_HOST?: string;
  ICLOUD_PORT?: string;
}
