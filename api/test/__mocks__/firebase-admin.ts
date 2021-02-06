class FirebaseError extends Error {
  constructor(public code: string) {
    super();
  }
}

async function verifyIdToken(token: string) {
  const { user } = parseToken(token);

  switch (token) {
    case 'fail:invalid':
      throw new FirebaseError('auth/invalid-id-token');
    case 'fail:expired':
      throw new FirebaseError('auth/id-token-expired');
    default:
      return {
        uid: user,
        email: 'test@test.com',
      };
  }
}

function parseToken(token: string) {
  return {
    user: findInString(token, 'user:') || 'test-id',
  };
}

function findInString(text: string, searchString: string) {
  const index = text.search(searchString);
  return index > -1 ? sliceString(index + searchString.length, text) : null;
}

function sliceString(startIndex: number, text: string) {
  const length = findEnd(text.slice(startIndex));
  return text.slice(startIndex, startIndex + length);
}

function findEnd(text: string) {
  const spaceIdx = text.search(' ');
  return spaceIdx === -1 ? text.length : spaceIdx;
}

async function createUser(properties: { uid?: string; email?: string; password?: string }) {
  return {
    id: properties.uid || 'test-id',
    email: properties.email || 'test@test.com',
  };
}

export default {
  auth: () => ({
    verifyIdToken,
    createUser,
  }),
};
