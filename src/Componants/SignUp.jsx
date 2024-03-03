import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import GoogleIcon from '../assets/google-color-svgrepo-com.svg';
import TwitterIcon from '../assets/twitter-svgrepo-com.svg';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithPopup,
    TwitterAuthProvider,
    GoogleAuthProvider
} from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import app from '../Firebase/FirebaseConfig.jsx';
import Cookies from 'js-cookie';

const provider = new GoogleAuthProvider();
const provider2 = new TwitterAuthProvider();
const auth = getAuth(app);
const db = getFirestore(app);

function Signup() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        setGeneralError(""); // Reset general error
        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }
        if (password.length < 8) {
            setPasswordError("Password must be at least 8 characters long");
            return;
        }
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("User signed up:", userCredential.user);
            await uploadDataToFirestore(userCredential.user);
            Cookies.set('userID', userCredential.user.uid, { expires: 7 });
            navigate('/');
        } catch (error) {
            console.error("Error signing up:", error);
            setGeneralError(error.message); // Display general error message to user
        } finally {
            setLoading(false);
        }
    };

    const uploadDataToFirestore = async (user, name) => {
        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                name: name, // Use the name passed to the function
                email: user.email, // Assuming user.email is available
                // Do not store passwords in Firestore
            });
            console.log("User data uploaded to Firestore successfully");
        } catch (error) {
            console.error("Error uploading user data to Firestore:", error);
        }
    };
    

    const signupWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            console.log("User signed in with Google:", result.user);
            // Use the displayName from the user object
            await uploadDataToFirestore(result.user, result.user.displayName);
            navigate('/');
        } catch (error) {
            console.error("Error signing in with Google:", error);
            setGeneralError("Error signing in with Google: " + error.message);
        }
    }
    
    const signupWithTwitter = async () => {
        try {
            const result = await signInWithPopup(auth, provider2);
            console.log("User signed in with Twitter:", result.user);
            // Use the displayName from the user object
            await uploadDataToFirestore(result.user, result.user.displayName);
            navigate('/');
        } catch (error) {
            console.error("Error signing in with Twitter:", error);
            setGeneralError("Error signing in with Twitter: " + error.message);
        }
    }
    

    return (
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 mt-10 lg:px-8 bg-gray-800 text-white">
            <div className="text-center font-bold text-2xl">Sign up</div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-700 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSignUp}>
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">
                                Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-900 text-white"
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-900 text-white"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-900 text-white"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium">
                                Confirm Password
                            </label>
                            <div className="mt-1">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-900 text-white"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                />
                            </div>
                        </div>

                        {passwordError && <p className="text-red-500 text-xs italic">{passwordError}</p>}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                {loading ? "Loading..." : "Sign Up"}
                            </button>
                        </div>
                    </form>
                    {generalError && <p className="text-red-500 text-xs italic">{generalError}</p>}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"/>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-gray-700 text-gray-500">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3 items-center">
                            <div>
                                <button
                                    onClick={signupWithGoogle}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-500 hover:bg-gray-600"
                                >
                                    <span className="sr-only">Sign in with Google</span>
                                    <img src={GoogleIcon} alt="Google Sign In" className="w-5 h-5"/>
                                </button>
                            </div>

                            <div>
                                <button
                                    onClick={signupWithTwitter}
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-500 hover:bg-gray-600"
                                >
                                    <span className="sr-only">Sign in with Twitter</span>
                                    <img src={TwitterIcon} alt="Twitter Sign In" className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        Already have an account?
                        <Link
                            to="/login"
                            className="text-indigo-600 hover:text-indigo-500"
                        >
                            {" "} Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
