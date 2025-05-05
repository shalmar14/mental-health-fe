import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../css/footer.css";

function Footer() {
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

  const handleProtectRoute = (path) => {
    if (!isLoggedIn) {
      sessionStorage.setItem("redirectPath", path);
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-left mb-4 mb-md-0">
            <h5 className="footer-title">About Us</h5>
            <p className="p-footer">
            This website is a platform that provides early diagnosis services of depressive mental disorders. Early diagnosis can provide an opportunity for individuals to get timely intervention, which in turn can improve their quality of life and reduce the burden on the health system.
            </p>
          </div>

          <div className="col-md-6 text-center mb-4 mb-md-0">
            <h5 className="footer-title">Quick Links</h5>
            <ul className="list-unstyled ul-footer">
              <li className="li-footer">
                <Link to="/guide" className="footer-link">Guide</Link>
              </li>
              <li className="li-footer">
                <button 
                  onClick={() => handleProtectRoute("/questionnaire")} 
                  className="button-footer"
                >
                  Questionnaire
                </button>
              </li>
              {isLoggedIn && (
                <li className="li-footer">
                  <Link to="/result" className="footer-link">Diagnosis Result</Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="copyright-section">
          <div className="row mt-5">
            <div className="col-12 text-center copyright-p-container">
              <p className="p-copyright-footer copyright-p">&copy; 2025 Expert System for Early Diagnosis of Depression. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
