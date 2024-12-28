import { EmailMessage, FilterRule } from './types';

export interface IEmailFilterService {
  filterEmail(email: EmailMessage): string;
}

class EmailFilterService implements IEmailFilterService {
  // eslint-disable-next-line no-use-before-define
  private static instance: EmailFilterService | null = null;
  private readonly filterRules: FilterRule[];

  private constructor() {
    this.filterRules = [
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
  }

  private extractDomain(emailAddress: string): string {
    return emailAddress.split('@')[1]?.toLowerCase() || '';
  }

  public static getInstance(): EmailFilterService {
    if (!EmailFilterService.instance) {
      EmailFilterService.instance = new EmailFilterService();
    }
    return EmailFilterService.instance;
  }

  public filterEmail(email: EmailMessage): string {
    const domain = this.extractDomain(email.from);
    const domainRule = this.filterRules.find(rule =>
      rule.domains.length > 0 && rule.domains.includes(domain)
    );

    if (domainRule) {
      return domainRule.destinationFolder;
    }

    const contentRule = this.filterRules.find(rule =>
      rule.keywords.length > 0 &&
      rule.keywords.some(keyword =>
        email.content.toLowerCase().includes(keyword.toLowerCase()) ||
        email.subject.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    return contentRule ? contentRule.destinationFolder : 'inbox';
  }
}

export { EmailFilterService };
