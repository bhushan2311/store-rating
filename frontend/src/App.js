import "./App.css";
import StoreOwnerDashboard from "./components/StoreOwnerDashboard";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Protected } from "./auth/protected";
import AppProvider from "./context";

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/user-dashboard"
            element={
              <Protected>
                <UserDashboard />
              </Protected>
            }
          />
          <Route
            path="/store-owner-dashboard"
            element={
              <Protected>
                <StoreOwnerDashboard />
              </Protected>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <Protected>
                <AdminDashboard />
              </Protected>
            }
          />
          <Route path="/" element={<Login />} /> {/* Default route */}
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
