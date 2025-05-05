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

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");

        sessionStorage.removeItem("username");
        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("sessionActive");
        sessionStorage.removeItem("redirectPath");

        window.dispatchEvent(new Event("storage"));
        alert("Your session is over! Please log in to your account again.");
        navigate("/");
      }
    };

    const interval = setInterval(checkToken, 2000);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="guide-allContainer">
        <div className="container guide-container">
          <h1 className="text-center guide-title">Questionnaire Filling Guide</h1>
          <hr />
          <p className="guide-text">
          You will be asked to answer 22 questions relating to conditions and factors that may affect your mental health, especially in the context of work and daily life. Questions include demographic information such as gender and employment status, personal and family mental health history, stress levels, changes in habits, as well as your views on mental health support in the work environment. The 9 questions of them refer to PHQ-9 questions for more accurate analysis or early diagnosis. Your answers will help in understanding your overall mental state.
          </p>
          <div className="text-center button-guide-container">
            <Link to="/questionnaire">
              <button type="submit" className="btn btn-success button-guide">
                Continue To The Questionnaire Page
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
