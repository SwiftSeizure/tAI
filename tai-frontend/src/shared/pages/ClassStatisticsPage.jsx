import React from 'react'; 
import { NavBar } from '../components/NavBar'; 
import { useCurrentClass } from '../../store/class-store'; 

/* 
Will want to use

Recharts 

Will want to track
1. # of student questions about assignments and a pi chart with a slice representing each assignment 
2. # of student questions about material and a pi chart with a slice representing each material 
3. we will want another bar chart right under this representing the same ina  4x4 style grid 
4. Once one of these either slices or bars is clicked, we will want the page to kind of drowdown and give more pie charts and bar charts 
5. These pie charts and bar charts will be # of questions asked about a specific topic. 
6. There will also be pie charts and bar charts representing specific students and how many questions they have asked. 
7. 

*/

// Going to use recharts 

export default function ClassStatisticsPage() {
    const { currentClass } = useCurrentClass(); 

    
    return (
        <>
        <NavBar 
            title="Class Statistics" 
            classID={currentClass?.id}
        />
        <div> 

            
            <h1>Class Statistics Page</h1> 
            Here I want a little bit of a description of what this page does and how it can track.


        </div>
        </>
    );
}
