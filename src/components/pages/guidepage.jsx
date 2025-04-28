import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import "../css/guidepage.css";

function GuidePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("xy") || sessionStorage.getItem("xy");
      const isLoggedIn = localStorage.getItem("isLoggedIn") || sessionStorage.getItem("sessionActive");

      if (isLoggedIn && !token) {
        // Hapus semua data sesi
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");

        sessionStorage.removeItem("username");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("sessionActive");
        sessionStorage.removeItem("redirectPath");

        window.dispatchEvent(new Event("storage"));
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        navigate("/");
      }
    };

    // Mengecek token setiap 2 detik
    const interval = setInterval(checkToken, 2000);

    return () => clearInterval(interval); // Bersihkan interval saat komponen di-unmount
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="guide-allContainer">
        <div className="container guide-container">
          <h1 className="text-center guide-title">Panduan Pengisian Kuisioner</h1>
          <hr />
          <p className="text-center guide-text">
            Anda akan mengisi 11 pertanyaan dengan 4 jawaban:
          </p>
          <ul className="list-group list-group-flush text-center guide">
            <li className="list-group-item text-dark list-group-item-dark-guide" />
            <li className="list-group-item text-dark list-group-item-dark-guide"> <strong>Tidak pernah</strong>  </li>
            <li className="list-group-item text-dark list-group-item-dark-guide"> <strong>Kadang-kadang</strong>  </li>
            <li className="list-group-item text-dark list-group-item-dark-guide"> <strong>Sering</strong>  </li>
            <li className="list-group-item text-dark list-group-item-dark-guide"> <strong>Hampir Setiap Hari</strong>  </li>
            <li className="list-group-item text-dark list-group-item-dark-guide" />
          </ul>
          <p className="text-center guide-text">
            Semua jawaban memiliki bobot poin yang nantinya akan menentukan hasil diagnosa.
          </p>

          <div className="text-center button-guide-container">
            <Link to="/questionnaire">
              <button type="submit" className="btn btn-success button-guide">
                Lanjut ke halaman diagnosa
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default GuidePage;
