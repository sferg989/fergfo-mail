import Imap from 'imap';

export interface FilterRule {
  domains: string[];
  keywords: string[];
  destinationFolder: string;
}

export function createImapClient(
  user: string,
  password: string
): Imap {
  return new Imap({
    user,
    password,
    host: 'imap.mail.me.com',
    port: 993,
    tls: true,
    authTimeout: 3000,
    tlsOptions: { servername: 'imap.mail.me.com' }
  });
}

export function openInbox(imap: Imap, cb: (err: Error | null, box?: any) => void): void {
  imap.openBox('INBOX', false, cb);
}
