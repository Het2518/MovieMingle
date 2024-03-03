import React, { useState, useContext } from "react";
import { addDoc } from "firebase/firestore";
import { movieRef } from "../Firebase/FirebaseConfig.jsx";
import swal from "sweetalert";
import { appState } from "../App.jsx";
import { useNavigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";

function AddMovie() {
    const { login } = useContext(appState);
    const [formData, setFormData] = useState({
        title: "",
        releaseYear: "",
        genre: [],
        description: "",
        image: "",
        rated: 0,
        rating: 0,
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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
            navigate("/");
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
        <div className="bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="bg-gray-800 text-white rounded-lg shadow-md p-8 max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-6">Add Movie</h2>
                <form onSubmit={addMovie}>
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="block text-gray-400 font-bold mb-2"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full bg-gray-700 bg-opacity-50 rounded border border-gray-600 focus:border-blue-500 focus:bg-gray-800 focus:ring-2 focus:ring-blue-300 text-white outline-none py-2 px-4 transition-colors duration-200 ease-in-out"
                            required
                        />
                    </div>
                    <div className="flex flex-wrap -mx-2">
                        <div className="w-1/2 px-2 mb-4">
                            <label
                                htmlFor="releaseYear"
                                className="block text-gray-400 font-bold mb-2"
                            >
                                Release Year
                            </label>
                            <input
                                type="text"
                                id="releaseYear"
                                name="releaseYear"
                                value={formData.releaseYear}
                                onChange={handleChange}
                                className="w-full bg-gray-700 bg-opacity-50 rounded border border-gray-600 focus:border-blue-500 focus:bg-gray-800 focus:ring-2 focus:ring-blue-300 text-white outline-none py-2 px-4 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>
                        <div className="w-1/2 px-2 mb-4">
                            <label
                                htmlFor="genre"
                                className="block text-gray-400 font-bold mb-2"
                            >
                                Genre
                            </label>
                            <input
                                type="text"
                                id="genre"
                                name="genre"
                                value={formData.genre.join(", ")}
                                onChange={handleGenreChange}
                                className="w-full bg-gray-700 bg-opacity-50 rounded border border-gray-600 focus:border-blue-500 focus:bg-gray-800 focus:ring-2 focus:ring-blue-300 text-white outline-none py-2 px-4 transition-colors duration-200 ease-in-out"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="description"
                            className="block text-gray-400 font-bold mb-2"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full bg-gray-700 bg-opacity-50 rounded border border-gray-600 focus:border-blue-500 focus:bg-gray-800 focus:ring-2 focus:ring-blue-300 text-white outline-none py-2 px-4 resize-none h-32 transition-colors duration-200 ease-in-out"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="image"
                            className="block text-gray-400 font-bold mb-2"
                        >
                            Image URL
                        </label>
                        <input
                            type="text"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="w-full bg-gray-700 bg-opacity-50 rounded border border-gray-600 focus:border-blue-500 focus:bg-gray-800 focus:ring-2 focus:ring-blue-300 text-white outline-none py-2 px-4 transition-colors duration-200 ease-in-out"
                        />
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-bold rounded-lg text-base px-6 py-3 transition-colors duration-200 ease-in-out"
                        >
                            {loading ? (
                                <TailSpin color="white" height={24} />
                            ) : (
                                "Add Movie"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddMovie;