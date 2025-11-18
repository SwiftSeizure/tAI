import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    signInWithEmailAndPassword, 
    signInWithPopup,
    createUserWithEmailAndPassword, 
    updateProfile, 
    setPersistence, 
    browserLocalPersistence
} from 'firebase/auth';
import { auth, googleProvider } from '../../auth/firebase';
import { useUser } from '../../store/user-store';
import { AuthModal } from '../modals/AuthModal'; 
import '../../App.css'; 
import { contentSections, subTitle } from '../constants/content';  
import { getUserType } from '../services/get-user-type';

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
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');

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

        setIsLoginLoading(true); 
        setLoginError("");

        try {
            // Set persistence to LOCAL before signing in
            await setPersistence(auth, browserLocalPersistence);
            
            const userCredentials = await signInWithEmailAndPassword(auth, email, password); 
            const idToken = await userCredentials.user.getIdToken();    
            
            const userRole = await getUserType();

            await setUser({
                id: userCredentials.user.uid,
                name: userCredentials.user.displayName,
                role: userRole,
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

    // In your LoginPage.jsx, add a flag to prevent duplicate calls

const handleAuthEmailPasswordSignup = async (e) => {
    e.preventDefault();
    if (!email || !password || !fullName || !username || !selectedRole) {
        setLoginError("Please fill in all fields and select a role");
        return;
    }

    setIsLoginLoading(true);
    setLoginError("");

    try {
        // Store the selected role and user info in localStorage temporarily
        localStorage.setItem('pendingUserRole', selectedRole);
        localStorage.setItem('pendingUserFullName', fullName);
        localStorage.setItem('pendingUserUsername', username);
        
        // Set a flag to indicate we're in the middle of signup
        // This can be checked by your App.js auth listener to avoid duplicate calls
        localStorage.setItem('isSigningUp', 'true');

        // Create Firebase account
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);

        // Update the user's display name
        await updateProfile(userCredentials.user, {
            displayName: fullName
        });

        const idToken = await userCredentials.user.getIdToken();

        // Use getUserType which will create the account and wait until it's ready
        const userRole = await getUserType();

        // Clean up temporary storage
        localStorage.removeItem('pendingUserRole');
        localStorage.removeItem('pendingUserFullName');
        localStorage.removeItem('pendingUserUsername');
        localStorage.removeItem('isSigningUp'); // Remove the flag

        await setUser({
            id: userCredentials.user.uid,
            name: fullName,
            role: userRole,
            email: userCredentials.user.email,
            token: idToken
        }); 

        await setPersistence(auth, browserLocalPersistence);

        setIsAuthModalOpen(false);
        navigate('/home');
    } catch (error) {
        console.error("Signup error:", error);
        // Clean up temporary storage on error
        localStorage.removeItem('pendingUserRole');
        localStorage.removeItem('pendingUserFullName');
        localStorage.removeItem('pendingUserUsername');
        localStorage.removeItem('isSigningUp'); // Remove the flag

        if (error.code === 'auth/email-already-in-use') {
            setLoginError("An account with this email already exists.");
        } else if (error.code === 'auth/weak-password') {
            setLoginError("Password should be at least 6 characters.");
        } else if (error.message && error.message.includes('Failed to create user account')) {
            setLoginError("Account creation failed. Please try again or contact support.");
        } else {
            setLoginError("Failed to create account. Please try again.");
        }
    } finally {
        setIsLoginLoading(false);
    }
};

// Do the same for Google signup
const handleAuthGoogleSignup = async () => {
    if (!selectedRole) {
        setLoginError("Please select whether you're a student or teacher first.");
        return;
    }

    setIsLoginLoading(true);
    setLoginError("");

    try {
        // Set persistence to LOCAL before signing in
        await setPersistence(auth, browserLocalPersistence);
        
        // Set a flag to indicate we're in the middle of signup
        localStorage.setItem('isSigningUp', 'true');

        const userCredentials = await signInWithPopup(auth, googleProvider);
        const idToken = await userCredentials.user.getIdToken();

        const displayName = userCredentials.user.displayName || userCredentials.user.email?.split('@')[0] || 'User';
        const username = userCredentials.user.email?.split('@')[0] || `user_${Date.now()}`;

        // Store the selected role and user info for getUserType to use
        localStorage.setItem('pendingUserRole', selectedRole);
        localStorage.setItem('pendingUserFullName', displayName);
        localStorage.setItem('pendingUserUsername', username);

        // Use getUserType which will create the account and wait until it's ready
        const userRole = await getUserType();

        // Clean up temporary storage
        localStorage.removeItem('pendingUserRole');
        localStorage.removeItem('pendingUserFullName');
        localStorage.removeItem('pendingUserUsername');
        localStorage.removeItem('isSigningUp'); // Remove the flag

        await setUser({
            id: userCredentials.user.uid,
            name: displayName,
            role: userRole,
            email: userCredentials.user.email,
            token: idToken,
            profilePicture: userCredentials.user.photoURL
        });

        setIsAuthModalOpen(false);
        navigate('/home');
    } catch (error) {
        console.error("Google signup error:", error);
        // Clean up temporary storage on error
        localStorage.removeItem('pendingUserRole');
        localStorage.removeItem('pendingUserFullName');
        localStorage.removeItem('pendingUserUsername');
        localStorage.removeItem('isSigningUp'); // Remove the flag

        if (error.message && error.message.includes('Failed to create user account')) {
            setLoginError("Account creation failed. Please try again or contact support.");
        } else {
            setLoginError("Failed to sign up with Google. Please try again.");
        }
    } finally {
        setIsLoginLoading(false);
    }
};

    const handleAuthGoogleLogin = async () => {
        setIsLoginLoading(true);
        setLoginError("");
        try {
            // Set persistence to LOCAL before signing in
            await setPersistence(auth, browserLocalPersistence);
            
            const userCredentials = await signInWithPopup(auth, googleProvider);
            const idToken = await userCredentials.user.getIdToken();    
            const userRole = await getUserType();

            await setUser({
                id: userCredentials.user.uid,
                name: userCredentials.user.displayName,
                role: userRole,
                email: userCredentials.user.email,   
                token: idToken,
                profilePicture: userCredentials.user.photoURL
            });
            
            setIsAuthModalOpen(false);
            navigate('/home');
        } catch (error) {
            console.error(error);
            setIsLoginLoading(false);
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
           <div className="min-h-screen w-full flex flex-col items-center justify-start overflow-y-auto relative gradient-bg">
                
                {/* Subtle Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-100 rounded-full opacity-30 blur-3xl"></div>
                    <div className="absolute top-80 -left-40 w-80 h-80 bg-blue-100 rounded-full opacity-30 blur-3xl"></div>
                </div>

                {/* Hero Section */}
                <section className="pt-32 pb-20 text-center w-full max-w-4xl px-6 relative z-10">
                    <div className="max-w-3xl mx-auto">
                        {/* Main Title */}
                        <div 
                            ref={heroRef}
                            className="opacity-0 translate-y-8 transition-all duration-1000 ease-out mb-6"
                        >
                            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-4">
                                Welcome to Teaching
                                <br />
                                <span
                                    className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 animate-gradient"
                                >
                                    Revolutionalized
                                </span>
                            </h1>
                        </div>

                        {/* Subtitle */}
                        <div 
                            ref={subtitleRef}
                            className="opacity-0 translate-y-8 transition-all duration-1000 ease-out mb-12"
                        >
                            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
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
                                className="relative px-20 py-7 text-2xl font-semibold rounded-2xl 
                                     transition-all duration-300 hover:scale-105
                                     w-full
                                     border border-blue-400/50
                                     hover:border-2 hover:border-blue-400
                                     hover:bg-gradient-to-r 
                                     hover:from-blue-400/10 hover:via-cyan-400/10 hover:to-blue-600/10
                                     group"
                                onClick={handleLoginClick}
                            >
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 animate-gradient group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:via-cyan-500 group-hover:to-blue-700 text-4xl">
                                    Get Started
                                </span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Content Sections with Scroll Reveal */}
                <section className="w-full py-20 relative z-10">
                    <div className="max-w-4xl mx-auto px-6">
                        {/* Section Header */}
                        <div 
                            ref={sectionHeaderRef}
                            className="text-center mb-16 opacity-0 translate-y-8 transition-all duration-1000 ease-out"
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">The Future of Education</h2>
                            <p className="text-gray-700">Discover what makes our platform different</p>
                        </div>

                        <div className="space-y-16">
                            {contentSections.map((section, i) => (
                                <div
                                    key={i}
                                    ref={el => sectionsRef.current[i] = el}
                                    className="opacity-0 translate-y-10 transition-all duration-700 ease-out text-center bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg"
                                >
                                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{section.title}</h3>
                                    <p className="text-lg text-gray-700 leading-relaxed">{section.content}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="w-full py-6 bg-gray-200 border-t border-gray-200">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <p className="text-sm text-gray-500">
                            © 2025 TAi. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={handleCloseAuthModal}
                onAuthEmailPasswordLogin={handleAuthEmailPasswordLogin}
                onAuthGoogleLogin={handleAuthGoogleLogin}
                onAuthEmailPasswordSignup={handleAuthEmailPasswordSignup}
                onAuthGoogleSignup={handleAuthGoogleSignup}
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
                fullName={fullName}
                setFullName={setFullName}
                username={username}
                setUsername={setUsername}
            />
        <style jsx>{`
            .gradient-bg {
                background: linear-gradient(-45deg, #add8e6, #f9c7cfff,rgba(170, 241, 170, 1), #add8e6);
                background-size: 400% 400%;
                animation: gradientCycle 20s ease infinite;
            }
            
            @keyframes gradientCycle {
                0% {
                    background-position: 0% 50%;
                }
                25% {
                    background-position: 50% 100%;
                }
                50% {
                    background-position: 100% 50%;
                }
                75% {
                    background-position: 50% 0%;
                }
                100% {
                    background-position: 0% 50%;
                }
            }
            
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
            
            .fade-in-up {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }

            .animate-gradient {
                animation: gradientShift 15s ease-in-out infinite;
            }

            @keyframes gradientShift {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
            } 
            @keyframes borderMove {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `}</style>

        </>
    );
};

export default LoginPage;