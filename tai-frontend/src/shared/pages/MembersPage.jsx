import React from 'react';
import { NavBarTeamPresence } from '../../shared/components/NavBarTeamPresence';
import { Mail, Linkedin, Youtube, Users } from 'lucide-react';

export default function MembersPage() {
    const members = [
        {
            id: 1,
            name: "John Doe",
            role: "Lead Developer",
            email: "john.doe@example.com",
            linkedin: "https://linkedin.com/in/johndoe",
            image: "https://via.placeholder.com/200/4A90E2/FFFFFF?text=JD"
        },
        {
            id: 2,
            name: "Jane Smith",
            role: "UI/UX Designer",
            email: "jane.smith@example.com",
            linkedin: "https://linkedin.com/in/janesmith",
            image: "https://via.placeholder.com/200/E94B3C/FFFFFF?text=JS"
        },
        {
            id: 3,
            name: "Mike Johnson",
            role: "Backend Engineer",
            email: "mike.johnson@example.com",
            linkedin: "https://linkedin.com/in/mikejohnson",
            image: "https://via.placeholder.com/200/6A4C93/FFFFFF?text=MJ"
        },
        {
            id: 4,
            name: "Sarah Williams",
            role: "Product Manager",
            email: "sarah.williams@example.com",
            linkedin: "https://linkedin.com/in/sarahwilliams",
            image: "https://via.placeholder.com/200/F39C12/FFFFFF?text=SW"
        }
    ];

    const biography = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
    ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit 
    in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat 
    non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis 
    unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
    eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. 
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur 
    magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum 
    quia dolor sit amet consectetur adipisci velit.`;

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
                                        {biography}
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