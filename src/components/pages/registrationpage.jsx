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
      alert("Password harus memiliki minimal 8 karakter.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Konfirmasi password tidak cocok.");
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
        alert("Registrasi Berhasil!");
        navigate("/login");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container d-flex justify-content-center align-items-center container-registration">
        <div className="login-card p-4 shadow-lg card-registration">
          <h2 className="text-center mb-3 h2-registration">DAFTAR</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label form-label-registration">Nama Anda</label>
              <input
                type="text"
                className="form-control input-registration"
                placeholder="Masukkan Nama Anda"
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
                placeholder="Masukkan Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label form-label-registration">Kata Sandi</label>
              <input
                type="password"
                className="form-control input-registration"
                placeholder="Masukkan Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password.length > 0 && password.length < 8 && (
                <small className="text-danger">Password minimal 8 karakter.</small>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label form-label-registration">Konfirmasi Kata Sandi</label>
              <input
                type="password"
                className="form-control input-registration"
                placeholder="Konfirmasi Kata Sandi"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <hr />

            <p><strong>Pertanyaan Keamanan (Harap Diingat)</strong></p>

            <div className="mb-3">
              <label className="form-label form-label-registration">Pilih Pertanyaan</label>
              <select
                className="form-select input-registration"
                value={securityQuestion}
                onChange={(e) => setSecurityQuestion(e.target.value)}
                required
              >
                <option value="">-- Pilih Pertanyaan --</option>
                <option value="Apakah Warna Favoritmu?">Apakah Warna Favoritmu?</option>
                <option value="Dimanakah Kedua Orang Tuamu Pertama Kali Bertemu?">Dimanakah Kedua Orang Tuamu Pertama Kali Bertemu?</option>
                <option value="Judul Film Pertama Kali Yang Kamu Tonton?">Judul Film Pertama Kali Yang Kamu Tonton?</option>
                <option value="Siapa Guru Favoritmu Di SD?">Siapa Guru Favoritmu Di SD?</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label form-label-registration">Jawaban</label>
              <input
                type="text"
                className="form-control input-registration"
                placeholder="Masukkan Jawaban Anda"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100 button-daftar-registration">
              DAFTAR
            </button>
          </form>

          <div className="text-center mt-3">
            <div className="linkContainer-registration">
              <p className="p-registration">Sudah punya akun?</p>
              <Link to="/login" className="link-registration">
                Masuk Disini!
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
