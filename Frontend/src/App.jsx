import { useState } from "react";
import MessegeArea from "./components/MessegeArea";
import Desktop from "./pages/desktop";
import Mobile from "./pages/mobile";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  const [Id, setId] = useState(null);
  const [profileStatus, closeProfile] = useState(false);

  function MessegeAreaWrapper() {
    const { id } = useParams();
    return <MessegeArea Id={id} setId={setId} />;
  }
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <div className="block lg:hidden">
        <Routes>
          <Route
            path="/"
            element={
              <Mobile
                profileStatus={profileStatus}
                closeProfile={closeProfile}
              />
            }
          />
          <Route path="/MessegeArea/:id" element={<MessegeAreaWrapper />} />
        </Routes>
      </div>

      <div className="hidden lg:block">
        <Routes>
          <Route
            path="/"
            element={
              <Desktop
                setId={setId}
                Id={Id}
                profileStatus={profileStatus}
                closeProfile={closeProfile}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
