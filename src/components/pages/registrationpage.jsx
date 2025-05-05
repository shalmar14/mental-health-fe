import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import "../css/registrationpage.css";

function RegistrationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [securityQuestion, setSecurityQuestion] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true" ||
      sessionStorage.getItem("sessionActive") === "true";
    if (isLoggedIn) {
      navigate("/");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      alert("Your password must have at least 8 characters!");
      return;
    }

    if (password !== confirmPassword) {
      alert("The password confirmation is not the same as the password entered!");
      return;
    }

    const userData = {
      name,
      email,
      password,
      confirmPassword,
      securityQuestion,
      securityAnswer,
    };

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There's an error! Please try again!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container d-flex justify-content-center align-items-center container-registration">
        <div className="login-card p-4 shadow-lg card-registration">
          <h2 className="text-center mb-3 h2-registration">SIGN UP</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label form-label-registration">Name</label>
              <input
                type="text"
                className="form-control input-registration"
                placeholder="Enter Your Name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label form-label-registration">Email</label>
              <input
                type="email"
                className="form-control input-registration"
                placeholder="Enter Your Email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label form-label-registration">Password</label>
              <input
                type="password"
                className="form-control input-registration"
                placeholder="Enter Your Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password.length > 0 && password.length < 8 && (
                <small className="text-danger">Your password must have at least 8 characters!</small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label form-label-registration">Password Confirmation</label>
              <input
                type="password"
                className="form-control input-registration"
                placeholder="Confirm Your Password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <hr />

            <p><strong>Security Question (Please Remember It!)</strong></p>

            <div className="mb-3">
              <label className="form-label form-label-registration">Select A Question Below!</label>
              <select
                className="form-select input-registration"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                required
              >
                <option value="" disabled>-- Select A Question --</option>
                <option value="What Is Your Favorite Color?">What Is Your Favorite Color?</option>
                <option value="Where Did Your Parents First Meet?">Where Did Your Parents First Meet?</option>
                <option value="What Was The Title Of The Movie You Watched For The First Time?">What Was The Title Of The Movie You Watched For The First Time?</option>
                <option value="Who Was Your Favorite Teacher In Elementary School?">Who Was Your Favorite Teacher In Elementary School?</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label form-label-registration">Answer</label>
              <input
                type="text"
                className="form-control input-registration"
                placeholder="Enter Your Answer..."
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100 button-daftar-registration">
              Sign Up
            </button>
          </form>

          <div className="text-center mt-3">
            <div className="linkContainer-registration">
              <p className="p-registration">You Have An Account Already?</p>
              <Link to="/login" className="link-registration">
                Log In Here!
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default RegistrationPage;
