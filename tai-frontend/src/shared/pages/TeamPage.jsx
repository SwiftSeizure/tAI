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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute 
                            irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                            pariatur.
                        </p>
                        
                        <p>
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque 
                            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi 
                            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas 
                            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione 
                            voluptatem sequi nesciunt.
                        </p>
                        
                        <p>
                            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci 
                            velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam 
                            aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem 
                            ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.
                        </p>

                        <p>
                            Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil 
                            molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. 
                            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium 
                            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint 
                            occaecati cupiditate non provident.
                        </p>
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