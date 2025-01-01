import { ActionFunction } from '@remix-run/node';

export const cookieConsentAction: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const consent = formData.get('consent');
  const cookieName = formData.get('cookieName');

  return new Response(JSON.stringify({ 
    status: 'success', 
    consent, 
    cookieName 
  }), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
