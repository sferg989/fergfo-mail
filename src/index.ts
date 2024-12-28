/// <reference types="@cloudflare/workers-types" />
import { handleIncomingEmail } from './handlers/emailHandler';
export * from './email/EmailFilter';
export * from './handlers/emailHandler';
import type { Env } from './email/types';

export default {
  async email(message: ForwardableEmailMessage, env: Env, _ctx: ExecutionContext): Promise<void> {
    // Convert the email message to our expected format
    const emailData = {
      messageId: message.headers.get('Message-ID') || '',
      from: message.from.split('<')[1]?.split('>')[0] || message.from,
      subject: message.headers.get('Subject') || '',
      content: message.raw.toString(),
      date: message.headers.get('Date') || ''
    };

    // Process the email using our handler
    await handleIncomingEmail(new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData)
    }), env);
  }
};
