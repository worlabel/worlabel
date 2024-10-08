import useHandleOAuthCallback from '@/hooks/useOAuthCallback';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAuthStore from '@/stores/useAuthStore';

export default function OAuthCallback() {
  useHandleOAuthCallback();
  const navigate = useNavigate();
  const profile = useAuthStore((state) => state.profile);

  useEffect(() => {
    if (profile) {
      navigate('/browse', { replace: true });
    }
  }, [profile, navigate]);

  return null;
}
