import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ExecutiveForm from "./Components/ExecutiveBriefForm";
import LoginForm from "./Components/Login";
import { Toaster } from "sonner";

const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  return !!token && !!user;
};

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>

        <Route path="/login" element={<LoginForm />} />

        <Route path="/executive-form"
          element={
            <ProtectedRoute>
              <ExecutiveForm />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;