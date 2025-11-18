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
    const [showAllAssignments, setShowAllAssignments] = useState(false);
    const [showAllMaterials, setShowAllMaterials] = useState(false);

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

    // Student pie chart data
    const studentPieData = studentData ? {
        labels: Object.values(studentData).map(s => s.studentName),
        datasets: [{
            label: 'Prompts',
            data: Object.values(studentData).map(s => s.count),
            backgroundColor: generateRandomColors(Object.keys(studentData).length),
            borderColor: '#fff',
            borderWidth: 2,
        }],
    } : null;

    const studentPieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    padding: 10,
                    font: {
                        size: 11,
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
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} prompt${value !== 1 ? 's' : ''} (${percentage}%)`;
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

    // Prepare student data for table
    const studentTableData = studentData ? 
        Object.values(studentData)
            .sort((a, b) => b.count - a.count)
            .map((student, index) => ({
                ...student,
                rank: index + 1
            })) 
        : [];

    const totalPrompts = studentTableData.reduce((sum, s) => sum + s.count, 0);

    // Sort and prepare assignments data for table
    const sortedAssignments = [...assignmentsData].sort((a, b) => b.value - a.value);
    const displayedAssignments = showAllAssignments ? sortedAssignments : sortedAssignments.slice(0, 3);
    const totalAssignmentPrompts = assignmentsData.reduce((sum, a) => sum + a.value, 0);

    // Sort and prepare materials data for table
    const sortedMaterials = [...materialsData].sort((a, b) => b.value - a.value);
    const displayedMaterials = showAllMaterials ? sortedMaterials : sortedMaterials.slice(0, 3);
    const totalMaterialPrompts = materialsData.reduce((sum, m) => sum + m.value, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar title="Statistics" />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">
                    {currentClass?.name || 'Class'} Statistics
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Assignments Section */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Assignment Prompts</h2>
                        {hasAssignments ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Pie Chart */}
                                <div className="h-80">
                                    <Pie data={assignmentData} options={chartOptions} />
                                </div>
                                
                                {/* Top Assignments Table */}
                                <div className="flex flex-col">
                                    <div className="text-sm text-gray-600 mb-3">
                                        {assignmentsData.length} assignments • {totalAssignmentPrompts} total prompts
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <colgroup>
                                                <col className="w-16" />
                                                <col className="min-w-[150px]" />
                                                <col className="w-24" />
                                            </colgroup>
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                        Rank
                                                    </th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Assignment
                                                    </th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                        Prompts
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {displayedAssignments.map((assignment, index) => (
                                                    <tr key={assignment.assignmentID} className="hover:bg-gray-50">
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            #{index + 1}
                                                        </td>
                                                        <td className="px-3 py-2 text-sm text-gray-900 truncate max-w-[150px]" title={assignment.name}>
                                                            {assignment.name}
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                            {assignment.value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {assignmentsData.length > 3 && (
                                        <button
                                            onClick={() => setShowAllAssignments(!showAllAssignments)}
                                            className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline self-start"
                                        >
                                            {showAllAssignments ? 'Show Less' : `Show All (${assignmentsData.length})`}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <NoDataMessage message="No assignment prompts available" />
                        )}
                    </div>

                    {/* Materials Section */}
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-lg font-semibold mb-4">Material Prompts</h2>
                        {hasMaterials ? (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Pie Chart */}
                                <div className="h-80">
                                    <Pie data={materialData} options={chartOptions} />
                                </div>
                                
                                {/* Top Materials Table */}
                                <div className="flex flex-col">
                                    <div className="text-sm text-gray-600 mb-3">
                                        {materialsData.length} materials • {totalMaterialPrompts} total prompts
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <colgroup>
                                                <col className="w-16" />
                                                <col className="min-w-[150px]" />
                                                <col className="w-24" />
                                            </colgroup>
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                        Rank
                                                    </th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Material
                                                    </th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                        Prompts
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {displayedMaterials.map((material, index) => (
                                                    <tr key={material.materialID} className="hover:bg-gray-50">
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            #{index + 1}
                                                        </td>
                                                        <td className="px-3 py-2 text-sm text-gray-900 truncate max-w-[150px]" title={material.name}>
                                                            {material.name}
                                                        </td>
                                                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                            {material.value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    {materialsData.length > 3 && (
                                        <button
                                            onClick={() => setShowAllMaterials(!showAllMaterials)}
                                            className="mt-3 text-sm text-blue-600 hover:text-blue-800 underline self-start"
                                        >
                                            {showAllMaterials ? 'Show Less' : `Show All (${materialsData.length})`}
                                        </button>
                                    )}
                                </div>
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
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Student Prompts for {selectedItemType}: {selectedItemName}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {studentTableData.length} students • {totalPrompts} total prompts
                                </p>
                            </div>
                            <button
                                onClick={() => setStudentData(null)}
                                className="text-sm text-gray-600 hover:text-gray-900 underline"
                            >
                                Clear Selection
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Student Table */}
                            <div className="overflow-hidden">
                                <div className="overflow-y-auto max-h-96">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Rank
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Student
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Prompts
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    %
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {studentTableData.map((student) => {
                                                const percentage = ((student.count / totalPrompts) * 100).toFixed(1);
                                                return (
                                                    <tr key={student.studentID} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            #{student.rank}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {student.studentName}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {student.count}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                            {percentage}%
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Student Pie Chart */}
                            <div className="h-96">
                                <Pie data={studentPieData} options={studentPieOptions} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    ); 
}