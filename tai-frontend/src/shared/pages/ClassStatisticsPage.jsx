import React, { useEffect, useState } from 'react';
import { NavBar } from '../../shared/components/NavBar';
import { useCurrentClass } from '../../store/class-store';
import { Pie, Bar, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'; 
import { getAssignmentsPrompts } from '../services/get-assignments-prompt-count';
import { getMaterialsPrompts } from '../services/get-materials-prompt-count';
import { NoDataMessage } from '../components/NoDataMessage'; 
import { getMaterialStudentPrompts } from '../services/get-material-student-prompts';
import { getAssignmentStudentPrompts } from '../services/get-assignment-student-prompts'; 
import { getMaterialStudentChat } from '../services/get-material-student-chat';
import { getAssignmentStudentChat } from '../services/get-assignment-student-chat'; 
import AnalyticsDashboard from '../components/AnalyticsDashboard';

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
    const [selectedItemID, setSelectedItemID] = useState(null);
    const [showAllAssignments, setShowAllAssignments] = useState(false);
    const [showAllMaterials, setShowAllMaterials] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [chatHistory, setChatHistory] = useState(null);
    const [loadingChat, setLoadingChat] = useState(false);

    const hasAssignments = assignmentsData.length > 0;
    const hasMaterials = materialsData.length > 0;
    const hasStudentData = studentData && Object.keys(studentData).length > 0;
    const hasChatHistory = chatHistory && chatHistory.length > 0; 

    const handleStudentPieClick = async (event, elements, chart) => {
        if (elements.length > 0) {
            const clickedElement = elements[0];
            const index = clickedElement.index;
            const studentArray = Object.entries(studentData);
            const [studentID, studentInfo] = studentArray[index]; 

            setSelectedStudent({
                id: studentID,
                name: studentInfo.student
            });

            // Fetch chat history based on item type
            setLoadingChat(true);
            try {
                let response;
                if (selectedItemType === 'Assignment') {
                    response = await getAssignmentStudentChat(selectedItemID, studentID);
                } else if (selectedItemType === 'Material') {
                    response = await getMaterialStudentChat(selectedItemID, studentID);
                }
                
                // Handle response format - could be array or object with messages/responses
                if (Array.isArray(response)) {
                    setChatHistory(response); 
                } else if (response && typeof response === 'object') {
                    // Handle object with messages and responses arrays
                    if (response.messages && response.responses) {
                        // Combine messages and responses into a single array with proper ordering
                        const combinedChat = [];
                        const messages = response.messages || [];
                        const responses = response.responses || [];
                        
                        // Interleave messages and responses
                        for (let i = 0; i < Math.max(messages.length, responses.length); i++) {
                            if (messages[i]) {
                                combinedChat.push({
                                    ...messages[i],
                                    role: 'user',
                                    sender: 'student'
                                });
                            }
                            if (responses[i]) {
                                combinedChat.push({
                                    ...responses[i],
                                    role: 'assistant',
                                    sender: 'ai'
                                });
                            }
                        }
                        setChatHistory(combinedChat);
                    } else {
                        // Convert object to array if needed
                        setChatHistory(Object.values(response));
                    }
                } else {
                    setChatHistory([]);
                }
            } catch (error) {
                console.error("Error fetching chat history:", error);
                setChatHistory([]);
            } finally {
                setLoadingChat(false);
            }
        }
    };

    const handleMaterialAssignmentPieClick = (event, elements, chart, isAssignment = true) => {
        // Clear any selected student when changing assignment/material
        setSelectedStudent(null);
        setChatHistory(null);

        if (elements.length > 0) {
            const clickedElement = elements[0];
            const index = clickedElement.index;

            // Determine which dataset was clicked based on the chart
            const dataSource = isAssignment ? assignmentsData : materialsData;
            const item = dataSource[index];

            if (item) {
                if (isAssignment) {
                    setSelectedItemName(item.name);
                    setSelectedItemType('Assignment');
                    setSelectedItemID(item.assignmentID);
                    populateAssignmentStudentPrompts(item.assignmentID);
                } else {
                    setSelectedItemName(item.name);
                    setSelectedItemType('Material');
                    setSelectedItemID(item.materialID);
                    populateMaterialStudentPrompts(item.materialID);
                }
            } else {
                console.error('Could not find item for clicked element at index:', index);
            }
        }
    };   

    const populateAssignmentStudentPrompts = async (id) => {
        try {
            const response = await getAssignmentStudentPrompts(id); 
            await setStudentData(response); 
        } catch (error) {
            console.error("Error fetching assignment student prompts:", error);
            setStudentData(null);
        } 
    };

    const populateMaterialStudentPrompts = async (id) => {
        try {
            const response = await getMaterialStudentPrompts(id); 
            await setStudentData(response);
        } catch (error) {
            console.error("Error fetching material student prompts:", error);
            setStudentData(null);
        } 
    };

    const fetchAssignmentsPrompts = async () => {
        try {
            const response = await getAssignmentsPrompts(currentClass.id);

            if (response && typeof response === 'object' && !Array.isArray(response)) {
                const formattedData = Object.entries(response).map(([id, item]) => ({
                    assignmentID: id,
                    name: item.assignment || `Assignment ${id}`,
                    value: item.count || 0
                }));
    
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
            const response = await getMaterialsPrompts(currentClass.id);

            if (response && typeof response === 'object' && !Array.isArray(response)) {
                const formattedData = Object.entries(response).map(([id, item]) => ({
                    materialID: id,
                    name: item.material || item.assignment || `Material ${id}`,
                    value: item.count || 0
                }));
                setMaterialsData(formattedData);
            } else {
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

    const setInformationNull = () => {
        setStudentData(null);
        setSelectedStudent(null);
        setChatHistory(null);
        setSelectedItemID(null);
    }

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

    const assignmentChartOptions = {
        ...chartOptions,
        onClick: (event, elements, chart) => handleMaterialAssignmentPieClick(event, elements, chart, true)
    };

    const materialChartOptions = {
        ...chartOptions,
        onClick: (event, elements, chart) => handleMaterialAssignmentPieClick(event, elements, chart, false)
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
        labels: Object.values(studentData).map(s => s.student),
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
        onClick: handleStudentPieClick,
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
        Object.entries(studentData)
            .sort((a, b) => b[1].count - a[1].count)
            .map(([id, student], index) => ({
                studentID: id,
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

    const handleStudentRowClick = async (studentID, studentName) => {
        setSelectedStudent({
            id: studentID,
            name: studentName
        });

        setLoadingChat(true);
        try {
            let response;
            if (selectedItemType === 'Assignment') {
                response = await getAssignmentStudentChat(selectedItemID, studentID);
            } else if (selectedItemType === 'Material') {
                response = await getMaterialStudentChat(selectedItemID, studentID);
            }
            
            if (Array.isArray(response)) {
                setChatHistory(response);
            } else if (response && typeof response === 'object') {
                setChatHistory(Object.values(response));
            } else {
                setChatHistory([]);
            }
        } catch (error) {
            console.error("Error fetching chat history:", error);
            setChatHistory([]);
        } finally {
            setLoadingChat(false);
        }
    }; 

    // Calculate difficulty scores
    const getDifficultyRadarData = () => {
        const allItems = [...assignmentsData, ...materialsData];
        const avgPrompts = allItems.length > 0
            ? allItems.reduce((sum, item) => sum + item.value, 0) / allItems.length
            : 0;

        const itemsWithScores = allItems.map(item => ({
            id: item.assignmentID || item.materialID,
            name: item.name,
            score: avgPrompts > 0 ? (item.value / avgPrompts) * 100 : 0
        }));

        const topDifficultItems = itemsWithScores
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

        return {
            labels: topDifficultItems.map(item => 
                item.name.length > 20 ? item.name.substring(0, 20) + '...' : item.name
            ),
            datasets: [{
                label: 'Difficulty Score',
                data: topDifficultItems.map(item => item.score),
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                borderColor: 'rgb(139, 92, 246)',
                borderWidth: 2,
                pointBackgroundColor: 'rgb(139, 92, 246)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(139, 92, 246)'
            }],
        };
    };

    const difficultyRadarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            r: {
                beginAtZero: true,
                ticks: {
                    stepSize: 25
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'white',
                titleColor: '#111827',
                bodyColor: '#374151',
                borderColor: '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
            }
        }
    };

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
                                <div className="h-80">
                                    <Pie data={assignmentData} options={assignmentChartOptions} />
                                </div>
                                
                                <div className="flex flex-col">
                                    <div className="text-sm text-gray-600 mb-3">
                                        {assignmentsData.length} assignments • {totalAssignmentPrompts} total prompts
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Rank
                                                    </th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Assignment
                                                    </th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                                <div className="h-80">
                                    <Pie data={materialData} options={materialChartOptions} />
                                </div>
                                
                                <div className="flex flex-col">
                                    <div className="text-sm text-gray-600 mb-3">
                                        {materialsData.length} materials • {totalMaterialPrompts} total prompts
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Rank
                                                    </th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Material
                                                    </th>
                                                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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

                {/* Combined Analytics Section */}
                {(hasAssignments || hasMaterials) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Combined Bar Chart */}
                        {/* <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-lg font-semibold mb-4">Material vs Assignment Prompt Comparison</h2>
                            {hasAssignments && hasMaterials ? (
                                <div className="h-80">
                                    <Bar data={combinedBarData} options={barChartOptions} />
                                </div>
                            ) : (
                                <NoDataMessage message="Unfortunately, there is not enough data to show a comparison. Great job teaching!" />
                            )}
                        </div> */}
                        
                        {/* Difficulty Analysis */}
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h2 className="text-lg font-semibold mb-4">Predicted Content Difficulty Analysis</h2>
                            <div className="h-80">
                                <Radar data={getDifficultyRadarData()} options={difficultyRadarOptions} />
                            </div>
                            <p className="text-xs text-gray-500 mt-3">
                                Top 5 assignments/materials by relative difficulty score
                            </p>
                        </div>
                    </div>
                )}

                {/* Student Statistics Drill-Down */}
                {hasStudentData && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
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
                                onClick={setInformationNull}
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
                                                const isSelected = selectedStudent?.id === student.studentID; 
                                                return (
                                                    <tr 
                                                        key={student.studentID} 
                                                        onClick={() => handleStudentRowClick(student.studentID, student.student)}
                                                        className={`cursor-pointer transition-colors ${
                                                            isSelected 
                                                                ? 'bg-blue-50 hover:bg-blue-100' 
                                                                : 'hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            #{student.rank}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                            {student.student}
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
                                <p className="text-xs text-gray-500 text-center mt-2">
                                    Click on a slice or table row to view chat history
                                </p>
                            </div>
                        </div>
                    </div>
                )} 

                {/* Specific Student Chat History */}
                {selectedStudent && ( 
                    <div>
                    <div className="bg-white p-6 rounded-xl shadow-md" >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Chat History: {selectedStudent.name}
                                </h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {selectedItemType}: {selectedItemName}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedStudent(null);
                                    setChatHistory(null);
                                }}
                                className="text-sm text-gray-600 hover:text-gray-900 underline"
                            >
                                Close Chat History
                            </button>
                        </div>

                        {loadingChat ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="text-gray-500">Loading chat history...</div>
                            </div>
                        ) : hasChatHistory ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {chatHistory.map((message, index) => (
                                    <div 
                                        key={index}
                                        className={`p-4 rounded-lg ${
                                            message.role === 'user' || message.sender === 'student'
                                                ? 'bg-blue-50 ml-8'
                                                : 'bg-gray-50 mr-8'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <span className={`text-xs font-medium ${
                                                message.role === 'user' || message.sender === 'student'
                                                    ? 'text-blue-700'
                                                    : 'text-gray-700'
                                            }`}>
                                                {message.role === 'user' || message.sender === 'student' 
                                                    ? 'Student' 
                                                    : 'AI Assistant'}
                                            </span>
                                            {message.timestamp && (
                                                <span className="text-xs text-gray-500">
                                                    {new Date(message.timestamp).toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-800 whitespace-pre-wrap">
                                            {message.content || message.message || message.text}
                                        </div>
                                    </div>
                                ))}
                            </div> 
                            
                        ) : (
                            <NoDataMessage message="No chat history available for this student" />
                        )}
                    </div>  

                    <div className="mt-8">
                        <AnalyticsDashboard 
                            assignmentsData={assignmentsData} 
                            materialsData={materialsData} 
                            studentData={studentData}
                            chatHistory={chatHistory}
                        />  
                    </div>
                </div>
                )} 
            </div>
        </div>
    ); 
}