import { EmailFilterService } from '../email/EmailFilter';
import { EmailMessage } from '../email/types';

async function moveEmailToFolder(emailData: EmailMessage, folder: string): Promise<void> {
  // Implement iCloud API calls here
}

export async function handleIncomingEmail(req: Request): Promise<Response> {
  try {
    const emailData = await req.json();
    const filterService = EmailFilterService.getInstance();

    const destinationFolder = filterService.filterEmail({
      from: emailData.from,
      content: emailData.content,
      subject: emailData.subject
    });

    await moveEmailToFolder(emailData, destinationFolder);

    return new Response(JSON.stringify({
      success: true,
      destination: destinationFolder
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: (error as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
