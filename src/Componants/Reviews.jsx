import React, { useEffect, useState, useContext } from "react";
import ReactStars from "react-stars";
import { TailSpin, ThreeDots } from "react-loader-spinner";
import swal from "sweetalert";
import { addDoc, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { db, movieRef, reviewRef, auth } from "../Firebase/FirebaseConfig.jsx"; // Correct import
import { appState } from "../App.jsx";
// import { onAuthStateChanged } from "firebase/auth";

const Reviews = ({ id, previousRating, userRated }) => {
  const { login } = useContext(appState);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [form, setForm] = useState("");
  const [data, setData] = useState([]);
  const [movieGenre, setMovieGenre] = useState(""); // State for movie genre
  const [refreshReviews, setRefreshReviews] = useState(false);

  useEffect(() => {
    const fetchMovieGenre = async () => {
      const movieDocRef = doc(db, "movies", id);
      const movieDoc = await getDoc(movieDocRef);
      if (movieDoc.exists()) {
        // Assuming genre is an array
        setMovieGenre(movieDoc.data().genre.join(", "));
      }
    };

    fetchMovieGenre();
  }, [id]);

  const sendReview = async () => {
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
      // Use auth.currentUser to get the current user
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        const userName = userDoc.exists() ? userDoc.data().name : "Anonymous";

        // Include the user's name in the review document
        await addDoc(reviewRef, {
          movieId: id,
          rating: rating,
          thoughts: form,
          timestamp: new Date().getTime(),
          userName: userName, // Include the user's name
        });
        swal({
          title: "Review Sent",
          icon: "success",
          buttons: true,
          dangerMode: true,
          timer: "3000",
        });
        setRefreshReviews(true);
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

  useEffect(() => {
    const getReviews = async () => {
      setReviewsLoading(true);
      let myQuery = query(reviewRef, where("movieId", "==", id));
      const querySnapShot = await getDocs(myQuery);
      const reviews = [];
      querySnapShot.forEach((doc) => {
        reviews.push(doc.data());
      });
      setData(reviews);
      setReviewsLoading(false);
    };
    getReviews();
  }, [id, refreshReviews]);

  return (
    <div className="mt-4 w-full bg-gray-800 p-6 rounded-lg text-white">
      <p className="text-lg font-bold mb-4 text-blue-500">
        Genre: {movieGenre} {/* Display the movie genre here */}
      </p>
      <ReactStars
        size={40}
        half={true}
        value={rating}
        onChange={(rate) => setRating(rate)}
        color2="#0070f3" // Custom color for stars
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
          {loading ? <TailSpin height={25} color="white" /> : "Share"}
        </button>
      </div>
      {reviewsLoading ? (
        <div className="mt-6 flex justify-center items-center">
          <ThreeDots height={10} color="white" />
        </div>
      ) : (
        <div className="mt-4">
          {data.map((element, index) => (
            <div key={index} className="p-4 bg-gray-700 rounded-lg mt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-500">{element.userName}</p>{" "}
                  {/* Display the user's name */}
                  <p className="text-xs text-gray-500">
                    ({new Date(element.timestamp).toLocaleString()})
                  </p>
                </div>
                <ReactStars
                  size={20}
                  half={true}
                  value={element.rating}
                  edit={false}
                  color2="#0070f3" // Custom color for stars
                />
              </div>
              <p className="mt-2 text-gray-300">{element.thoughts}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;
