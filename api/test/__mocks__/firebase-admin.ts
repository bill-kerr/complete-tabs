class FirebaseError extends Error {
  constructor(public code: string) {
    super();
  }
}

async function verifyIdToken(token: string) {
  if (token === 'fail:invalid') {
    throw new FirebaseError('auth/invalid-id-token');
  } else if (token === 'fail:expired') {
    throw new FirebaseError('auth/id-token-expired');
  }
  return {
    uid: token,
    email: 'test@test.com',
    organizationId: '',
  };
}

async function createUser(properties: { uid?: string; email?: string; password?: string }) {
  return {
    id: properties.uid || 'test-id',
    email: properties.email || 'test@test.com',
  };
}

async function setCustomUserClaims(_uid: string, _customUserClaims: object | null) {
  return;
}

export default {
  auth: () => ({
    verifyIdToken,
    createUser,
    setCustomUserClaims,
  }),
};
