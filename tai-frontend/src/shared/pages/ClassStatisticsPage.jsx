import React, { useEffect, useState } from 'react';
import { NavBar } from '../../shared/components/NavBar';
import { useCurrentClass } from '../../store/class-store';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'; 
import { getAssignmentsPrompts } from '../services/get-assignments-prompt-count';
import { getMaterialsPrompts } from '../services/get-materials-prompt-count';
import { NoDataMessage } from '../components/NoDataMessage'; 
import { getMaterialStudentPrompts } from '../services/get-material-student-prompts';
import { getAssignmentStudentPrompts } from '../services/get-assignment-student-prompts';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const generateRandomColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
        const hue = Math.floor(Math.random() * 360);
        const saturation = 70 + Math.random() * 30;
        const lightness = 40 + Math.random() * 40;
        colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
};

export default function ClassStatisticsPage() {
    const { currentClass } = useCurrentClass(); 
    const [assignmentsData, setAssignmentsData] = useState([]);
    const [materialsData, setMaterialsData] = useState([]); 
    const [studentData, setStudentData] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState('');
    const [selectedItemType, setSelectedItemType] = useState('');

    const hasAssignments = assignmentsData.length > 0;
    const hasMaterials = materialsData.length > 0;
    const hasStudentData = studentData && Object.keys(studentData).length > 0;

    const handleMaterialAssignmentPieClick = (event, elements, chart) => {
        if (elements.length > 0) {
            const clickedElement = elements[0];
            const index = clickedElement.index;
            const id = assignmentsData[index]?.assignmentID || materialsData[index]?.materialID;
            
            if (id) {
                if (assignmentsData.some(item => item.assignmentID === id)) {
                    const assignment = assignmentsData.find(item => item.assignmentID === id);
                    setSelectedItemName(assignment.name);
                    setSelectedItemType('Assignment');
                    populateAssignmentStudentPrompts(id);
                } else if (materialsData.some(item => item.materialID === id)) {
                    const material = materialsData.find(item => item.materialID === id);
                    setSelectedItemName(material.name);
                    setSelectedItemType('Material');
                    populateMaterialStudentPrompts(id);
                } else {
                    console.error('Could not determine if ID belongs to assignment or material:', id);
                }
            } else {
                console.error('Could not find ID for clicked element');
            }
        }
    };  

    const populateAssignmentStudentPrompts = async (id) => {
        try {
            const response = await getAssignmentStudentPrompts(id); 
            console.log("Assignment student prompts in response:", response);

            //setStudentData(response);   
            const fakeResponse = {
                "1": {
                    "studentName": "Student 1",
                    "count": 5
                },
                "2": {
                    "studentName": "Student 2",
                    "count": 10
                },
                "3": {
                    "studentName": "Student 3",
                    "count": 15
                }
            };
            setStudentData(fakeResponse); 
        } catch (error) {
            console.error("Error fetching assignment student prompts:", error);
            setStudentData(null);
        } 
    };

    const populateMaterialStudentPrompts = async (id) => {
        try {
            const response = await getMaterialStudentPrompts(id); 
            console.log("Material student prompts in response:", response);
            setStudentData(response);  
        } catch (error) {
            console.error("Error fetching material student prompts:", error);
            setStudentData(null);
        } 
    };

    const fetchAssignmentsPrompts = async () => {
        try {
            const response = await getAssignmentsPrompts();
            console.log("Assignments prompts in response:", response);

            if (response && typeof response === 'object' && !Array.isArray(response)) {
                const formattedData = Object.entries(response).map(([id, item]) => ({
                    assignmentID: id,
                    name: item.assignment || `Assignment ${id}`,
                    value: item.count || 0
                }));
                console.log("Formatted assignments data:", formattedData);
                setAssignmentsData(formattedData);
            } else {
                console.error("Unexpected response format:", response);
                setAssignmentsData([]);
            }
        } catch (error) {
            console.error('Error fetching assignments prompts:', error);
            setAssignmentsData([]);
        }
    };

    const fetchMaterialsPrompts = async () => {
        try {
            const response = await getMaterialsPrompts();
            console.log("Materials prompts in response:", response);

            if (response && typeof response === 'object' && !Array.isArray(response)) {
                const formattedData = Object.entries(response).map(([id, item]) => ({
                    materialID: id,
                    name: item.material || item.assignment || `Material ${id}`,
                    value: item.count || 0
                }));
                console.log("Formatted materials data:", formattedData);
                setMaterialsData(formattedData);
            } else {
                console.error("Unexpected response format:", response);
                setMaterialsData([]);
            }
        } catch (error) {
            console.error('Error fetching materials prompts:', error);
            setMaterialsData([]);
        }
    };

    useEffect(() => {
        fetchAssignmentsPrompts(); 
        fetchMaterialsPrompts(); 
    }, []);

    const assignmentData = {
        labels: assignmentsData.map(a => a.name),
        datasets: [{
            label: 'Questions',
            data: assignmentsData.map(a => a.value),
            backgroundColor: generateRandomColors(assignmentsData.length),
            borderColor: '#fff',
            borderWidth: 2,
        }],
    };

    const materialData = {
        labels: materialsData.map(m => m.name),
        datasets: [{
            label: 'Questions',
            data: materialsData.map(m => m.value),
            backgroundColor: generateRandomColors(materialsData.length),
            borderColor: '#fff',
            borderWidth: 2,
        }],
    };

    const chartOptions = {
        responsive: true,
        onClick: handleMaterialAssignmentPieClick,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    color: '#374151'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value} prompt${value !== 1 ? 's' : ''}`;
                    }
                },
                enabled: true,
                backgroundColor: 'white',
                titleColor: '#111827',
                bodyColor: '#374151',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
            },
        },
    };

    const combinedBarData = {
        labels: assignmentsData.map(a => a.name),
        datasets: [
            {
                label: 'Assignment Prompts',
                data: assignmentsData.map(a => a.value),
                backgroundColor: generateRandomColors(assignmentsData.length, 0.8),
                borderRadius: 6,
            },
            {
                label: 'Material Prompts',
                data: materialsData.map(m => m.value),
                backgroundColor: generateRandomColors(materialsData.length, 0.6),
                borderRadius: 6,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    color: '#374151'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value} prompt${value !== 1 ? 's' : ''}`;
                    }
                },
                enabled: true,
                backgroundColor: 'white',
                titleColor: '#111827',
                bodyColor: '#374151',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                }
            }
        }
    };

    // Student bar chart data
    const studentBarData = studentData ? {
        labels: Object.values(studentData).map(s => s.studentName),
        datasets: [{
            label: 'Prompts',
            data: Object.values(studentData).map(s => s.count),
            backgroundColor: generateRandomColors(Object.keys(studentData).length),
            borderRadius: 6,
            borderWidth: 0,
        }],
    } : null;

    const studentBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const value = context.raw || 0;
                        return `${value} prompt${value !== 1 ? 's' : ''}`;
                    }
                },
                enabled: true,
                backgroundColor: 'white',
                titleColor: '#111827',
                bodyColor: '#374151',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0
                },
                title: {
                    display: true,
                    text: 'Number of Prompts',
                    font: {
                        size: 12,
                        family: "'Inter', sans-serif"
                    },
                    color: '#374151'
                }
            },
            x: {
                ticks: {
                    font: {
                        size: 11,
                        family: "'Inter', sans-serif"
                    },
                    color: '#374151'
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">
                    {currentClass?.name || 'Class'} Statistics
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Assignments Pie Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Assignment Prompts</h2>
                        {hasAssignments ? (
                            <div className="h-80">
                                <Pie data={assignmentData} options={chartOptions} />
                            </div>
                        ) : (
                            <NoDataMessage message="No assignment prompts available" />
                        )}
                    </div>

                    {/* Materials Pie Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Material Prompts</h2>
                        {hasMaterials ? (
                            <div className="h-80">
                                <Pie data={materialData} options={chartOptions} />
                            </div>
                        ) : (
                            <NoDataMessage message="No material prompts available" />
                        )}
                    </div>
                </div>

                {/* Combined Bar Chart */}
                {(hasAssignments || hasMaterials) && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                        <h2 className="text-lg font-semibold mb-4">Material vs Assignment Prompt Comparison</h2>
                        {hasAssignments && hasMaterials ? (
                            <div className="h-96">
                                <Bar data={combinedBarData} options={barChartOptions} />
                            </div>
                        ) : (
                            <NoDataMessage message="Unfortunately, there is not enough data to show a comparison. Great job teaching!" />
                        )}
                    </div>
                )}

                {/* Student Statistics Drill-Down */}
                {hasStudentData && (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">
                                Student Prompts for {selectedItemType}: {selectedItemName}
                            </h2>
                            <button
                                onClick={() => setStudentData(null)}
                                className="text-sm text-gray-600 hover:text-gray-900 underline"
                            >
                                Clear Selection
                            </button>
                        </div>
                        <div className="h-96">
                            <Bar data={studentBarData} options={studentBarOptions} />
                        </div>
                        <div className="mt-4 text-sm text-gray-600">
                            <p>Total Students: {Object.keys(studentData).length}</p>
                            <p>Total Prompts: {Object.values(studentData).reduce((sum, s) => sum + s.count, 0)}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ); 
}