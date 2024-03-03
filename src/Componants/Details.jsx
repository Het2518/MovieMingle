import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
import { useParams } from "react-router-dom";
import { getDoc, doc, query, where, getDocs } from "firebase/firestore";
import { db, reviewRef } from "../Firebase/FirebaseConfig.jsx";
import { ThreeCircles } from "react-loader-spinner";
import Reviews from "./Reviews.jsx";

const Details = () => {
  const { id } = useParams();
  const [data, setData] = useState({
    title: "",
    releaseYear: "",
    image: "",
    description: "",
    rating: 0,
    rated: 0,
  });
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      try {
        console.log("Fetching movie details for ID:", id);
        const movieDoc = doc(db, "movies", id);
        const movieData = await getDoc(movieDoc);
        if (movieData.exists()) {
          setData(movieData.data());
        } else {
          console.log("No such document with ID:", id);
          setError("No such document!");
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError("Error fetching movie details.");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  useEffect(() => {
    const calculateAverageRating = async () => {
      setLoading(true);
      try {
        let myQuery = query(reviewRef, where("movieId", "==", id));
        const querySnapShot = await getDocs(myQuery);
        let totalRating = 0;
        let rated = 0;
        querySnapShot.forEach((doc) => {
          totalRating += doc.data().rating;
          rated++;
        });
        const average = rated > 0 ? totalRating / rated : 0;
        setAverageRating(average);
      } catch (error) {
        console.error("Error calculating average rating:", error);
        setError("Error calculating average rating.");
      } finally {
        setLoading(false);
      }
    };

    calculateAverageRating();
  }, [id]);

  if (loading) {
    return (
        <div className="flex justify-center items-center w-full h-screen">
          <ThreeCircles height={40} color="white" />
        </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
      <div className="container mx-auto py-8">
        <div className="md:flex md:flex-row md:items-center md:justify-center">
          <div className="md:w-1/3 mb-8 md:mb-0">
            <img
                src={data.image}
                alt={`${data.title} movie poster`}
                className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="md:w-2/3 md:ml-8">
            <h1 className="text-3xl font-bold text-gray-400 mb-2">
              {data.title} <span className="text-xl">({data.releaseYear})</span>
            </h1>
            <div className="flex items-center mb-4">
              <ReactStars
                  size={24}
                  edit={false}
                  half={true}
                  value={averageRating}
              />
              <span className="text-gray-400 ml-2">
              ({averageRating.toFixed(1)})
            </span>
            </div>
            <p className="text-gray-400 mb-6">{data.description}</p>
            <Reviews id={id} previousRating={data.rating} userRated={data.rated} />
          </div>
        </div>
      </div>
  );
};

export default Details;