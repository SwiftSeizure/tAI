import { NavBarTeamPresence } from "../components/NavBarTeamPresence";
import { Youtube, BookOpen } from 'lucide-react'; 

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <NavBarTeamPresence title="Our Team" />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
                    {/* Title */}
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold text-gray-900">Welcome to TAi</h1>
                        <p className="text-xl text-gray-600">See what makes us special</p>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-8">
                        {/* Introduction Section */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">Empowering Education with AI</h2>
                            <p className="text-gray-700 leading-7 text-justify">
                                TAi is an AI-powered teaching assistant designed to enhance real classrooms by providing personalized support. Our platform offers students on-demand, context-aware help with their course materials while giving teachers valuable insights into student progress and challenges. We believe every student deserves tutoring-level support, and modern AI makes this scalable without compromising educational quality.
                            </p>
                        </section>

                        {/* Problem Statement */}
                        <section className="space-y-4 bg-blue-50 p-6 rounded-xl">
                            <h2 className="text-2xl font-bold text-gray-800">The Challenge We're Solving</h2>
                            <div className="space-y-4 text-gray-700 leading-7">
                                <p>
                                    <span className="font-medium text-gray-800">The Problem:</span> Teachers struggle to provide individualized support to every student, while students often feel stuck without immediate guidance. Traditional tools show final answers but miss the learning journey.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
                                        <h3 className="font-semibold text-gray-800 mb-2">For Students</h3>
                                        <p>24/7 AI tutor that understands course materials, asks guiding questions, and provides tailored practice—all while encouraging understanding over simple answers.</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border-l-4 border-green-500">
                                        <h3 className="font-semibold text-gray-800 mb-2">For Teachers</h3>
                                        <p>Comprehensive analytics, interaction logs, and progress tracking to understand student challenges and optimize teaching strategies.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Technical Architecture */}
                        <section className="space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800">How It Works</h2>
                            <div className="space-y-6">
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg text-gray-800 mb-3">Robust Backend Infrastructure</h3>
                                    <p className="text-gray-700 leading-7">
                                        Built with Python's FastAPI and PostgreSQL, our backend efficiently manages complex educational hierarchies. We use Firebase for secure authentication and integrate with Canvas LMS to streamline teacher workflows.
                                    </p>
                                </div>
                                
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg text-gray-800 mb-3">Intelligent AI Integration</h3>
                                    <p className="text-gray-700 leading-7">
                                        Powered by OpenAI's GPT models, TAi grounds its responses in your actual course materials. Teachers can upload documents that the AI references, ensuring accurate and relevant assistance.
                                    </p>
                                </div>
                                
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="font-semibold text-lg text-gray-800 mb-3">User-Centric Frontend</h3>
                                    <p className="text-gray-700 leading-7">
                                        Our responsive React interface features real-time chat with Markdown/LaTeX support, embedded document viewing, and intuitive analytics dashboards—all designed with educators and students in mind.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Closing */}
                        <section className="text-center py-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">The Future of Classroom AI</h2>
                            <p className="text-gray-700 max-w-3xl mx-auto leading-7">
                                TAi represents a new approach to educational technology—one that enhances human teaching rather than replacing it. By combining cutting-edge AI with deep educational insights, we're creating tools that adapt to individual learning needs while keeping teachers firmly in control of the educational experience.
                            </p>
                        </section>
                    </div> 

                    {/* System Architecture Section */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">System Architecture</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Client Layer */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-xl font-semibold mb-4 text-blue-700">Client Layer</h3>
                                <ul className="space-y-2 list-disc pl-5 text-gray-700">
                                    <li>React 18 with React Router</li>
                                    <li>Material-UI + Tailwind CSS</li>
                                    <li>State Management: react-sweet-state</li>
                                    <li>Rich Text: Markdown + LaTeX</li>
                                    <li>Data Visualization: Chart.js</li>
                                </ul>
                            </div>

                            {/* Backend Layer */}
                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-xl font-semibold mb-4 text-green-700">Backend Layer</h3>
                                <ul className="space-y-2 list-disc pl-5 text-gray-700">
                                    <li>Python FastAPI (Uvicorn)</li>
                                    <li>PostgreSQL + SQLAlchemy ORM</li>
                                    <li>Firebase Authentication</li>
                                    <li>OpenAI API Integration</li>
                                    <li>Canvas LMS Integration</li>
                                </ul>
                            </div>

                            {/* Data Flow */}
                            <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg border border-gray-200">
                                <h3 className="text-xl font-semibold mb-4 text-purple-700">Data Flow</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-white rounded border-l-4 border-blue-500">
                                        <h4 className="font-medium text-gray-900">1. Authentication</h4>
                                        <p className="text-sm text-gray-600">Firebase Auth → JWT → Backend Verification</p>
                                    </div>
                                    <div className="p-4 bg-white rounded border-l-4 border-green-500">
                                        <h4 className="font-medium text-gray-900">2. File Processing</h4>
                                        <p className="text-sm text-gray-600">Upload → OpenAI API → Vector Storage</p>
                                    </div>
                                    <div className="p-4 bg-white rounded border-l-4 border-purple-500">
                                        <h4 className="font-medium text-gray-900">3. AI Interactions</h4>
                                        <p className="text-sm text-gray-600">Student Query → Context Retrieval → OpenAI → Response</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                        <a 
                            href="/tutorial" 
                            className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg 
                                     hover:bg-red-200 transition-colors duration-200"
                        >
                            <Youtube className="w-4 h-4" />
                            View Tutorial
                        </a>
                        <a 
                            href="/members" 
                            className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg 
                                     hover:bg-purple-200 transition-colors duration-200"
                        >
                            <BookOpen className="w-4 h-4" />
                            Team Members
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}