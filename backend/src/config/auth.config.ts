import { OAuth2Client } from 'google-auth-library';

const CLIENT_ID = String(process.env.GOOGLE_CLIENT_ID);

const client = new OAuth2Client(CLIENT_ID);

export const verifyGoogleToken = async (token: string) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload() as object;
};