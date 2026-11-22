
import { act, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AuthProvider, useAuth } from './AuthContext';
import { onAuthStateChanged } from 'firebase/auth';

vi.mock('firebase/auth', () => ({
  onAuthStateChanged: vi.fn(),
}));

vi.mock('../services/firebase', () => ({
  auth: {},
}));

function AuthConsumer() {
  const { currentUser, authLoading } = useAuth();

  return (
    <div>
      <p>{authLoading ? 'Loading authentication...' : 'Authentication ready'}</p>
      <p>{currentUser ? currentUser.email : 'No user signed in'}</p>
    </div>
  );
}

describe('AuthContext', () => {
  let authCallback;
  let unsubscribe;

  beforeEach(() => {
    vi.clearAllMocks();

    unsubscribe = vi.fn();

    onAuthStateChanged.mockImplementation((auth, callback) => {
      authCallback = callback;
      return unsubscribe;
    });
  });

  it('initially displays the authentication loading state', () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    expect(screen.getByText('Loading authentication...')).toBeInTheDocument();
    expect(screen.getByText('No user signed in')).toBeInTheDocument();
  });

  it('updates the context when a user signs in', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    const user = { email: 'staff@example.com' };

    act(() => {
      authCallback(user);
    });

    expect(
      await screen.findByText('Authentication ready')
    ).toBeInTheDocument();

    expect(screen.getByText('staff@example.com')).toBeInTheDocument();
  });

  it('sets the user to null when nobody is signed in', async () => {
    render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    act(() => {
      authCallback(null);
    });

    await waitFor(() => {
      expect(screen.getByText('Authentication ready')).toBeInTheDocument();
    });

    expect(screen.getByText('No user signed in')).toBeInTheDocument();
  });

  it('unsubscribes from the authentication listener when unmounted', () => {
    const { unmount } = render(
      <AuthProvider>
        <AuthConsumer />
      </AuthProvider>
    );

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });
});
