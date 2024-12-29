import { createImapClient, openInbox, FilterRule } from './imapClient';
import dotenv from 'dotenv';
dotenv.config();

const imap = createImapClient(
  process.env.IMAP_USER || '',
  process.env.IMAP_PASSWORD || ''
);

const filterRules: FilterRule[] = [
  {
    domains: ['myabc.church', 'hhskiclub.com', 'amazon.com'],
    keywords: [],
    destinationFolder: 'domain-specific'
  },
  {
    domains: [],
    keywords: ['Unsubscribe', 'stop receiving e-mails', 'stop receiving these emails'],
    destinationFolder: 'unsubscribe'
  }
];

function processEmail(emailContent: string, uid: number) {
  for (const rule of filterRules) {
    const { domains, keywords, destinationFolder } = rule;

    // Check if email matches rule
    const domainMatch = domains.some((domain) => emailContent.includes(`@${domain}`));
    const keywordMatch = keywords.some((keyword) => emailContent.includes(keyword));

    if (domainMatch || keywordMatch) {
      console.log(`Moving email with UID ${uid} to folder: ${destinationFolder}`);
      imap.move(String(uid), destinationFolder, (err: any) => {
        if (err) {
          console.error(`Error moving email UID ${uid}:`, err);
        }
      });
      break;
    }
  }
}

imap.once('ready', () => {
  openInbox(imap, (err) => {
    if (err) {throw err;}

    imap.search(['UNSEEN'], (err: any, results: any) => {
      if (err) {throw err;}

      const f = imap.fetch(results, { bodies: '' });
      f.on('message', (msg: { on: (arg0: string, arg1: (stream: any) => void) => void; once: (arg0: string, arg1: { (attrs: any): void; (): void; }) => void; }, seqno: any) => {
        let emailContent = '';
        msg.on('body', (stream: { on: (arg0: string, arg1: (chunk: any) => void) => void; }) => {
          stream.on('data', (chunk: { toString: (arg0: string) => string; }) => {
            emailContent += chunk.toString('utf8');
          });
        });
        // @ts-ignore
        msg.once('attributes', (attrs: any) => {
          const uid = attrs.uid;
          msg.once('end', () => {
            processEmail(emailContent, uid);
          });
        });
      });

      f.once('end', () => {
        console.log('Finished fetching emails.');
        imap.end();
      });
    });
  });
});

imap.once('error', (err: any) => {
  console.error('IMAP error:', err);
});

imap.once('end', () => {
  console.log('Connection ended.');
});

imap.connect();
