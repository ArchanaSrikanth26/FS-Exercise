import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CustomerStore from "./pages/customer/CustomerStore";

/*
  App manages the top-level "page" state:
    "landing"  → choose Login as Admin or Customer
    "login"    → login form
    "signup"   → signup form
    "admin"    → admin dashboard (sidebar layout)
    "customer" → customer product store
*/
export default function App() {

  const [page, setPage] = useState("landing");

  // loginHint is "ADMIN" or "CUSTOMER" - pre-selects role on login page
  const [loginHint, setLoginHint] = useState(null);

  // currentUser holds the logged-in user object from the API
  const [currentUser, setCurrentUser] = useState(null);

  // called after successful login
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setPage(user.role === "ADMIN" ? "admin" : "customer");
  };

  // logout - go back to landing
  const handleLogout = () => {
    setCurrentUser(null);
    setPage("landing");
    setLoginHint(null);
  };

  if (page === "landing") {
    return (
      <LandingPage
        onLoginAsAdmin={() => { setLoginHint("ADMIN"); setPage("login"); }}
        onLoginAsCustomer={() => { setLoginHint("CUSTOMER"); setPage("login"); }}
        onSignup={() => setPage("signup")}
      />
    );
  }

  if (page === "login") {
    return (
      <LoginPage
        hint={loginHint}
        onSuccess={handleLoginSuccess}
        onBack={() => setPage("landing")}
        onSignup={() => setPage("signup")}
      />
    );
  }

  if (page === "signup") {
    return (
      <SignupPage
        onSuccess={() => setPage("login")}
        onBack={() => setPage("landing")}
      />
    );
  }

  if (page === "admin") {
    return (
      <AdminDashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  if (page === "customer") {
    return (
      <CustomerStore
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

}
