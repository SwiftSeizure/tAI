import { CLASS_STORAGE_KEY } from '../class-store';

export const updateClass = (updatedClass) => ({ setState, getState }) => {
  if (!updatedClass || !updatedClass.id) {
    console.error('Invalid class data provided for update');
    return null;
  }

  const { classes, currentClass } = getState();
  
  // Update the class in the classes array
  const updatedClasses = classes.map(cls => 
    cls.id === updatedClass.id ? { ...cls, ...updatedClass } : cls
  );

  // Update currentClass if it's the one being updated
  const newCurrentClass = currentClass?.id === updatedClass.id 
    ? { ...currentClass, ...updatedClass }
    : currentClass;

  const newState = {
    classes: updatedClasses,
    currentClass: newCurrentClass,
    lastUpdated: new Date().toISOString()
  };

  setState(newState);
  
  // Update localStorage
  localStorage.setItem(CLASS_STORAGE_KEY, JSON.stringify({
    ...getState(),
    ...newState
  })); 

  console.log("Updated class:", updatedClass);

  return updatedClass;
};
