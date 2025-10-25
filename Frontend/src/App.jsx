import { useState } from "react";
import MessegeArea from "./components/MessegeArea";
import Desktop from "./pages/desktop";
import Mobile from "./pages/mobile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Navigate,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import Messege from "./pages/Messege";
import useFriends from "./hooks/useFriends";

function App() {
  const { user } = useSelector((state) => state.user?.user);
  console.log("USER>>>", user);
  const  friendsHook  = useFriends();

  const [Id, setId] = useState(null);
  const [profileStatus, closeProfile] = useState(false);
  function MessegeAreaWrapper() {
    const { id } = useParams();
    return <MessegeArea Id={id} setId={setId} />;
  }
  return (
    <div className="">
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify/:token" element={<Messege />} />
        </Routes>
        <div className="block lg:hidden">
          <Routes>
            <Route
              path="/"
              element={
                user?.email ? (
                  <Mobile
                    profileStatus={profileStatus}
                    closeProfile={closeProfile}
                    {...friendsHook} 
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/MessegeArea/:id"
              element={
                user?.email ? (
                  <MessegeAreaWrapper />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>

        <div className="hidden lg:block">
          <Routes>
            <Route
              path="/"
              element={
                user?.email ? (
                  <Desktop
                    setId={setId}
                    Id={Id}
                    profileStatus={profileStatus}
                    closeProfile={closeProfile}
                    {...friendsHook} 
                  />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </Router>
      <ToastContainer />{" "}
    </div>
  );
}

export default App;
