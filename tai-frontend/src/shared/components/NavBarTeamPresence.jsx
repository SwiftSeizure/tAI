import React, { useState } from 'react';
import { Menu, X, Home, BookOpen, Users, Video, LogOut } from 'lucide-react';

export const NavBarTeamPresence = ({ title }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navigationLinks = [
        { name: 'Use Our App', href: '/' },
        { name: 'Tutorial', href: '/tutorial', icon: Video },
        { name: 'Team', href: '/team', icon: Users },
        { name: 'Members', href: '/members', icon: BookOpen },
    ];

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Title */}
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navigationLinks.map((link) => {  
                            const Icon = link.icon;

                            return (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 
                                             hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                >
                                    {Icon && <Icon className="w-4 h-4" />}
                                    <span>{link.name}</span>
                                </a>
                            );
                        })}
                        
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="flex flex-col space-y-2">
                            {navigationLinks.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 
                                                 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{link.name}</span>
                                    </a>
                                );
                            })}
                            
                            {/* Mobile Logout Button */}
                            <button
                                className="flex items-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg 
                                         hover:bg-red-700 transition-colors duration-200"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};