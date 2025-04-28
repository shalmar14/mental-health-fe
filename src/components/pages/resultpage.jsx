import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../layouts/navbar";
import Footer from "../layouts/footer";
import "../css/resultpage.css";

function ResultPage() {
  const navigate = useNavigate();
  const [diagnosis, setDiagnosis] = useState(null); 
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
      getHasilDiagnosa(); // kalau sudah login, fetch hasil diagnosa
    }
  }, [navigate]);

  const getHasilDiagnosa = async () => {
    const token = localStorage.getItem("xy") || sessionStorage.getItem("xy");

    if (!token) {
      alert("Token tidak ditemukan, silakan login.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/get-prediction-phq", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDiagnosis(data); // simpan hasil diagnosa ke state

        if (data.prediction.total_score <= 4) {
            setMessage("Pada kategori diagnosa ini, individu menunjukkan sedikit atau bahkan tidak ada indikasi gejala depresi yang signifikan. Kondisi emosional cenderung stabil dan positif, tercermin dalam suasana hati yang baik dan minat yang berkelanjutan terhadap aktivitas sehari-hari. Fungsi-fungsi dasar seperti pola tidur, nafsu makan, tingkat energi, dan kemampuan berkonsentrasi umumnya tidak terpengaruh oleh adanya gejala depresi. Individu dalam kategori ini biasanya mampu menjalani rutinitas harian tanpa adanya hambatan yang berarti terkait dengan kesehatan mental");
            setMessageTwo("Untuk mempertahankan kondisi mental yang sehat, penting untuk terus mengadopsi gaya hidup yang mendukung kesejahteraan psikologis. Ini termasuk menjaga kualitas tidur yang cukup, mengonsumsi makanan bergizi seimbang, berolahraga secara teratur, dan mengembangkan mekanisme pengelolaan stres yang efektif. Selain itu, memelihara keseimbangan antara pekerjaan, kehidupan sosial, hobi, dan waktu istirahat, serta membangun ketahanan diri dalam menghadapi tantangan hidup, akan membantu menjaga suasana hati tetap positif dan mencegah potensi munculnya gejala depresi di kemudian hari.");
        } else if (data.prediction.total_score <=9) {
            setMessage("Kategori depresi ringan ditandai dengan munculnya beberapa gejala depresi yang mulai terasa, meskipun belum sampai mengganggu fungsi sehari-hari secara signifikan. Individu mungkin mengalami perasaan sedih yang sesekali hadir, penurunan minat pada beberapa aktivitas yang sebelumnya disukai, perubahan kecil dalam pola tidur atau nafsu makan, atau merasa lebih mudah lelah dari biasanya. Gejala-gejala ini mungkin fluktuatif dan belum terlalu intens, namun sudah menjadi pertanda adanya perubahan dalam suasana hati dan tingkat energi.");
            setMessageTwo("Penting bagi Anda untuk lebih memperhatikan diri sendiri dan memantau setiap perubahan dalam suasana hati, pola tidur, nafsu makan, dan tingkat energi. Prioritaskan aktivitas perawatan diri seperti mendapatkan istirahat yang cukup, mengonsumsi makanan sehat, dan melakukan olahraga ringan. Jangan ragu untuk mencari dukungan sosial dengan berbicara kepada teman, keluarga, atau orang terpercaya mengenai apa yang Anda rasakan. Mengelola stres melalui teknik relaksasi atau hobi yang menyenangkan juga dapat membantu. Jika gejala tidak membaik atau justru meningkat, pertimbangkan untuk mencari bantuan dari profesional kesehatan mental.");
        } else if (data.prediction.total_score <= 14) {
            setMessage("Pada tingkat depresi sedang, gejala-gejala depresi menjadi lebih nyata, sering dirasakan, dan mulai memengaruhi aktivitas sehari-hari. Individu mungkin mengalami perasaan sedih yang lebih intens dan berlangsung lebih lama, kehilangan minat yang signifikan pada banyak aktivitas, perubahan yang lebih jelas pada pola tidur dan nafsu makan, merasa sangat lelah dan kekurangan energi, mengalami kesulitan berkonsentrasi, serta mungkin muncul perasaan bersalah atau tidak berharga. Dampak dari gejala-gejala ini mulai terasa pada pekerjaan, sekolah, atau interaksi sosial.");
            setMessageTwo("Dalam kondisi depresi sedang, sangat disarankan untuk segera mencari bantuan dari profesional kesehatan mental seperti psikolog, psikiater, atau konselor. Terapi psikologis, seperti terapi kognitif perilaku (CBT) atau terapi interpersonal (IPT), dapat membantu mengidentifikasi dan mengubah pola pikir dan perilaku negatif yang berkontribusi pada depresi. Selain itu, dukungan dari keluarga dan teman-teman sangat penting dalam proses pemulihan. Usahakan untuk tetap menjaga rutinitas harian sebisa mungkin dan hindari mengisolasi diri, meskipun mungkin terasa sulit untuk berinteraksi dengan orang lain.");
        } else if (data.prediction.total_score <= 19) {
            setMessage("Depresi cukup berat ditandai dengan gejala-gejala depresi yang lebih parah dan secara signifikan mengganggu kemampuan individu untuk berfungsi dalam kehidupan sehari-hari. Perasaan sedih yang mendalam dan terus-menerus, kehilangan minat atau kesenangan pada hampir semua hal, perubahan drastis pada berat badan atau nafsu makan, gangguan tidur yang parah, kelelahan ekstrem, perasaan tidak berharga atau bersalah yang kuat, kesulitan berkonsentrasi yang besar, serta kemungkinan munculnya pikiran tentang kematian atau bunuh diri menjadi ciri khas kategori ini.");
            setMessageTwo("Lakukan tindakan segera untuk mencari bantuan profesional sangat penting. Hubungi psikolog, psikiater, atau layanan kesehatan mental terdekat. Pertimbangkan pengobatan dengan antidepresan yang diresepkan oleh psikiater, yang seringkali efektif jika dikombinasikan dengan terapi psikologis yang intensif. Dukungan emosional dan praktis dari keluarga dan teman-teman sangat dibutuhkan, dan penting untuk memastikan individu tersebut merasa didukung dan tidak sendirian. Jika muncul pikiran untuk menyakiti diri sendiri, segera cari bantuan darurat dan pastikan individu berada di lingkungan yang aman.");
        } else {
            setMessage("Kategori depresi berat merupakan tingkat depresi yang paling serius, di mana gejala-gejala yang dialami menjadi sangat intens dan melumpuhkan. Individu dalam kategori ini mungkin mengalami kesulitan ekstrem dalam menjalankan aktivitas sehari-hari, bahkan tugas-tugas yang paling sederhana. Perasaan sedih yang mendalam dan terus-menerus, kehilangan minat atau kesenangan pada hampir semua aspek kehidupan, perubahan berat badan atau nafsu makan yang signifikan, gangguan tidur yang parah (insomnia atau hipersomnia), kelelahan yang luar biasa, perasaan tidak berharga atau bersalah yang mendalam, kesulitan berkonsentrasi yang parah, serta pikiran tentang kematian atau bunuh diri yang berulang dan intens menjadi ciri khas kondisi ini. Gejala fisik seperti agitasi atau perlambatan psikomotor juga mungkin terlihat jelas.");
            setMessageTwo("Dalam situasi depresi berat, intervensi krisis dan bantuan profesional segera adalah suatu keharusan. Individu yang berada dalam kategori ini memerlukan evaluasi dan penanganan komprehensif dari psikiater dan profesional kesehatan mental lainnya. Pengobatan dengan antidepresan dan pemantauan ketat oleh psikiater sangat penting, dan seringkali dikombinasikan dengan terapi psikologis yang intensif. Lingkungan yang aman dan mendukung, serta dukungan tanpa henti dari keluarga dan teman-teman, memainkan peran krusial dalam proses pemulihan. Jika terdapat risiko bunuh diri, langkah-langkah keamanan dan dukungan darurat harus segera diambil. Pemulihan dari depresi berat adalah proses yang membutuhkan waktu dan dukungan yang berkelanjutan.");
        }
      } else {
        alert("Gagal memuat hasil prediksi.");
        navigate("/questionnaire")
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat mengambil data.");
    } finally {
      setLoading(false); // set loading false setelah selesai mengambil data
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-container d-flex justify-content-center align-items-center container-result">
        <div className="login-card p-4 shadow-lg card-result">
          <h2 className="text-center mb-3 h2-result">HASIL DIAGNOSA</h2>
          <br />

          {loading ? (
            <div className="text-center">
              <p>Harap Isi Kuisioner Terlebih Dahulu</p>
            </div>
          ) : diagnosis ? (
            <div className="text-center">
              <div className="line-result" />
              <strong><p>Total Skor: {diagnosis.prediction.total_score}</p></strong>
              <strong><p>Diagnosis: {diagnosis.prediction.result}</p></strong>
              <div className="line-result" />
              <br />
              <p className="message">{message}</p>
              <p className="message">{message_two}</p>
            </div>
          ) : (
            <div className="text-center">
              <p>Belum ada hasil diagnosa. Silakan isi kuisioner terlebih dahulu.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ResultPage;
