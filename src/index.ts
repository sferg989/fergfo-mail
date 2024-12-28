/// <reference types="@cloudflare/workers-types" />
import { handleIncomingEmail } from './handlers/emailHandler';
export * from './email/EmailFilter';
export * from './handlers/emailHandler';
import type { Env } from './email/types';

export default {
  async fetch(_request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    return new Response('Email Filter Worker Running', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  },

  async email(message: ForwardableEmailMessage, env: Env, _ctx: ExecutionContext): Promise<void> {
    // Convert the email message to our expected format
    const emailData = {
      messageId: message.headers.get('Message-ID') || '',
      from: message.from.split('<')[1]?.split('>')[0] || message.from,
      subject: message.headers.get('Subject') || '',
      content: message.raw.toString(),
      date: message.headers.get('Date') || ''
    };

    // Process the email directly
    await handleIncomingEmail(emailData, env);
  }
};
