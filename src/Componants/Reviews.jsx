import React, { useEffect, useState, useContext } from "react";
import ReactStars from "react-stars";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import { addDoc, doc, getDoc, query, where, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
import { db, movieRef, reviewRef, auth } from "../Firebase/FirebaseConfig.jsx";
import { appState } from "../App.jsx";

const Reviews = ({ id }) => {
    const { login } = useContext(appState);
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [form, setForm] = useState("");
    const [data, setData] = useState([]);
    const [movieGenre, setMovieGenre] = useState("");
    const [refreshReviews, setRefreshReviews] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchMovieGenre = async () => {
            const movieDocRef = doc(db, "movies", id);
            const movieDoc = await getDoc(movieDocRef);
            if (movieDoc.exists()) {
                setMovieGenre(movieDoc.data().genre.join(", "));
            }
        };

        fetchMovieGenre();
    }, [id]);

    const sendReview = async (event) => {
        event.preventDefault();
        if (!login) {
            swal({
                title: "Please log in first",
                icon: "warning",
                button: true,
            });
            return;
        }
        if (form.trim().length < 5) {
            swal({
                title: "Your thoughts must be at least 5 characters long.",
                icon: "warning",
                button: true,
            });
            return;
        }
        setLoading(true);
        try {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                const userName = userDoc.exists() ? userDoc.data().name : "Anonymous";

                await addDoc(reviewRef, {
                    movieId: id,
                    rating: rating,
                    thoughts: form,
                    timestamp: new Date().getTime(),
                    userName: userName,
                    userId: user.uid,
                });
                swal({
                    title: "Review Sent",
                    icon: "success",
                    buttons: true,
                    dangerMode: true,
                    timer: "3000",
                });
                // Only set refreshReviews to true if necessary
                setRefreshReviews(prevState => !prevState);
            } else {
                swal({
                    title: "User not found",
                    icon: "error",
                    buttons: false,
                    timer: "3000",
                });
            }
        } catch (error) {
            swal({
                title: error.message,
                icon: "error",
                buttons: false,
                timer: "3000",
            });
        }
        setLoading(false);
    };


    const updateReview = async (reviewId, updatedReview) => {
        const user = auth.currentUser;
        if (user && user.uid === selectedReview.userId) {
            const reviewDocRef = doc(db, "reviews", reviewId);
            await updateDoc(reviewDocRef, updatedReview);
            swal({
                title: "Review Updated",
                icon: "success",
                buttons: true,
                dangerMode: true,
                timer: "3000",
            });
            // Update the local state to reflect the update
            setData(prevData => prevData.map(review => review.id === reviewId ? {...review, ...updatedReview} : review));
            setSelectedReview(null);
            setShowUpdateModal(false);
        } else {
            swal({
                title: "You can only update your own reviews.",
                icon: "error",
                buttons: false,
                timer: "3000",
            });
        }
    };


    const deleteReview = async (reviewId) => {
        if (!selectedReview) {
            swal({
                title: "No review selected for deletion.",
                icon: "error",
                buttons: false,
                timer: "3000",
            });
            return;
        }

        setIsDeleting(true);
        const user = auth.currentUser;
        if (user && user.uid === selectedReview.userId) {
            const reviewDocRef = doc(db, "reviews", reviewId);
            await deleteDoc(reviewDocRef);
            swal({
                title: "Review Deleted",
                icon: "success",
                buttons: true,
                dangerMode: true,
                timer: "3000",
            });
            // Update the local state to reflect the deletion
            setData(prevData => prevData.filter(review => review.id !== reviewId));
        } else {
            swal({
                title: "You can only delete your own reviews.",
                icon: "error",
                buttons: false,
                timer: "3000",
            });
        }
        setIsDeleting(false);
    };


    useEffect(() => {
        const getReviews = async () => {
            setReviewsLoading(true);
            let myQuery = query(reviewRef, where("movieId", "==", id));
            const querySnapShot = await getDocs(myQuery);
            const reviews = [];
            querySnapShot.forEach((doc) => {
                reviews.push({ id: doc.id, ...doc.data() });
            });
            setData(reviews);
            setReviewsLoading(false);
        };
        getReviews();
    }, [id, refreshReviews]);

    return (
        <div className="mt-4 w-full bg-gray-800 p-6 rounded-lg text-white">
            <p className="text-lg font-bold mb-4 text-blue-500">
                Genre: {movieGenre}
            </p>
            <ReactStars
                size={40}
                half={true}
                value={rating}
                onChange={(rate) => setRating(rate)}
                color2="#0070f3"
            />
            <textarea
                value={form}
                onChange={(e) => setForm(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full p-4 mt-4 outline-none resize-none rounded-lg bg-gray-700 text-white text-sm font-medium leading-tight"
                rows="4"
            />

            <div className="flex justify-center mt-4">
                <button
                    onClick={sendReview}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
                >
                    {loading ? <TailSpin height={25} color="white"/> : "Share"}
                </button>
            </div>
            {reviewsLoading ? (
                <div className="mt-6 flex justify-center items-center">
                    <ThreeDots height={10} color="white"/>
                </div>
            ) : (
                <div className="mt-4">
                    {data.map((element, index) => (
                        <div key={index} className="p-4 bg-gray-700 rounded-lg mt-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-blue-500">{element.userName}</p>
                                    <p className="text-xs text-gray-500">
                                        ({new Date(element.timestamp).toLocaleString()})
                                    </p>
                                </div>
                                <ReactStars
                                    size={20}
                                    half={true}
                                    value={element.rating}
                                    edit={false}
                                    color2="#0070f3"
                                />
                            </div>
                            <p className="mt-2 text-gray-300">{element.thoughts}</p>
                            {element.userId === auth.currentUser?.uid && (
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={() => {
                                            setSelectedReview(element);
                                            setShowUpdateModal(true);
                                        }}
                                        className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded transition duration-300 mr-2"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedReview(element);
                                            deleteReview(element.id);
                                        }}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded transition duration-300"
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            {showUpdateModal && (
                <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
                     aria-modal="true">
                    <div                         className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                             aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"
                              aria-hidden="true">&#8203;</span>
                        <div
                            className="inline-block align-bottom bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-300" id="modal-title">
                                            Update Your Review
                                        </h3>
                                        <div className="mt-2">
                                                <textarea
                                                    value={selectedReview?.thoughts || ''}
                                                    onChange={(e) => setSelectedReview({...selectedReview, thoughts: e.target.value})}
                                                    className="w-full p-2 mt-4 outline-none resize-none rounded-lg bg-gray-700 text-gray-300 text-sm font-medium leading-tight"
                                                    rows="4"
                                                />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                    onClick={() => updateReview(selectedReview.id, {thoughts: selectedReview.thoughts})}
                                >
                                    Update Review
                                </button>
                                <button
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-800 text-base font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                    onClick={() => setShowUpdateModal(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;

