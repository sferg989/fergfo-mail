export interface EmailMessage {
  from: string;
  content: string;
  subject: string;
}

export type FilterRule = {
  domains: string[];
  keywords: string[];
  destinationFolder: string;
};
