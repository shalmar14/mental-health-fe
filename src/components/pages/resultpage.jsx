import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import "../css/resultpage.css";

function ResultPage() {
  const navigate = useNavigate();
  const [diagnosisPHQ, setDiagnosisPHQ] = useState(null);
  const [diagnosisCART, setDiagnosisCART] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); 
  const [message_two, setMessageTwo] = useState(null);

  useEffect(() => {
    const isLoggedIn =
      localStorage.getItem("isLoggedIn") === "true" ||
      sessionStorage.getItem("sessionActive") === "true";

    if (!isLoggedIn) {
      navigate("/login");
    } else {
      getHasilDiagnosa(); 
    }
  }, [navigate]);

  const getHasilDiagnosa = async () => {
    const token = localStorage.getItem("xy") || sessionStorage.getItem("xy");

    if (!token) {
      alert("Failed to get the token! Please log in to your account again!");
      navigate("/login");
      return;
    }

    try {
      const responsePHQ = await fetch("http://localhost:5000/api/get-prediction-phq", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (responsePHQ.ok) {
        const dataPHQ = await responsePHQ.json();
        setDiagnosisPHQ(dataPHQ); 

        if (dataPHQ.predictionPHQ.total_score <= 4) {
            setMessage("In this depression category, individuals show little or no indication of significant depressive symptoms. Emotional state tends to be stable and positive, reflected in good mood and sustained interest in daily activities. Basic functions such as sleep patterns, appetite, energy levels, and ability to concentrate are generally unaffected by the presence of depressive symptoms. Individuals in this category are usually able to go about their daily routines without any significant mental health-related barriers.");
            setMessageTwo("To maintain a healthy mental state, it is important to continuously adopt a lifestyle that supports psychological well-being. This includes maintaining adequate sleep, eating a nutritionally balanced diet, exercising regularly, and developing effective stress management mechanisms. In addition, maintaining a balance between work, social life, hobbies, and downtime, as well as building resilience in the face of life's challenges, will help to keep the mood positive and prevent the potential emergence of depressive symptoms in the future.");
        } else if (dataPHQ.predictionPHQ.total_score <=9) {
            setMessage("The mild depression category is characterized by the onset of some depressive symptoms, although not yet to the point of significantly interfering with daily functioning. Individuals may experience occasional feelings of sadness, decreased interest in some previously favored activities, minor changes in sleep patterns or appetite, or feel tired more easily than usual. These symptoms may be fluctuating and not yet very intense, but are already a sign of changes in mood and energy levels.");
            setMessageTwo("It is important that you take better care of yourself and monitor any changes in mood, sleep patterns, appetite and energy levels. Prioritize self-care activities such as getting enough rest, eating healthy foods, and doing moderate exercise. Do not hesitate to seek social support by talking to friends, family or trusted people about how you are feeling. Managing stress through relaxation techniques or enjoyable hobbies can also help. Even if symptoms seem mild, it's still a good idea to consult a mental health professional, especially if they persist or interfere with daily life.");
        } else if (dataPHQ.predictionPHQ.total_score <= 14) {
            setMessage("At a moderate level of depression, the symptoms of depression become more pronounced, frequent and begin to affect daily activities. Individuals may experience more intense and longer-lasting feelings of sadness, a significant loss of interest in many activities, more pronounced changes in sleep and appetite patterns, feeling very tired and lacking energy, having difficulty concentrating, and feelings of guilt or worthlessness may arise. The impact of these symptoms starts to be felt at work, school or social interactions.");
            setMessageTwo("In the case of moderate depression, it is highly recommended to seek help from a mental health professional such as a psychologist, psychiatrist, or counselor immediately. Psychological therapies, such as cognitive behavioral therapy (CBT) or interpersonal therapy (IPT), can help identify and change negative thought patterns and behaviors that contribute to depression. In addition, support from family and friends is essential in the recovery process. Try to maintain daily routines as much as possible and avoid isolating yourself, even though it may feel difficult to interact with others.");
        } else if (dataPHQ.predictionPHQ.total_score <= 19) {
            setMessage("Moderately severe depression is characterized by more severe depressive symptoms that significantly interfere with an individual's ability to function in daily life. Deep and persistent feelings of sadness, loss of interest or pleasure in almost everything, drastic changes in weight or appetite, severe sleep disturbances, extreme fatigue, strong feelings of worthlessness or guilt, great difficulty concentrating, and possible thoughts of death or suicide characterize this category.");
            setMessageTwo("Taking immediate action to seek professional help is essential. Contact your nearest psychologist, psychiatrist or mental health service. Consider treatment with antidepressants prescribed by a psychiatrist, which are often effective when combined with intensive psychological therapy. Emotional and practical support from family and friends is needed, and it is important to ensure the individual feels supported and not alone. If thoughts of self-harm arise, seek emergency help immediately and ensure the individual is in a safe environment.");
        } else {
            setMessage("The severe depression category is the most serious level of depression, where the symptoms experienced become very intense and disabling. Individuals in this category may experience extreme difficulty in carrying out daily activities, even the simplest tasks. Deep and persistent feelings of sadness, loss of interest or pleasure in almost all aspects of life, significant changes in weight or appetite, severe sleep disturbances (insomnia or hypersomnia), extreme fatigue, deep feelings of worthlessness or guilt, severe difficulty concentrating, and recurrent and intense thoughts of death or suicide characterize this condition. Physical symptoms such as agitation or psychomotor slowing may also be evident.");
            setMessageTwo("In situations of severe depression, crisis intervention and immediate professional help is a must. Individuals in this category require comprehensive evaluation and treatment from psychiatrists and other mental health professionals. Medication with antidepressants and close monitoring by a psychiatrist is essential, and is often combined with intensive psychological therapy. A safe and supportive environment, as well as continuous support from family and friends, plays a crucial role in the recovery process. If there is a risk of suicide, emergency safety and support measures should be taken immediately. Recovery from major depression is a process that takes time and ongoing support.");
        }
      } else {
        alert("Failed to generate the result!");
        navigate("/questionnaire")
      }
    } catch (error) {
      console.error("Error:", error);
      alert("There's an error with fetching the data!");
    } finally {
      setLoading(false); 
    }

    try {
      const responseCART = await fetch("http://localhost:5000/api/get-prediction-cart", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (responseCART.ok) {
        const dataCART = await responseCART.json();
        setDiagnosisCART(dataCART);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to get the data from the server!");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container d-flex justify-content-center align-items-center container-result">
        <div className="login-card p-4 shadow-lg card-result">
          <h2 className="text-center mb-1 h2-result">DIAGNOSIS RESULT</h2>
          <br />
          {loading ? (
            <div className="text-center">
              <p>Please Make A Diagnosis First!</p>
            </div>
          ) : diagnosisPHQ && diagnosisCART ? (
            <div className="text-center">
              <div className="line-result" />
              <strong><p className="diagnosis-title">Diagnosis:</p></strong>
              <p className="message-phq">{diagnosisPHQ.predictionPHQ.result}</p>
              <strong><p>Conclusion:</p></strong>
              <p className="message-cart">{diagnosisCART.predictionCART.message}</p>
              <div className="line-result" />
              <br />
              <p className="message">{message}</p>
              <p className="message">{message_two}</p>
            </div>
          ) : (
            <div className="text-center">
              <p>There Is No Diagnosis Result Yet! Please Make A Diagnosis First!</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResultPage;
