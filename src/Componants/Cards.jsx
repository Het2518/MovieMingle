import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import { Link } from "react-router-dom";
import { getDocs, collection, query, where, doc } from "firebase/firestore";
import { db, movieRef } from "../Firebase/FirebaseConfig"; // Ensure movieRef is correctly imported
import { ThreeDots } from "react-loader-spinner";

const Cards = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetching movies using movieRef (which is a reference to the "movies" collection)
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
              id: movieDoc.id, // Ensure the movie ID is included in the returned object
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
      <div className="flex justify-center items-center w-full h-96">
        <ThreeDots color="white" height={40} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {movies.map((movie, index) => (
        <Link to={`/details/${movie.id}`} key={index}>
          <div className="card shadow-lg p-4 hover:-translate-y-2 cursor-pointer hover:shadow-2xl transition-all duration-300 ease-in-out bg-gray-800 text-white rounded-lg">
            <div className="relative overflow-hidden rounded-lg">
              <img
                className="object-cover w-full h-72 rounded-lg"
                src={movie.image}
                alt="poster"
              />
            </div>

            <div className="mt-4">
              <h1 className="text-xl font-bold">
                {movie.title} ({movie.releaseYear})
              </h1>

              <div className="flex items-center mt-2">
                <span className="text-gray-400 mr-2">
                  Average Rating: {movie.averageRating.toFixed(1)}
                </span>
                <ReactStars
                  half={true}
                  size={20}
                  value={movie.averageRating}
                  count={5}
                  edit={false}
                />
              </div>

              <div className="mt-2">
                <span className="text-gray-400">Rated by: </span>
                <span>{movie.rated} people</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Cards;
