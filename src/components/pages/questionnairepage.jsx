import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import "../css/questionnairepage.css";

const questions = [
  "What is your gender?",
  "How old are you?",
  "Are you self-employed (freelancer, contract-based, etc)?",
  "Do you have a family history of mental health disorders?",
  "How many days in a month do you spend mostly indoors?",
  "Have you been feeling more stressed than usual lately?",
  "Have you experienced drastic changes in your habits or routines?",
  "Have you ever had any mental health issues in the past?",
  "How often do you experience mood swings?",
  "Do you find it difficult to cope with problems or life pressures?",
  "Have you felt disinterested in work in the past few weeks?",
  "Do you find it difficult to socialize or maintain relationships?",
  "If you feel mentally disturbed, are you willing to talk to a professional?",
  "Does your workplace provide mental health support?",
  "Do you feel disinterested in doing things you usually enjoy?",
  "Do you often feel sad, depressed, or hopeless?",
  "Do you have trouble sleeping or do you sleep excessively?",
  "Do you often feel tired or lack energy?",
  "Have you experienced a loss of appetite or are you overeating?",
  "Do you feel bad about yourself, feel like a failure, or that you have let yourself or your family down?",
  "Do you have trouble concentrating on things, such as reading the newspaper or watching television?",
  "Do you feel very restless, unable to sit still, or physically agitated to the point where it's hard to relax?",
  "Have you ever had thoughts that you would be better off dead or thoughts of hurting yourself in any way?",
];

const getOptions = (index) => {
  if (index === 0) {
    return ["Male", "Female"];
  } else if (index >= 14 && index <= 22) {
    return ["Never", "Sometimes", "Often", "Almost Always"];
  } else if (
    [2, 3, 5, 6, 7, 9, 10, 11].includes(index)
  ) {
    return ["Yes", "No"];
  } else if (index === 12) {
    return ["Yes", "No", "Maybe"];
  } else if (index === 13) {
    return ["Yes", "No", "Not Sure"];
  } else if (index === 4) {
    return ["1 To 14", "More Than 14"];
  } else if (index === 8) {
    return ["Rarely", "Sometimes", "Often"];
  } else {
    return [];
  }
};

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(questions.length).fill("")); 
  const [isLoading, setIsLoading] = useState(false);

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

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true); 

  const token = localStorage.getItem("xy") || sessionStorage.getItem("xy");
  if (!token) {
    setIsLoading(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");

    sessionStorage.removeItem("username");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("sessionActive");
    sessionStorage.removeItem("redirectPath");

    window.dispatchEvent(new Event("storage"));
    alert("Please log in to your account again!");
    navigate("/");
    return;
  }

  const allAnswered = answers.every((answer) => answer !== "");
  if (!allAnswered) {
    setIsLoading(false);
    alert("Make sure to answer all of the questions before submitting.");
    return;
  }

  try {
    const PHQResponse = await fetch("http://localhost:5000/api/submit-answers-phq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ answers }),
    });

    if (!PHQResponse.ok) {
      alert("Failed to save the PHQ-9 answers.");
      return;
    }

    const cartResponse = await fetch("http://localhost:5000/api/submit-answers-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ answers }),
    });

    if (!cartResponse.ok) {
      alert("Failed to save the CART answers.");
      return;
    }

    const addAgeResponse = await fetch("http://localhost:5000/api/add-age", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ age: answers[1] }),
    });

    if (!addAgeResponse) {
      alert("Failed to save the age");
      return;
    }

    const addGenderResponse = await fetch("http://localhost:5000/api/add-gender", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ gender: answers[0] }),
    });

    if (!addGenderResponse) {
      alert("Failed to save the gender");
      return;
    }

    const PHQPredictResponse = await fetch("http://localhost:5000/api/predict-answers-phq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ answers }),
    });

    if (!PHQPredictResponse) {
      alert("Failed to predict PHQ-9");
      return;
    }

    const cartPredictionResponse = await fetch("http://localhost:5000/api/predict-answers-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ answers }),
    });
    
    if (!cartPredictionResponse.ok) {
      alert("Failed To Save Predict CART.");
      return;
    }

    alert("Your answers have been submitted!");
    navigate("/result");

  } catch (error) {
    console.error("Error:", error);
    alert("Failed to send data to the server.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <>
      <Navbar />
      <div className="questionnaire-allContainer">
        <div className="container py-4 container-questionnaire">
          <h2 className="text-center mb-4">
            <strong>Early Diagnosis Questionnaire for Mental Disorder "Depression"</strong>
          </h2>
          <div className="line-quiestionnaire" />
          <p className="text-center">
              Please answer the following questions with honest answers!
          </p>
          <form onSubmit={handleSubmit}>
            {questions.map((question, index) => (
              <div key={index} className="mb-3 p-3 border rounded border-dark">
                <p>
                  {index + 1}. {question}
                </p>
                <div className="d-flex flex-wrap">
                {index === 1 ? (
                  <input
                  type="text"
                  className="form-control w-auto"
                  value={answers[index] || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^(100|[1-9]?[0-9])$/.test(value)) {
                      handleAnswerChange(index, value);
                    }
                  }}
                  placeholder="Enter Your Age..."
                />                             
                ) : (
                  getOptions(index).map((option, idx) => (
                    <div key={idx} className="form-check me-3">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question-${index}`}
                        id={`q${index}-option${idx}`}
                        value={option}
                        checked={answers[index] === option}
                        onChange={(e) =>
                          handleAnswerChange(index, e.target.value)
                        }
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`q${index}-option${idx}`}
                      >
                        {option}
                      </label>
                    </div>
                  ))
                )}
                </div>
              </div>
            ))}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-success px-4 button-container"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}