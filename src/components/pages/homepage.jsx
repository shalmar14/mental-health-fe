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
      alert("You are not authenticated! Please log in to your account again!");
      navigate("/");
      return;
    }

    const handleStorageChange = () => {
      const check = localStorage.getItem("isLoggedIn") || sessionStorage.getItem("sessionActive");
      if (check) {
        setUsername(user);
      } else {
        setUsername(null);
      }
    };

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
        alert("Your session is over! Please log in to your account again!");
        navigate("/");
      }
    }, 2000); 

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
}, []);

  const handleDiagnosaClick = () => {
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
          <div className="col-12 text-center welcome-section-homepage">
            <h1 className="h1-homepage">
              Welcome To Our Page{username ? `, ${username}!` : "!"}
            </h1>
            <p className="welcome-text-homepage">
                Thank you for visiting our website. We are here to help you understand more 
                about mental health, specifically depression. Here, you can find important information, 
                make an early diagnosis, and start small steps towards better mental well-being.
            </p>
          </div>

          <div className="col-lg-6 d-flex flex-column justify-content-center text-white text-section-homepage-container">
            <div className="text-section-homepage-1">
              <h3 className="h3-homepage">What Is Depression?</h3>
              <p className="p-homepage">
              Depression is a mental disorder that can affect how a person feels, thinks and behaves. 
              It is often accompanied by feelings of hopelessness and loss of interest in things one used to enjoy. Depression can affect anyone, and the signs can be very diverse.
              </p>
              <p className="p-homepage">
              Early detection is essential so that treatment can be done early and prevent further impact, 
              be it on your work, relationships or daily life.
              </p>
              <p className="p-homepage">
              Don't hesitate to acknowledge your mental health condition. With early diagnosis, you can understand 
              the best steps to take to overcome it and start a better journey of recovery.
              </p>
            </div>

            <div className="text-section-homepage-2">
              <button
                onClick={handleDiagnosaClick}
                className="btn btn-warning btn-lg btn-warning-homepage"
              >
                Make A Diagnosis Now!
              </button>
            </div>
          </div>

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
