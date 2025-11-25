import React from 'react';
import { NavBarTeamPresence } from '../../shared/components/NavBarTeamPresence';
import { Mail, Linkedin, Youtube, Users } from 'lucide-react'; 
import kieranHeadshot from '../../shared/images/team-page/kieran-headshot.png'; 
import haidanHeadshot from '../../shared/images/team-page/haidan-headshot.png';
import wilsonHeadshot from '../../shared/images/team-page/wilson-headshot.jpg';

export default function MembersPage() {
    const members = [
        {
            id: 1,
            name: "Kieran Barksdale",
            role: "Frontend Engineer",
            email: "u1355687@umail.utah.edu",
            linkedin: "https://www.linkedin.com/in/kieran-barksdale/",
            image: kieranHeadshot, 
            biography: `I am currently pursuing a Bachelor of Science in Computer Science at the University of Utah with an emphasis on Software Development. Alongside my studies, I work part-time as a Software Developer, where I have gained exponential knowledge about all parts of the software lifecycle.

                        I'm especially interested in machine learning and artificial intelligence, and I'm actively expanding my skills in these areas through personal projects and research. I'm fascinated by the potential of intelligent systems to solve meaningful problems, streamline workflows, and improve everyday life. My long-term goal is to be in a place where I am encouraged to learn and help people through systems I create.

                        Outside of my professional life, I love being active through weightlifting, skiing, and surfing. I enjoy exploring new places and am always open to trying something adventurous, whether that be professional or personal.`
        },
        {
            id: 2,
            name: "Haidan Nelson",
            role: "Backend Engineer",
            email: "haidandnelson@gmail.com",
            linkedin: "https://www.linkedin.com/in/haidan-nelson-80a750299/?skipRedirect=true",
            image: haidanHeadshot, 
            biography: " I am a Computer Science major. I am deeply interested in how we can utilize the educational and learning powers of LLM's  to empower students. I came up with the idea for this project after observing the difference in experience between me and some of my peers. Generative AI allowed me to learn about and understand concepts at a rate far faster than before. However for others it served as a shortcut to learning robbing them from actually understanding the material. That's why TAi was made to bridge that gap, 100% of TAi users experience the best that generative AI has to offer. Aside from wanting to empower students, I am currently a paid member of a quantitative trading group. We are creating a pipeline to analyze pairs of contracts selecting for mean reverting highly volatile pairs. We then trade these pairs based on there mean reversion. This project has been an incredible opportunity to collaborate and learn from academic papers, and we have big plans for the future."
        },
        {
            id: 3,
            name: "Ethan Phelps",
            role: "Backend Engineer",
            email: "ezphelps@gmail.com",
            linkedin: "",
            image: "https://via.placeholder.com/200/6A4C93/FFFFFF?text=MJ", 
            biography: "Some stuff about Ethan"
        },
        {
            id: 4,
            name: "Wilson Webster",
            role: "Frontend Enginner",
            email: "wilweb72@gmail.com",
            linkedin: "",
            image: wilsonHeadshot, 
            biography: `I am pursuing a B.S. in Computer Science at the University of Utah, with interests spanning parallel and high-performance computing, machine learning, web development, systems engineering, and computer security. I am comfortable moving between low-level performance tuning (OpenMP, CUDA, vectorization) and higher-level application design in Python and JavaScript. I have significant experience with frontend web development through React and backend optimization via Python, C, and C++.

                        Our capstone project, TAi, is an AI-powered teaching assistant that integrates with Canvas to help instructors generate practice material and give students clearer, more controllable AI support. On TAi, I work across the stack, designing FastAPI + SQL services, React/Tailwind interfaces, and running user studies with teachers.

                        Outside class, I own and operate a fine-art photography and framing business. I choose to spend much of my time researching the latest advancements in tech or in the great outdoors, both in leisurely and adrenalized activities.`
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <NavBarTeamPresence title="Team Members" />
            
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Team Members</h1>
                    <p className="text-xl text-gray-600">Get to know the people behind the project</p>
                </div>

                {/* Members Grid */}
                <div className="space-y-8">
                    {members.map((member) => (
                        <div key={member.id} className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row gap-6">
                                {/* Headshot */}
                                <div className="flex-shrink-0">
                                    <img 
                                        src={member.image} 
                                        alt={member.name}
                                        className="w-48 h-48 rounded-xl object-cover shadow-md mx-auto sm:mx-0"
                                    />
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-4">
                                    {/* Name and Role */}
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
                                        <p className="text-lg text-blue-600 font-medium">{member.role}</p>
                                    </div>

                                    {/* Biography */}
                                    <p className="text-gray-700 leading-relaxed">
                                        {member.biography}
                                    </p>

                                    {/* Contact Info */}
                                    <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                        <a 
                                            href={`mailto:${member.email}`}
                                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 
                                                     rounded-lg hover:bg-blue-200 transition-colors duration-200"
                                        >
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </a>
                                        {member.linkedin && (
                                            <a 
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
                                                         rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                            >
                                                <Linkedin className="w-4 h-4" />
                                                LinkedIn
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Links */}
                <div className="flex flex-wrap gap-4 justify-center mt-10">
                    <a 
                        href="/tutorial" 
                        className="flex items-center gap-2 px-6 py-3 bg-red-100 text-red-700 rounded-lg 
                                 hover:bg-red-200 transition-colors duration-200 shadow-sm"
                    >
                        <Youtube className="w-5 h-5" />
                        View Tutorial
                    </a>
                    <a 
                        href="/team" 
                        className="flex items-center gap-2 px-6 py-3 bg-blue-100 text-blue-700 rounded-lg 
                                 hover:bg-blue-200 transition-colors duration-200 shadow-sm"
                    >
                        <Users className="w-5 h-5" />
                        About the Team
                    </a>
                </div>
            </div>
        </div>
    );
}