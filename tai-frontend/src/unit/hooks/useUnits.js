import { useState, useEffect } from 'react';
import axios from 'axios';

const useUnits = (classId) => {
  const [units, setUnits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnits = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/classroom/${classId}/units`);
        setUnits(response.data.units); 
        console.log(response.data.units);
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

export default useUnits;