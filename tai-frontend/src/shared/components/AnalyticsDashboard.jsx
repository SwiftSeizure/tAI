import React, { useState, useEffect } from 'react';
import { Line, Radar, Scatter, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, RadialLinearScale, PointElement, LineElement);

export default function AnalyticsDashboard({ 
    assignmentsData, 
    materialsData, 
    studentData,
    chatHistory 
}) {
    const [analytics, setAnalytics] = useState({
        engagementTrend: [],
        difficultyScore: {},
        atRiskStudents: [],
        topPerformers: [],
        classAverage: 0,
        activityHeatmap: []
    });

    useEffect(() => {
        calculateAnalytics();
    }, [assignmentsData, materialsData, studentData]);

    const calculateAnalytics = () => {
        // 1. Calculate Class Average
        const studentArray = studentData ? Object.values(studentData) : [];
        const classAverage = studentArray.length > 0
            ? studentArray.reduce((sum, s) => sum + s.count, 0) / studentArray.length
            : 0;

        // 2. Identify At-Risk Students (below 50% of class average)
        const atRiskThreshold = classAverage * 0.5;
        const atRiskStudents = studentArray
            .filter(s => s.count < atRiskThreshold)
            .map(s => ({
                name: s.student || s.studentName,
                count: s.count,
                percentageOfAverage: ((s.count / classAverage) * 100).toFixed(1)
            }));

        // 3. Identify Top Performers (above 150% of class average)
        const topThreshold = classAverage * 1.5;
        const topPerformers = studentArray
            .filter(s => s.count > topThreshold)
            .sort((a, b) => b.count - a.count)
            .map(s => ({
                name: s.student || s.studentName,
                count: s.count,
                percentageOfAverage: ((s.count / classAverage) * 100).toFixed(1)
            }));

        // 4. Calculate Assignment/Material Difficulty Score
        // (Higher prompts = potentially more difficult or engaging)
        const allItems = [...assignmentsData, ...materialsData];
        const avgPrompts = allItems.length > 0
            ? allItems.reduce((sum, item) => sum + item.value, 0) / allItems.length
            : 0;

        const difficultyScore = {};
        allItems.forEach(item => {
            const id = item.assignmentID || item.materialID;
            const score = (item.value / avgPrompts) * 100;
            difficultyScore[id] = {
                name: item.name,
                score: score.toFixed(1),
                difficulty: score > 150 ? 'High' : score > 75 ? 'Medium' : 'Low'
            };
        });

        // 5. Engagement Distribution
        const engagementBuckets = {
            'No Activity': 0,
            'Low (1-5)': 0,
            'Medium (6-15)': 0,
            'High (16-30)': 0,
            'Very High (30+)': 0
        };

        studentArray.forEach(s => {
            if (s.count === 0) engagementBuckets['No Activity']++;
            else if (s.count <= 5) engagementBuckets['Low (1-5)']++;
            else if (s.count <= 15) engagementBuckets['Medium (6-15)']++;
            else if (s.count <= 30) engagementBuckets['High (16-30)']++;
            else engagementBuckets['Very High (30+)']++;
        });

        setAnalytics({
            engagementTrend: Object.entries(engagementBuckets),
            difficultyScore,
            atRiskStudents,
            topPerformers,
            classAverage: classAverage.toFixed(1),
            totalStudents: studentArray.length
        });
    };

    // Engagement Distribution Chart
    const engagementChartData = {
        labels: analytics.engagementTrend.map(([label]) => label),
        datasets: [{
            label: 'Number of Students',
            data: analytics.engagementTrend.map(([, count]) => count),
            backgroundColor: [
                'rgba(239, 68, 68, 0.6)',   // Red
                'rgba(251, 146, 60, 0.6)',  // Orange
                'rgba(234, 179, 8, 0.6)',   // Yellow
                'rgba(34, 197, 94, 0.6)',   // Green
                'rgba(59, 130, 246, 0.6)',  // Blue
            ],
            borderColor: [
                'rgb(239, 68, 68)',
                'rgb(251, 146, 60)',
                'rgb(234, 179, 8)',
                'rgb(34, 197, 94)',
                'rgb(59, 130, 246)',
            ],
            borderWidth: 2,
            borderRadius: 8,
        }],
    };

    const engagementChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
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

    // Difficulty Score Radar Chart
    const topDifficultItems = Object.entries(analytics.difficultyScore)
        .sort((a, b) => parseFloat(b[1].score) - parseFloat(a[1].score))
        .slice(0, 5);

    const radarChartData = {
        labels: topDifficultItems.map(([, item]) => item.name.substring(0, 20)),
        datasets: [{
            label: 'Difficulty Score',
            data: topDifficultItems.map(([, item]) => parseFloat(item.score)),
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            borderColor: 'rgb(139, 92, 246)',
            borderWidth: 2,
            pointBackgroundColor: 'rgb(139, 92, 246)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(139, 92, 246)'
        }],
    };

    const radarChartOptions = {
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
            }
        }
    };

    return (
        <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Class Average</h3>
                    <p className="text-3xl font-bold text-gray-900">{analytics.classAverage}</p>
                    <p className="text-xs text-gray-500 mt-1">prompts per student</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Less Engaged Students</h3>
                    <p className="text-3xl font-bold text-gray-900">{analytics.atRiskStudents.length}</p>
                    <p className="text-xs text-gray-500 mt-1">students with low chat engagement</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Highly Engaged Students</h3>
                    <p className="text-3xl font-bold text-gray-900">{analytics.topPerformers.length}</p>
                    <p className="text-xs text-gray-500 mt-1">highly engaged students with the chat</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Total Students</h3>
                    <p className="text-3xl font-bold text-gray-900">{analytics.totalStudents}</p>
                    <p className="text-xs text-gray-500 mt-1">in this class</p>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Engagement Distribution */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Engagement Distribution</h2>
                    <div className="h-80">
                        <Bar data={engagementChartData} options={engagementChartOptions} />
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Distribution of student engagement levels based on prompt count
                    </p>
                </div>

                {/* Difficulty Analysis */}
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-semibold mb-4">Content Difficulty Analysis</h2>
                    <div className="h-80">
                        <Radar data={radarChartData} options={radarChartOptions} />
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                        Top 5 assignments/materials by relative difficulty score 
                    </p>
                </div>
            </div>

            {/* At-Risk Students Table */}
            {analytics.atRiskStudents.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-red-700">Low Engagement</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Students with activity below 50% of class average
                            </p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-red-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Prompts
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        vs Class Avg
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {analytics.atRiskStudents.map((student, index) => (
                                    <tr key={index} className="hover:bg-red-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {student.name}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {student.count}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600 font-medium">
                                            {student.percentageOfAverage}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Top Performers Table */}
            {analytics.topPerformers.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-lg font-semibold text-green-700">Most Engaged Students</h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Students with activity above 150% of class average
                            </p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-green-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Prompts
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        vs Class Avg
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {analytics.topPerformers.map((student, index) => (
                                    <tr key={index} className="hover:bg-green-50">
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {student.name}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                            {student.count}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-medium">
                                            {student.percentageOfAverage}%
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                                Highly Engaged
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
}