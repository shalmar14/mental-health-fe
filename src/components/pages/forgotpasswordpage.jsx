import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import "../css/forgotpasswordpage.css";
import { useEffect } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true" ||
      sessionStorage.getItem("sessionActive") === "true";

    if (isLoggedIn) {
      navigate("/");
    } else {
      navigate("/forgotpassword")
    }
  }, [navigate]);

  const checkEmail = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSecurityQuestion("");

    try {
      const response = await fetch("http://localhost:5000/api/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setIsEmailVerified(true);
      setSecurityQuestion(data.securityQuestion);
    } catch (error) {
      setErrorMessage(error.message);
      setIsEmailVerified(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, securityAnswer }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      sessionStorage.setItem("check", "true");
      navigate(`/resetpassword?email=${encodeURIComponent(email)}`);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container d-flex justify-content-center align-items-center container-forgotpassword">
        <div className="login-card p-4 shadow-lg card-forgotpassword">
          <h2 className="text-center mb-3 h2-login">Forgot Your Password?</h2>
          <hr />

          <form onSubmit={checkEmail}>
            <div className="mb-3">
              <label className="form-label form-label-forgotpassword">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Your Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-success w-100">
              Check Email
            </button>
          </form>

          {isEmailVerified && (
            <form onSubmit={handleForgotPassword} className="mt-3">
              <p><strong>Security Question</strong></p>
              <div className="mb-3">
                <label className="form-label form-label-forgotpassword">{securityQuestion}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Your Answer..."
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success w-100">
                Verify 
              </button>
            </form>
          )}

          {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ForgotPassword;
