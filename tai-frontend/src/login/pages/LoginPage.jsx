import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../auth/firebase';
import { TitleCard } from '../../shared/components/TitleCard';
import { useUser } from '../../store/user-store';
import { AuthModal } from '../modals/AuthModal'; 
import '../../App.css'; 
import { contentSections, subTitle } from '../constants/content'; 

const LoginPage = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('');
    const sectionsRef = useRef([]); 
    const [loginError, setLoginError] = useState('');
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();
    const [{ user }, { setUser }] = useUser();

    useEffect(() => {
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
            console.log('ID Token:', idToken);
            console.log('User:', userCredentials);
            localStorage.setItem('authToken', idToken); 
            setUser({
                id: userCredentials.user.uid,
                name: userCredentials.user.displayName,
                role: selectedRole,
                email: userCredentials.user.email,  

            }); 
            
            console.log('User in local store ', user);

            // TODO: Set user in global state
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
            // TODO: Set user in global state
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
        //TODO help with this
        setIsAuthModalOpen(true);
    };


    return (
        <>
            <div className="h-screen w-screen bg-gradient-to-b from-blue-200 via-green-200 to-blue-200 bg-[length:100%_200%] animate-scrollGradient flex flex-col items-center justify-start overflow-y-auto">
                {/* Hero Section */}
                <section className="pt-32 pb-16 text-center w-3/4">
                    Welcome to Teaching Revolutionalized
                    <p className="text-lg text-gray-700 font-nunito mt-6 mb-10 max-w-2xl mx-auto">
                        {subTitle}
                    </p>
                    
                    {/* Single Login Button */}
                    <button 
                        type="button" 
                        className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        onClick={handleLoginClick}
                    >
                        Login to Learn
                    </button>
                </section>

                {/* Content Sections with Scroll Reveal */}
                <section className="w-full bg-white py-20">
                    <div className="max-w-4xl mx-auto px-4">
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