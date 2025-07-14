import { useState, useEffect } from 'react'; 
import { getClasses } from '../services/get-classes';

export const useClasses = (userID, role) => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadClassCards = async () => {
      try {
        setLoading(true);
        const classes = await getClasses(userID, role);
        setClasses(classes);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadClassCards();
  }, [userID, role]);

  return { classes, loading, error };
};
