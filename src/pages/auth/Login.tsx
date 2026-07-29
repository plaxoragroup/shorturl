import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import './Auth.css';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const syncUser = async (user: any) => {
    const { ref, get, update, set } = await import('firebase/database');
    const { rtdb } = await import('../../lib/firebase');
    const userRef = ref(rtdb, `users/${user.uid}`);
    
    try {
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        // Update last login
        await update(userRef, { lastLogin: new Date().toISOString() });
      } else {
        // Create new user (e.g. from Google Auth first time)
        await set(userRef, {
          email: user.email,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Failed to sync user:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await syncUser(userCredential.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      await syncUser(userCredential.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <Card className="auth-card">
          <h2 className="auth-title">Welcome back</h2>
          <p className="auth-subtitle">Log in to manage your links</p>
          
          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleLogin} className="auth-form">
            <Input 
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input 
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" fullWidth className="mt-4" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="auth-divider">or</div>

          <Button variant="secondary" fullWidth onClick={handleGoogleLogin} disabled={loading}>
            Sign In with Google
          </Button>

          <div className="auth-footer">
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
