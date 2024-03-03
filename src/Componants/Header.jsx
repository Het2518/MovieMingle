import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { appState } from "../App.jsx";
import { auth } from "../Firebase/FirebaseConfig.jsx";
import swal from "sweetalert";
import "../App.css";

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
      <div className="container mx-auto px-4 py-2 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <Link to="/" className="text-xl md:text-2xl font-bold text-white">
          Movie<span className="text-blue-300">Mingle</span>
        </Link>

        <div className="flex items-center space-x-4 md:space-x-8">
          <button
            onClick={handleAddMovieClick}
            className="bn30 text-lg md:text-base lg:text-lg px-4 py-2 min-w-[100px] whitespace-normal"
            aria-label="Add Movie"
          >
            Add Movie
          </button>

          {login ? (
            <button
              onClick={handleLogout}
              className="bn30 text-lg md:text-base lg:text-lg px-4 py-2 min-w-[100px] whitespace-normal"
              aria-label="Logout"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bn30 text-lg md:text-base lg:text-lg px-4 py-2 min-w-[100px] whitespace-normal"
              aria-label="Login"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
