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
                        <h1 className="text-4xl font-bold text-gray-900">Meet Our Team</h1>
                        <p className="text-xl text-gray-600">The people behind the platform</p>
                    </div>

                    {/* Content Paragraphs */}
                    <div className="space-y-4 text-gray-700 leading-relaxed">
                        <p>
                            tAI is an AI powered teaching assistant designed to sit alongside real classes, real teachers, and real students in order to amplify what's already happening in the classroom. At its core, tAI is a full stack educational platform where students get on demand, context aware help with their actual course materials, and teachers gain a window into how students are thinking, struggling, and progressing over time. We built it because we genuinely believe that every student deserves tutoring level support, and that modern AI can finally make that scalable without sacrificing teacher oversight or pedagogical integrity.
                        </p>
                        
                        <p>
                            The problem we're addressing is simple but deep: teachers do not have the time or capacity to give individualized support to every student exactly when they need it, and traditional tools only ever show the final answer, not the learning journey. Students get stuck on homework late at night, go days without feedback, or quietly fall behind because they're afraid to ask "basic" questions. Teachers, meanwhile, see grades but not the misconceptions that produced them. tAI tackles both sides of this gap. For students, it provides a 24/7 AI tutor that reads the same PDFs, problem sets, and notes they're working from, then uses a deliberately Socratic style that is to ask guiding questions, breaking down concepts, and generating practice problems at appropriate difficulty level rather than simply giving away solutions. For teachers, it logs interactions, surfaces analytics about engagement and difficulty, and preserves full chat histories so they can understand what students are actually wrestling with and how the AI is intervening.
                        </p>
                        
                        <p>
                            To make this work in real classrooms, tAI is built as a robust web application with a modern, scalable architecture. The backend uses Python with FastAPI, PostgreSQL, and SQLAlchemy to model a rich hierarchy of classes, units, modules, days, materials, and assignments. Authentication and identity are handled via Firebase, with the backend verifying Firebase JWTs on each request to maintain a clean separation between auth and application logic. AI functionality is powered by OpenAI's GPT models, with teacher uploaded course files sent to OpenAI's file API to allow the assistant to ground its responses in the exact materials used in class. Canvas LMS is integrated with encrypted storage of API tokens and automatic import of modules and assignments so teachers don't have to duplicate their work or change their existing workflows.
                        </p>

                        <p>
                            On the frontend, tAI is a tailored React application using React Router for navigation and react sweet state with localStorage persistence for managing session state across chat, practice, and class contexts. The UI is built with Material UI components and Tailwind CSS for a responsive, accessible interface that feels ergonomic and familiar to teachers and students. The chat experience supports rich formatting and math through Markdown and LaTeX rendering, while embedded PDF viewing lets students read and ask about materials in one place. Teacher analytics dashboards use Chart.js to visualize engagement patterns, prompt counts, and practice performance in a way that supports real instructional decisions.
                        </p> 

                        <p>
                            Taken together tAI a bet on the bridge between the growing capabilities of AI and the foundational potential of education. tAI is designed to respect teachers' bandwidth, honor students' need for genuine understanding, and use AI as a force multiplier rather than a shortcut. We believe deeply that this is the right shape for classroom AI: grounded in real course content, transparent to instructors, adaptive to individual learners, and built on a foundation that can grow with the realities of modern education.
                        </p>
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