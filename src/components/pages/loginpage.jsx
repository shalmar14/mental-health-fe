import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import "../css/loginpage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true" ||
      sessionStorage.getItem("sessionActive") === "true";
    if (isLoggedIn) navigate("/");
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rememberMe }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login gagal");
      }
  
      const data = await response.json(); 
      const token = data.token;
      const username = data.user.name; 
  
      if (rememberMe) {
        localStorage.setItem("xy", token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", username);
        sessionStorage.removeItem("sessionActive");
        sessionStorage.removeItem("username");
      } else {
        sessionStorage.setItem("xy", token);
        sessionStorage.setItem("sessionActive", "true");
        sessionStorage.setItem("username", username);
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
      }

      navigate("/")
  
      window.dispatchEvent(new Event("storage")); // Update HomePage

       // Ambil dan hapus redirectPath
       const redirectPath = sessionStorage.getItem("redirectPath");
       sessionStorage.removeItem("redirectPath");
 
       // Logika redirect baru
       let targetPath = "/";
       if (redirectPath === "/questionnaire") {
         targetPath = "/guide";
       } else if (redirectPath && redirectPath !== "/login") {
         targetPath = redirectPath;
       }
 
       navigate(targetPath);
 
  
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container d-flex justify-content-center align-items-center container-login">
        <div className="login-card p-4 shadow-lg card-login">
          <h2 className="text-center mb-3 h2-login">MASUK</h2>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label form-label-login">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label form-label-login">Kata Sandi</label>
              <input
                type="password"
                className="form-control"
                placeholder="Masukkan Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label className="form-check-label" htmlFor="rememberMe">
                Tetap Masuk
              </label>
            </div>

            <div className="d-flex justify-content-between mb-3">
              <Link to="/forgotpassword" className="link-forgotpassword">
                Lupa Kata Sandi?
              </Link>
            </div>

            <button type="submit" className="btn btn-success w-100 button-masuk-login">
              MASUK
            </button>
          </form>

          <div className="text-center mt-3">
            <div className="linkContainer-login">
              <p>Belum Punya Akun?</p>
              <Link to="/registration" className="link-login">
                Daftar Disini!
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default LoginPage;
