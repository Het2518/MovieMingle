import React, { useState, useContext } from "react";
import { addDoc } from "firebase/firestore";
import { movieRef } from "../Firebase/FirebaseConfig.jsx";
import swal from "sweetalert";
import { appState } from "../App.jsx"; // Import appState context
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { TailSpin } from "react-loader-spinner";

function AddMovie() {
 const { login } = useContext(appState); // Use login state from context
 const [formData, setFormData] = useState({
    title: "",
    releaseYear: "",
    genre: [], // Assuming genre is an array
    description: "",
    image: "",
    rated: 0,
    rating: 0,
 });
 const [loading, setLoading] = useState(false);
 const navigate = useNavigate(); // Initialize useNavigate

 const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
 };

 const handleGenreChange = (e) => {
  const genres = e.target.value.split(",").map((genre) => genre.trim());
  setFormData({
     ...formData,
     genre: genres,
  });
 };
 

 const validateForm = () => {
    if (
      !formData.title ||
      !formData.releaseYear ||
      !formData.genre.length ||
      !formData.description
    ) {
      swal({
        title: "Please fill out all required fields",
        icon: "warning",
        button: true,
      });
      return false;
    }
    return true;
 };

 const addMovie = async (e) => {
    e.preventDefault();
    if (!login) {
      swal({
        title: "Please log in first",
        icon: "warning",
        button: true,
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const movieData = { ...formData };
      console.log("Adding movie:", movieData);
      const docRef = await addDoc(movieRef, movieData);
      console.log("Movie added with ID:", docRef.id);

      swal({
        title: "Successfully Added",
        icon: "success",
        button: false,
        timer: 3000,
      });
      setFormData({
        title: "",
        releaseYear: "",
        genre: [],
        description: "",
        image: "",
        rated: 0,
        rating: 0,
      });
      // Redirect to home page
      navigate('/'); // Assuming '/' is your home page route
    } catch (error) {
      console.error("Error adding movie: ", error);
      swal({
        title: "Error",
        icon: "error",
        button: false,
        timer: 3000,
      });
    } finally {
      setLoading(false);
    }
 };

  return (
    <div className="bg-gray-900 text-white">
      <section className="text-gray-300 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="title"
                    className="leading-7 text-sm text-gray-400"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-300 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    htmlFor="releaseYear"
                    className="leading-7 text-sm text-gray-400"
                  >
                    Release Year
                  </label>
                  <input
                    type="text"
                    id="releaseYear"
                    name="releaseYear"
                    value={formData.releaseYear}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-300 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    htmlFor="genre"
                    className="leading-7 text-sm text-gray-400"
                  >
                    Genre
                  </label>
                  <input
                    type="text"
                    id="genre"
                    name="genre"
                    value={formData.genre.join(", ")}
                    onChange={handleGenreChange}
                    className="w-full bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-300 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="description"
                    className="leading-7 text-sm text-gray-400"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-300 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    htmlFor="image"
                    className="leading-7 text-sm text-gray-400"
                  >
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-50 rounded border border-gray-700 focus:border-indigo-500 focus:bg-gray-900 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-300 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  type="button"
                  onClick={addMovie}
                  className="flex mx-auto text-white bg-indigo-500 border-0 py-2 px-8 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                >
                  {loading ? (
                    <TailSpin color="white" height={30} />
                  ) : (
                    "Add Movie"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AddMovie;
