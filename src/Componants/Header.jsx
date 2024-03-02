import React, { useContext } from "react";
import { Button } from "@mui/material";
import { BiMessageRoundedAdd } from "react-icons/bi";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { appState } from "../App.jsx";
import { auth } from "../Firebase/FirebaseConfig.jsx";
import swal from "sweetalert";

const Header = () => {
  const { login, setLogin } = useContext(appState);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLogin(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAddMovieClick = () => {
    if (!login) {
      swal({
        title: "Please log in first",
        icon: "warning",
        button: true,
      });
    } else {
      navigate("/addmovie");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-300"
        >
          Movie<span className="text-blue-200">Mingle</span>
        </Link>

        <div className="flex items-center space-x-4">
          <Button
            onClick={handleAddMovieClick}
            className="text-lg text-white bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-md"
            aria-label="Add Movie"
          >
            <BiMessageRoundedAdd className="mr-1" />
            Add Movie
          </Button>

          {login ? (
            <Button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-500 dark:hover:bg-red-600 px-4 py-2 rounded-md"
              aria-label="Logout"
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-500 dark:hover:bg-blue-600 px-4 py-2 rounded-md"
              aria-label="Login"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
