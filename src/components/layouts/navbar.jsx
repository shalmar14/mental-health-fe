import { NavLink, useNavigate } from "react-router-dom";
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

  const isActiveButton = (path) => {
    return window.location.pathname === path;
  };  

  return (
    <nav className="navbar navbar-expand-lg navbar-light sticky-top navbar-container">
      <div className="container-fluid">
        <div className="navbar-collapse-navbar">
          <ul className="navbar-nav ul-navbar">
            <li className="nav-item-navbar">
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  "nav-link nav-link-navbar" + (isActive ? " active-navbar" : "")
                }
              >
                Beranda
              </NavLink>
            </li>
            <li className="nav-item-navbar">
              <NavLink 
                to="/guide" 
                className={({ isActive }) => 
                  "nav-link nav-link-navbar" + (isActive ? " active-navbar" : "")
                }
              >
                Lihat Panduan
              </NavLink>
            </li>
            <li className="nav-item-navbar">
              <button 
                onClick={() => handleProtectRoute("/questionnaire")} 
                className={`nav-link nav-link-navbar ${isActiveButton("/questionnaire") ? "active-navbar" : ""}`}
              >
                Diagnosa
              </button>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item-navbar">
                  <NavLink 
                    to="/result" 
                    className={({ isActive }) => 
                      "nav-link nav-link-navbar" + (isActive ? " active-navbar" : "")
                    }
                  >
                    Hasil Diagnosa
                  </NavLink>
                </li>
                <li className="nav-item-navbar">
                  <button 
                    onClick={handleLogout} 
                    className="nav-link nav-link-navbar btn btn-link"
                  >
                    Keluar
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item-navbar">
                <NavLink 
                  to="/login" 
                  onClick={() => sessionStorage.removeItem("redirectPath")} 
                  className={({ isActive }) => 
                    "nav-link nav-link-navbar" + (isActive ? " active-navbar" : "")
                  }
                >
                  Masuk
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
