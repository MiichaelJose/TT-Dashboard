import { adminAuth } from '@/lib/firebaseAdmin';

export async function verifyAuthToken(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    throw new Error('Unauthorized');
  }

  const token = authHeader.split('Bearer ')[1];
  
  if (!adminAuth) {
    throw new Error('Firebase Admin SDK is not initialized');
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return decodedToken.uid;
  } catch {
    throw new Error('Invalid or expired token');
  }
}
