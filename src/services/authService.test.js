
import { describe, it, expect, vi, beforeEach } from 'vitest';

const firebaseMocks = vi.hoisted(() => ({
  createUserWithEmailAndPassword: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  auth: {},
  googleProvider: { provider: 'google' },
}));

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword:
    firebaseMocks.createUserWithEmailAndPassword,
  signInWithEmailAndPassword:
    firebaseMocks.signInWithEmailAndPassword,
  signInWithPopup: firebaseMocks.signInWithPopup,
  signOut: firebaseMocks.signOut,
  GoogleAuthProvider: class {
    constructor() {
      return firebaseMocks.googleProvider;
    }
  },
}));

vi.mock('./firebase', () => ({
  auth: firebaseMocks.auth,
}));

import {
  registerUser,
  loginUser,
  loginWithGoogle,
  logoutUser,
} from './authService';

describe('Authentication Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers a user with email and password', async () => {
    const result = { user: { email: 'staff@example.com' } };

    firebaseMocks.createUserWithEmailAndPassword.mockResolvedValue(result);

    const response = await registerUser('staff@example.com', 'password123');

    expect(firebaseMocks.createUserWithEmailAndPassword).toHaveBeenCalledWith(
      firebaseMocks.auth,
      'staff@example.com',
      'password123'
    );

    expect(response).toBe(result);
  });

  it('logs in a user with email and password', async () => {
    const result = { user: { email: 'staff@example.com' } };

    firebaseMocks.signInWithEmailAndPassword.mockResolvedValue(result);

    const response = await loginUser('staff@example.com', 'password123');

    expect(firebaseMocks.signInWithEmailAndPassword).toHaveBeenCalledWith(
      firebaseMocks.auth,
      'staff@example.com',
      'password123'
    );

    expect(response).toBe(result);
  });

  it('signs in a user with Google', async () => {
    const result = { user: { email: 'google@example.com' } };

    firebaseMocks.signInWithPopup.mockResolvedValue(result);

    const response = await loginWithGoogle();

    expect(firebaseMocks.signInWithPopup).toHaveBeenCalledWith(
      firebaseMocks.auth,
      firebaseMocks.googleProvider
    );

    expect(response).toBe(result);
  });

  it('logs out the current user', async () => {
    firebaseMocks.signOut.mockResolvedValue(undefined);

    await logoutUser();

    expect(firebaseMocks.signOut).toHaveBeenCalledWith(firebaseMocks.auth);
  });
});
