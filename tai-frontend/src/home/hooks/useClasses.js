import { useState, useEffect } from 'react'; 
import { getClasses } from '../services/get-classes'; 
import { useCurrentUser } from '../../store/user-store';

export const useClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);  
  const { user } = useCurrentUser();

  useEffect(() => {
    const loadClassCards = async () => {
      try {
        setLoading(true);
        const classes = await getClasses(user.id, user.role);
        setClasses(classes);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadClassCards();
  }, [user]);

  return { classes, loading, error };
};
