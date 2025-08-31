import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';

const TeacherCreateModulePage = () => {   
    const [moduleName, setModuleName] = useState(''); 
    
    const [days, setDays] = useState([{ id: Date.now(), name: '' }]); //TODO figure out what more for days 
    const navigate = useNavigate();  

    const handleAddDay = () => { 
        setDays([...days, { id: Date.now(), name: '' }]);
    }; 

    const handleDayChange = (id, value) => {
        setDays(days.map(day => 
            day.id === id ? { ...day, name: value } : day
        ));
    };

    const handleRemoveDay = (id) => {
        if (days.length > 1) {
            setDays(days.filter(day => day.id !== id));
        }
    };

    const handleOnCreateModule = () => {  
        console.log('Creating module:', { moduleName, days });
        // TODO: Add API call to create module with days
        navigate('/modulepage');
    }; 

    const handleOnCancel = () => { 
        navigate('/modulepage');
    };

    return ( 
        <div> 
            <h1>Teacher Create Module Page</h1>     
            <h2>Create a Module</h2> 

            <input 
                type="text" 
                placeholder="Module Name" 
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
            />   

            <div> 
                {days.map((day) => (
                    <div key={day.id} style={{ margin: '10px 0' }}>
                        <input 
                            type="text" 
                            placeholder="Day Name" 
                            value={day.name}
                            onChange={(e) => handleDayChange(day.id, e.target.value)}
                            style={{ marginRight: '10px' }}
                        /> 
                        <button 
                            type="button"
                            onClick={() => handleRemoveDay(day.id)}
                            disabled={days.length <= 1}
                            style={{
                                backgroundColor: days.length <= 1 ? '#ccc' : '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                borderRadius: '4px',
                                cursor: days.length <= 1 ? 'not-allowed' : 'pointer'
                            }}
                        > 
                            Remove Day 
                        </button>
                    </div>
                ))}
            </div> 

            <button 
                onClick={handleAddDay}
                style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    margin: '10px 5px',
                    cursor: 'pointer'
                }}
            > 
                Add Day 
            </button>  

            <div>
                <button 
                    onClick={handleOnCreateModule}
                    style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        margin: '10px 5px',
                        cursor: 'pointer'
                    }}
                > 
                    Create Module 
                </button> 
                <button 
                    onClick={handleOnCancel}
                    style={{
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '4px',
                        margin: '10px 5px',
                        cursor: 'pointer'
                    }}
                > 
                    Cancel 
                </button>
            </div>
        </div> 
    ); 
}; 

export default TeacherCreateModulePage;
