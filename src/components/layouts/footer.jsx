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
            <h5 className="footer-title">Tentang Situs Web</h5>
            <p className="p-footer">
              Situs web ini adalah platform yang menyediakan layanan diagnosa dini gangguan mental depresi. Diagnosa awal dapat memberikan kesempatan bagi individu untuk mendapatkan intervensi tepat waktu, yang pada gilirannya dapat meningkatkan kualitas hidup mereka dan mengurangi beban pada sistem kesehatan.
            </p>
          </div>

          <div className="col-md-6 text-center mb-4 mb-md-0">
            <h5 className="footer-title">Tautan Cepat</h5>
            <ul className="list-unstyled ul-footer">
              <li className="li-footer">
                <Link to="/guide" className="footer-link">Lihat Panduan</Link>
              </li>
              <li className="li-footer">
                <button 
                  onClick={() => handleProtectRoute("/questionnaire")} 
                  className="button-footer"
                >
                  Diagnosa
                </button>
              </li>
              {isLoggedIn && (
                <li className="li-footer">
                  <Link to="/result" className="footer-link">Hasil Diagnosa</Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="copyright-section">
          <div className="row mt-5">
            <div className="col-12 text-center copyright-p-container">
              <p className="p-copyright-footer copyright-p">&copy; 2025 Sistem Pakar Diagnosa Dini Gangguan Mental Depresi. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
