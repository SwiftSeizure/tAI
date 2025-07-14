import { useState, useEffect } from 'react'; 
import { getUnits } from '../services/get-units';

export const useUnits = (classId) => {
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      setIsLoading(true);
      try {
        const units = await getUnits(classId);
        setUnits(units); 
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnits();
  }, [classId]);

  return { units, isLoading, error };
};
