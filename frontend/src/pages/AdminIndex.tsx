import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function AdminIndex() {
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();

  useEffect(() => {
    if (workspaceId) {
      navigate(`/admin/${workspaceId}/reviews`);
    }
  }, [navigate, workspaceId]);

  return null;
}
