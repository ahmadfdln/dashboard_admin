import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../../config/firebase';

export default function useAuth(navigate) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      if (!user) navigate('/login');
      setCurrentUser(user);
      setAuthChecked(true);
    });

    return () => unsub();
  }, []);

  return { currentUser, authChecked };
}
