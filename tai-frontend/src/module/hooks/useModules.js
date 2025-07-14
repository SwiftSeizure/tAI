import { useState, useEffect } from 'react';
import { getModules } from '../services/get-modules';

export const useModules = (unitID) => {
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      setIsLoading(true);
      try {
        const modules = await getModules(unitID);
        setModules(modules); 
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchModules();
  }, [unitID]);

  return { modules, isLoading, error };
};
