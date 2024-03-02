import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "./Firebase/FirebaseConfig.jsx";
import Header from "./Componants/Header.jsx";
import Cards from "./Componants/Cards.jsx";
import { Route, Routes } from "react-router-dom";
import AddMovie from "./Componants/AddMovie.jsx";
import Details from "./Componants/Details.jsx";
import Login from "./Componants/Login.jsx";
import Signup from "./Componants/SignUp.jsx";

const appState = createContext();
const App = () => {
 const [login, setLogin] = useState(false);
 const [userName, setUserName] = useState("");

 useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setLogin(true);
            setUserName(user.displayName || "");
          } else {
            setLogin(false);
            setUserName("");
          }
        }, (error) => {
          console.error("Error in onAuthStateChanged:", error);
          // Handle the error appropriately, e.g., show a message to the user
        });

        return () => unsubscribe();
      })
      .catch((error) => {
        console.error("Error setting session persistence:", error);
        // Handle the error appropriately, e.g., show a message to the user
      });
 }, []);

 return (
    <appState.Provider value={{ login, setLogin, userName, setUserName }}>
      <div className="app relative">
        <Header />
        <Routes>
          <Route path="/" element={<Cards />} />
          <Route path="/addmovie" element={<AddMovie />} />
          <Route path="/details/:id" element={<Details />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </appState.Provider>
 );
};

export default App;
export { appState };
