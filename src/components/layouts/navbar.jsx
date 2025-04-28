import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true" || 
    sessionStorage.getItem("sessionActive") === "true"
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(
        localStorage.getItem("isLoggedIn") === "true" || 
        sessionStorage.getItem("sessionActive") === "true"
      );
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("xy");
    localStorage.removeItem("username");
    
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("xy");
    sessionStorage.removeItem("sessionActive");
    sessionStorage.removeItem("redirectPath"); 
    
    window.dispatchEvent(new Event("storage"));
    setIsLoggedIn(false);
    navigate("/");
  };

  const handleProtectRoute = (path) => {
    if (!isLoggedIn) {
      sessionStorage.setItem("redirectPath", path);
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top navbar-container">
      <div className="container-fluid">
        <div className="navbar-collapse-navbar">
          <ul className="navbar-nav ul-navbar">
            <li className="nav-item-navbar">
              <Link to="/" className="nav-link nav-link-navbar">Beranda</Link>
            </li>
            <li className="nav-item-navbar">
              <Link to="/guide" className="nav-link nav-link-navbar">Lihat Panduan</Link>
            </li>
            <li className="nav-item-navbar">
              <button 
                onClick={() => handleProtectRoute("/questionnaire")} 
                className="nav-link nav-link-navbar btn btn-link"
              >
                Diagnosa
              </button>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item-navbar">
                  <Link to="/result" className="nav-link nav-link-navbar">Hasil Diagnosa</Link>
                </li>
                <li className="nav-item-navbar">
                  <button onClick={handleLogout} className="nav-link nav-link-navbar btn btn-link">
                    Keluar
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item-navbar">
                <Link 
                  to="/login" 
                  onClick={() => sessionStorage.removeItem("redirectPath")} 
                  className="nav-link nav-link-navbar"
                >
                  Masuk
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
