import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import "../css/homepage.css";
import depressionBackground from "../../assets/depression-bg.png";

function HomePage() {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Memperbarui username saat komponen mount atau ketika ada perubahan storage
    const user = localStorage.getItem("username") || sessionStorage.getItem("username");
    setUsername(user);

    const token = localStorage.getItem("xy") || sessionStorage.getItem("xy");
    const isLoggedIn = localStorage.getItem("isLoggedIn") || sessionStorage.getItem("sessionActive");

    if (isLoggedIn && !token) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");

      sessionStorage.removeItem("username");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("sessionActive");
      sessionStorage.removeItem("redirectPath");

      window.dispatchEvent(new Event("storage"));
      alert("Anda tidak terautentikasi. Silahkan login ulang.");
      navigate("/");
      return;
    }

    // Menambahkan event listener jika ada perubahan pada localStorage/sessionStorage
    const handleStorageChange = () => {
      const check = localStorage.getItem("isLoggedIn") || sessionStorage.getItem("sessionActive");
      if (check) {
        setUsername(user);
      } else {
        setUsername(null);
      }
    };

    // Cek token setiap 2 detik hanya jika user sedang login
    const interval = setInterval(() => {
      const tokenCheck = localStorage.getItem("xy") || sessionStorage.getItem("xy");
      const isLoggedInCheck = localStorage.getItem("isLoggedIn") || sessionStorage.getItem("sessionActive");

      if (isLoggedInCheck && !tokenCheck) {
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
    }, 2000); // Mengecek setiap 2 detik

    // Mendengarkan perubahan storage
    window.addEventListener("storage", handleStorageChange);

    // Cleanup saat komponen unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval); // Hentikan interval saat komponen unmount
    };
}, []);

  const handleDiagnosaClick = () => {
    // Jika user belum login, arahkan ke halaman login
    if (!localStorage.getItem("isLoggedIn") && !sessionStorage.getItem("sessionActive")) {
      sessionStorage.setItem("redirectPath", "/questionnaire");
      navigate("/login");
    } else {
      navigate("/questionnaire");
    }
  };

  return (
    <>
      <Navbar />

      <div className="container-fluid home-container d-flex align-items-center homepage-container">
        <div className="row row-homepage">
          {/* Bagian Selamat Datang */}
          <div className="col-12 text-center welcome-section-homepage">
            <h1 className="h1-homepage">
              Selamat Datang{username ? `, ${username}!` : "!"}
            </h1>
            <p className="welcome-text-homepage">
              Terima kasih telah mengunjungi situs web kami. Kami hadir untuk membantu Anda memahami lebih dalam 
              tentang kesehatan mental, khususnya depresi. Di sini, Anda dapat menemukan informasi penting, 
              melakukan diagnosa awal, dan memulai langkah kecil menuju kesejahteraan mental yang lebih baik.
            </p>
          </div>

          {/* Bagian Penjelasan Depresi */}
          <div className="col-lg-6 d-flex flex-column justify-content-center text-white text-section-homepage-container">
            <div className="text-section-homepage-1">
              <h3 className="h3-homepage">Apa Itu Depresi?</h3>
              <p className="p-homepage">
                Depresi adalah gangguan mental yang dapat memengaruhi perasaan, cara berpikir, dan perilaku seseorang. 
                Gangguan ini seringkali disertai dengan perasaan putus asa dan kehilangan minat terhadap hal-hal yang 
                biasanya disukai. Depresi dapat memengaruhi siapa saja, dan tanda-tandanya bisa sangat beragam.
              </p>
              <p className="p-homepage">
                Deteksi dini sangat penting agar penanganan bisa dilakukan sejak awal dan mencegah dampak lebih lanjut, 
                baik itu pada pekerjaan, hubungan, atau kehidupan sehari-hari Anda.
              </p>
              <p className="p-homepage">
                Jangan ragu untuk mengetahui kondisi kesehatan mental Anda. Dengan diagnosa dini, Anda dapat memahami 
                langkah terbaik untuk mengatasinya dan memulai perjalanan pemulihan yang lebih baik.
              </p>
            </div>

            {/* Tombol Diagnosa */}
            <div className="text-section-homepage-2">
              <button
                onClick={handleDiagnosaClick}
                className="btn btn-warning btn-lg btn-warning-homepage"
              >
                Lakukan Diagnosa Sekarang!
              </button>
            </div>
          </div>

          {/* Bagian Gambar */}
          <div className="col-lg-6 d-flex justify-content-center img-container">
            <img
              src={depressionBackground}
              alt="Depresi"
              className="depression-img img-fluid"
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default HomePage;
