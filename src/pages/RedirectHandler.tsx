import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const RedirectHandler: React.FC = () => {
  const { shortcode } = useParams<{ shortcode: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock Redirect Logic
    const redirect = async () => {
      try {
        if (!shortcode) throw new Error('Invalid shortcode');
        
        // Mock API call to get original URL
        console.log(`Fetching original URL for ${shortcode}...`);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (shortcode === 'test') {
          window.location.href = 'https://google.com';
        } else {
          setError('Link not found or is disabled.');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred.');
      }
    };

    redirect();
  }, [shortcode]);

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
        <a href="/" style={{ color: 'var(--color-primary)', marginTop: '24px', display: 'inline-block' }}>Go to Homepage</a>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <div className="spinner" style={{ width: '40px', height: '40px', border: '4px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
      <p style={{ marginTop: '24px', color: 'var(--color-text-secondary)' }}>Redirecting...</p>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
      </style>
    </div>
  );
};

export default RedirectHandler;
