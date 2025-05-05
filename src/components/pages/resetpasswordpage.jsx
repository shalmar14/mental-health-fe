import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import "../css/loginpage.css";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const check = sessionStorage.getItem("check");
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");

    if (!check || !emailParam) {
      navigate("/forgotpassword");
    } else {
      setEmail(emailParam); 
    }
  }, [location, navigate]);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setErrorMessage("The password confirmation is not the same as the password entered!");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Your password must have at least 8 characters!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword, confirmPassword }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to reset the password!");

      setMessage(data.message);
      setErrorMessage("");
      sessionStorage.removeItem("check");

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setErrorMessage(error.message);
      setMessage("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container d-flex justify-content-center align-items-center container-login">
        <div className="login-card p-4 shadow-lg card-login">
          <h2 className="text-center mb-3 h2-login">Reset Your Password</h2>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {message && <div className="alert alert-success">{message}</div>}

          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label className="form-label form-label-login">Email</label>
              <input
                type="email"
                className="form-control"
                value={email}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="form-label form-label-login">New Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Your New Password..."
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {newPassword.length > 0 && newPassword.length < 8 && (
                <small className="text-danger">Password minimal 8 karakter.</small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label form-label-login">Password Confirmation</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Your New Password..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              Reset Password
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResetPassword;
