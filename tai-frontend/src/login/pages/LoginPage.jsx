import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../auth/firebase';
import { NavBar } from '../../shared/components/NavBar';
import { useUser } from '../../store/user-store';
import { AuthModal } from '../modals/AuthModal'; 
import '../../App.css'; 
import { contentSections, subTitle } from '../constants/content'; 

const LoginPage = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const sectionsRef = useRef([]); 
    const heroRef = useRef(null);
    const subtitleRef = useRef(null);
    const buttonRef = useRef(null);
    const sectionHeaderRef = useRef(null);

    const [loginError, setLoginError] = useState('');
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();
    const [{ user }, { setUser }] = useUser();

    useEffect(() => {
        // Animate hero elements on load
        const animateHeroElements = () => {
            if (heroRef.current) {
                setTimeout(() => {
                    heroRef.current.classList.add('animate-in');
                }, 100);
            }
            if (subtitleRef.current) {
                setTimeout(() => {
                    subtitleRef.current.classList.add('animate-in');
                }, 400);
            }
            if (buttonRef.current) {
                setTimeout(() => {
                    buttonRef.current.classList.add('animate-in');
                }, 700);
            }
            if (sectionHeaderRef.current) {
                setTimeout(() => {
                    sectionHeaderRef.current.classList.add('animate-in');
                }, 1000);
            }
        };

        animateHeroElements();

        // Intersection Observer for scroll sections
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                        entry.target.classList.remove('opacity-0', 'translate-y-10');
                    }
                });
            },
            { 
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        sectionsRef.current.forEach((el) => {
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const handleAuthEmailPasswordLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            setLoginError("Please fill in all fields");
            return;
        } 
        if (!selectedRole) {
            setLoginError("Please select a role");
            return;
        }

        setIsLoginLoading(true); 
        setLoginError("");

        try {
            const userCredentials = await signInWithEmailAndPassword(auth, email, password); 
            const idToken = await userCredentials.user.getIdToken();    
            await localStorage.setItem('authToken', idToken);   
            console.log("userCredentials", userCredentials);

            await setUser({
                id: userCredentials.user.uid,
                name: userCredentials.user.displayName,
                role: selectedRole,
                email: userCredentials.user.email,   
                token: idToken
            }); 
            
            setIsAuthModalOpen(false);
            navigate('/home');
        } catch (error) {
            console.error(error);
            setLoginError("Invalid email or password. Please try again.");
        } finally {
            setIsLoginLoading(false);
        }
    }; 

    const handleAuthGoogleLogin = async () => {
        setIsLoginLoading(true);
        setLoginError("");
        try {
            await signInWithPopup(auth, googleProvider);
            setIsAuthModalOpen(false);
            navigate('/home');
        } catch (error) {
            console.error(error);
            setLoginError("Failed to sign in with Google. Please try again.");
        } finally {
            setIsLoginLoading(false);
        }
    };

    const handleCloseAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    const handleLoginClick = () => { 
        setIsAuthModalOpen(true);
    };

    return (
        <>
            <div className="h-screen w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient flex flex-col items-center justify-start overflow-y-auto relative">
                
                {/* Subtle Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
                    <div className="absolute top-80 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
                </div>

                {/* Hero Section */}
                <section className="pt-32 pb-16 text-center w-3/4 relative z-10">
                    <div className="max-w-2xl mx-auto">
                        {/* Main Title */}
                        <div 
                            ref={heroRef}
                            className="opacity-0 translate-y-8 transition-all duration-1000 ease-out mb-8"
                        >
                            <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 leading-tight">
                                Welcome to Teaching
                                <br />
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Revolutionalized
                                </span>
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <div 
                            ref={subtitleRef}
                            className="opacity-0 translate-y-8 transition-all duration-1000 ease-out mb-10"
                        >
                            <p className="text-lg text-gray-700 font-nunito leading-relaxed">
                                {subTitle}
                            </p>
                        </div>

                        {/* CTA Button */}
                        <div 
                            ref={buttonRef}
                            className="opacity-0 translate-y-8 transition-all duration-1000 ease-out"
                        >
                            <button 
                                type="button" 
                                className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                onClick={handleLoginClick}
                            >
                                Login to Learn
                            </button>
                        </div>
                    </div>
                </section>

                {/* Content Sections with Scroll Reveal */}
                <section className="w-full bg-white py-20 relative z-10">
                    <div className="max-w-4xl mx-auto px-4">
                        {/* Section Header */}
                        <div 
                            ref={sectionHeaderRef}
                            className="text-center mb-12 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
                        >
                            <h2 className="text-3xl font-bold mb-4">The Future of Education</h2>
                        </div>

                        {contentSections.map((section, i) => (
                            <div
                                key={i}
                                ref={el => sectionsRef.current[i] = el}
                                className="opacity-0 translate-y-10 transition-all duration-700 ease-out mb-16 text-center"
                            >
                                <h3 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h3>
                                <p className="text-lg text-gray-700 leading-relaxed">{section.content}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={handleCloseAuthModal}
                role={selectedRole}
                onAuthEmailPasswordLogin={handleAuthEmailPasswordLogin}
                onAuthGoogleLogin={handleAuthGoogleLogin} 
                loginError={loginError}
                isLoginLoading={isLoginLoading}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe} 
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
            />

            <style jsx>{`
                .animate-in {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
                
                .fade-in-up {
                    opacity: 1 !important;
                    transform: translateY(0) !important;
                }
                
                @keyframes scrollGradient {
                    0% { background-position: 0% 0%; }
                    50% { background-position: 0% 100%; }
                    100% { background-position: 0% 0%; }
                }
                
                .animate-scrollGradient {
                    animation: scrollGradient 10s ease-in-out infinite;
                }
            `}</style>
        </>
    );
};

export default LoginPage;
