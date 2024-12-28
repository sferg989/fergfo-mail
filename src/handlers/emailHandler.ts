import { EmailFilterService } from '../email/EmailFilter';
import { EmailMessage } from '../email/types';
import { CloudMailService } from '../email/iCloudMailService';
import type { Env } from '../email/types';

async function moveEmailToFolder(emailData: EmailMessage, folder: string, env: Env): Promise<void> {
  const mailService = CloudMailService.getInstance({
    username: env.ICLOUD_USERNAME,
    appSpecificPassword: env.ICLOUD_APP_PASSWORD,
    host: env.ICLOUD_HOST || 'imap.mail.me.com',
    port: parseInt(env.ICLOUD_PORT || '993', 10)
  });

  await mailService.createFolder(folder);

  if (emailData.messageId) {
    await mailService.moveToFolder(emailData.messageId, folder);
  } else {
    throw new Error('Message ID is required to move email');
  }
}

export async function handleIncomingEmail(emailData: EmailMessage, env: Env): Promise<void> {
  try {
    const filterService = EmailFilterService.getInstance();

    const destinationFolder = filterService.filterEmail({
      from: emailData.from,
      content: emailData.content,
      subject: emailData.subject,
      messageId: emailData.messageId,
      date: emailData.date
    });

    await moveEmailToFolder(emailData, destinationFolder, env);

    console.log(`Successfully processed email:
      From: ${emailData.from}
      Subject: ${emailData.subject}
      Moved to: ${destinationFolder}
      Message ID: ${emailData.messageId}
    `);

  } catch (error) {
    console.error('Error handling email:', error);
    throw error;
  }
}
