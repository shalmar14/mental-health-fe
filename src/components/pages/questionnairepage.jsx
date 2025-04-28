import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import "../css/questionnairepage.css";

const questions = [
  "Apakah Anda mengalami kesulitan untuk tidur atau justru tidur berlebihan?",
  "Apakah Anda mengalami penurunan nafsu makan atau justru makan berlebihan?",
  "Apakah Anda merasa kurang berminat atau kurang senang dalam melakukan hal-hal yang biasanya Anda nikmati?",
  "Apakah Anda sering merasa lelah atau kekurangan energi?",
  "Apakah Anda merasa buruk tentang diri Anda sendiri atau merasa bahwa Anda adalah orang gagal atau telah mengecewakan diri sendiri atau keluarga Anda?",
  "Apakah Anda mengalami kesulitan untuk berkonsentrasi pada sesuatu, seperti membaca koran atau menonton televisi?",
  "Apakah Anda merasa sangat gelisah, tidak bisa diam, atau merasa tertekan secara fisik sehingga sulit untuk tenang?",
  "Apakah Anda pernah berpikir bahwa Anda akan lebih baik jika meninggal atau memiliki keinginan untuk menyakiti diri sendiri dengan cara apa pun?",
  "Apakah Anda merasa mudah marah, tersinggung, atau memiliki dorongan untuk bersikap agresif terhadap orang lain atau benda di sekitar Anda?",
  "Apakah Anda pernah mengalami serangan panik secara tiba-tiba, seperti detak jantung cepat, kesulitan bernapas, berkeringat, atau merasa seperti kehilangan kendali?",
  "Apakah Anda sering merasa sedih, tertekan, atau putus harapan?"
];

const options = [
  "Tidak Pernah",
  "Kadang-kadang",
  "Sering",
  "Hampir Setiap Hari",
];

export default function QuestionnairePage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(Array(questions.length).fill("")); // State untuk menyimpan jawaban

  // Cek token dan logout otomatis jika token hilang
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

  // Fungsi untuk menangani perubahan input radio
  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  // Fungsi untuk mengirim jawaban ke backend
  // Fungsi untuk mengirim jawaban ke backend
const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("xy") || sessionStorage.getItem("xy");
  if (!token) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");

    sessionStorage.removeItem("username");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("sessionActive");
    sessionStorage.removeItem("redirectPath");

    window.dispatchEvent(new Event("storage"));
    alert("Anda tidak terautentikasi. Silakan login ulang.");
    navigate("/");
    return;
  }

  // Validasi: Pastikan semua jawaban telah diisi
  const allAnswered = answers.every((answer) => answer !== "");
  if (!allAnswered) {
    alert("Silakan isi semua jawaban sebelum mengirim.");
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
      alert("Terjadi kesalahan saat menyimpan jawaban.");
      return;
    }

    // Tambahkan fetch untuk endpoint submit-answers-cart
    const cartResponse = await fetch("http://localhost:5000/api/submit-answers-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ answers }),
    });

    if (!cartResponse.ok) {
      alert("Gagal menyimpan jawaban ke CART.");
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
      alert("Gagal mendapatkan hasil prediksi dari model.");
      return;
    }

    const PHQPredictionData = await PHQPredictResponse.json();
    const PHQdiagnosis = PHQPredictionData.diagnosis;

    const cartPredictionResponse = await fetch("http://localhost:5000/api/predict-answers-cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ answers }),
    });
    
    if (!cartPredictionResponse.ok) {
      alert("Gagal mendapatkan hasil prediksi CART.");
      return;
    }
    
    const cartPredictionData = await cartPredictionResponse.json();
    const cartDiagnosis = cartPredictionData.result;

    alert("Jawaban berhasil disimpan!");
    // navigate("/result");
    navigate("/result", { state: { phqDiagnosis: PHQdiagnosis, cartDiagnosis } });

  } catch (error) {
    console.error("Error:", error);
    alert("Terjadi kesalahan saat mengirim data ke server.");
  }
};

  return (
    <>
      <Navbar />
      <div className="questionnaire-allContainer">
        <div className="container py-4 container-questionnaire">
          <h2 className="text-center mb-4">
            <strong>Kuisioner Diagnosa Awal Gangguan Mental Depresi</strong>
          </h2>
          <div className="line-quiestionnaire" />
          <p className="text-center">
            Dalam 2 minggu terakhir, seberapa sering Anda mengalami masalah - masalah dibawah ini?
          </p>
          <form onSubmit={handleSubmit}>
            {questions.map((question, index) => (
              <div key={index} className="mb-3 p-3 border rounded border-dark">
                <p>
                  {index + 1}. {question}
                </p>
                <div className="d-flex flex-wrap">
                  {options.map((option, idx) => (
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
                  ))}
                </div>
              </div>
            ))}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-success px-4 button-container"
              >
                Kirim Jawaban
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
}
