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
  const [averageRating, setAverageRating] = useState(0); // State for average rating
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

useEffect(() => {
 const fetchMovieDetails = async () => {
    setLoading(true);
    try {
      console.log("Fetching movie details for ID:", id); // Debugging statement
      const movieDoc = doc(db, "movies", id);
      const movieData = await getDoc(movieDoc);
      if (movieData.exists()) {
        setData(movieData.data());
      } else {
        console.log("No such document with ID:", id); // Debugging statement
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
      <div className="flex justify-center items-center w-full h-96">
        <ThreeCircles height={40} color="white" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-4 m-4 flex flex-col md:flex-row items-center md:items-start w-full justify-center">
      <img
        src={data.image}
        alt={`${data.title} movie poster`}
        className="h-96 block md:sticky top-24"
      />
      <div className="md:ml-4 ml-0 w-full md:w-1/2">
        <h1 className="text-3xl font-bold text-gray-400">
          {data.title} <span className="text-xl">({data.releaseYear})</span>
        </h1>
        <ReactStars
          size={24}
          edit={false}
          half={true}
          value={averageRating} // Use the calculated average rating
        />
        <p className="mt-2">{data.description}</p>

        <Reviews id={id} previousRating={data.rating} userRated={data.rated} />
      </div>
    </div>
  );
};

export default Details;
