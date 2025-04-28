import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/homepage";
import LoginPage from "./components/pages/loginpage";
import RegistrationPage from "./components/pages/registrationpage";
import GuidePage from "./components/pages/guidepage";
import QuestionnairePage from "./components/pages/questionnairepage";
import ResultPage from "./components/pages/resultpage";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import ForgotPasswordPage from "./components/pages/forgotpasswordpage";
import ResetPasswordPage from "./components/pages/resetpasswordpage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
        <Route path="/resetpassword" element={<ResetPasswordPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/questionnaire" element={<QuestionnairePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
