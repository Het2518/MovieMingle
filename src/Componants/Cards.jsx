import React, {useEffect, useState} from "react";
import ReactStars from "react-stars";
import {Link} from "react-router-dom";
import {getDocs, collection, query, where} from "firebase/firestore";
import {db, movieRef} from "../Firebase/FirebaseConfig";
import {ThreeDots} from "react-loader-spinner";

const Cards = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const moviesSnapshot = await getDocs(movieRef);
                const moviesWithRatings = await Promise.all(
                    moviesSnapshot.docs.map(async (movieDoc) => {
                        const movieData = movieDoc.data();
                        const reviewsSnapshot = await getDocs(
                            query(
                                collection(db, "reviews"),
                                where("movieId", "==", movieDoc.id)
                            )
                        );
                        let totalRating = 0;
                        let rated = 0;
                        reviewsSnapshot.forEach((reviewDoc) => {
                            const reviewData = reviewDoc.data();
                            totalRating += reviewData.rating;
                            rated++;
                        });
                        const averageRating = rated > 0 ? totalRating / rated : 0;
                        return {
                            ...movieData,
                            averageRating,
                            rated,
                            id: movieDoc.id,
                        };
                    })
                );
                setMovies(moviesWithRatings);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-screen">
                <ThreeDots color="#E53935" height={80}/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500 text-xl font-bold text-center py-8">
                {error}
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {movies.map((movie, index) => (
                    <Link to={`/details/${movie.id}`} key={index} className="hover:no-underline">
                        <div
                            className="bg-gray-900 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105">
                            <div className="relative">
                                <img
                                    className="w-full h-48 object-cover"
                                    src={movie.image}
                                    alt="poster"
                                />
                                <div
                                    className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full font-bold text-sm">
                                    {movie.averageRating.toFixed(1)}
                                </div>
                            </div>
                            <div className="p-3">
                                <h1 className="text-base font-bold mb-1 text-white">
                                    {movie.title} ({movie.releaseYear})
                                </h1>
                                <div className="flex items-center mb-2  flex-wrap">
                                    <ReactStars
                                        half={true}
                                        size={16}
                                        value={movie.averageRating}
                                        count={5}
                                        edit={false}
                                        color2={"#E53935"}
                                    />
                                    <span className="text-gray-400 ml-2 text-xs">
                                        ({movie.rated} ratings)
                                    </span>
                                </div>
                                <div className="flex flex-wrap">
                                    {movie.genre.map((genre, index) => (
                                        <span
                                            key={index}
                                            className="bg-gray-800 text-gray-400 rounded-full px-2 py-1 mr-1 mb-1 text-xs"
                                        >
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Cards;