import { useEffect, useState } from "react";
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
import { setUser } from "./features/Auth/userSlice";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { useSelector, useDispatch } from "react-redux";
import Messege from "./pages/Messege";
import useFriends from "./hooks/useFriends";
import FavoriteModal from "./components/FavoriteModal";
import axios from "axios";

function App() {
  const { user, token } = useSelector(
    (state) => state?.user?.user || { user: null, token: null }
  );
  const dispatch = useDispatch();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  console.log("USER>>>", user);
  const friendsHook = useFriends();

  const [Id, setId] = useState(null);
  const [profileStatus, closeProfile] = useState(false);
  const [openFavModal, setOpenFavModal] = useState(false);
  const [Notify, setNotify] = useState(false);

  function MessegeAreaWrapper() {
    const { id } = useParams();
    return <MessegeArea Id={id} setId={setId} />;
  }

  useEffect(() => {
    if (!token) return;
    const fetRequests = async () => {
      // setLoading(true);

      try {
        const res2 = await axios.get(`${BASE_URL}/friends/`, {
          headers: { token },
        });

        console.log("FIRENDS ", res2.data.friends);
        dispatch(
          setUser({
            user: {
              ...user,
              friends: Array.isArray(res2?.data?.friends)
                ? res2.data.friends.map((f) => f._id ?? f)
                : user.friends,
            },
            token: token,
          })
        );

        console.log("res2?.data?.friends", res2?.data?.friends);
        friendsHook.setFriends(res2?.data?.friends);

        // setLoading(false);
      } catch (error) {}
    };

    fetRequests();
  }, [token]);
  console.log("friendsHook", friendsHook);
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
                  <>
                    <Mobile
                      profileStatus={profileStatus}
                      setNotify={setNotify}
                      Notify={Notify}
                      closeProfile={closeProfile}
                      {...friendsHook}
                      setOpenFavModal={setOpenFavModal}
                    />

                    {openFavModal && (
                      <FavoriteModal
                        {...friendsHook}
                        onClose={() => {
                          setOpenFavModal(false), setNotify(false);
                        }}
                      />
                    )}
                  </>
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
                  <>
                    <Desktop
                      setId={setId}
                      Id={Id}
                      setNotify={setNotify}
                      Notify={Notify}
                      profileStatus={profileStatus}
                      closeProfile={closeProfile}
                      {...friendsHook}
                      setOpenFavModal={setOpenFavModal}
                    />
                    {openFavModal && (
                      <FavoriteModal
                        {...friendsHook}
                        onClose={() => {
                          setOpenFavModal(false), setNotify(false);
                        }}
                      />
                    )}
                  </>
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
