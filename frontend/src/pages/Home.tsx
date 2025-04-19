import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { login, register, getUser } from "../server/server";

function Home() {
  const [user, setUser] = useState<any>(() =>
    localStorage.getItem("userFormpilot")
      ? JSON.parse(localStorage.getItem("userFormpilot") as string)
      : null
  );
  const [error, setError] = useState<string | null>(null);
  const [pageMode, setPageMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        const response =
          pageMode === "login"
            ? await login(credentialResponse.credential)
            : await register(credentialResponse.credential);

        setUser(response.user);
        localStorage.setItem("tokenFormpilot", response.token);
        localStorage.setItem("userFormpilot", JSON.stringify(response.user));
        setError(null);
      } catch (error) {
        console.error("Error during Google authentication:", error);
        setError("Google authentication failed. Please try again.");
      }
    } else {
      setError("Failed to retrieve Google credentials.");
    }
  };

  useEffect(() => {
    const init = async () => {
      const storedToken = localStorage.getItem("tokenFormpilot");
      if (storedToken) {
        try {
          const currentUser = await getUser(storedToken);
          if (currentUser) {
            setUser(currentUser);
            localStorage.setItem("userFormpilot", JSON.stringify(currentUser));
          }
        } catch (error) {
          console.error("Error fetching current user:", error);
          localStorage.removeItem("tokenFormpilot");
          localStorage.removeItem("userFormpilot");
          setUser(null);
        }
      }
    };
    init();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("tokenFormpilot");
    localStorage.removeItem("userFormpilot");
    setUser(null);
    navigate("/");
  };

  return (
    <GoogleOAuthProvider clientId={String(import.meta.env.VITE_GOOGLE_CLIENT_ID)}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white p-6">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-wide">Welcome to CrudLibrary</h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Manage your content effortlessly with our sleek CRUD system. Log in to get started!
          </p>

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

          {!user ? (
            <div className="w-full flex justify-center mb-4">
              <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => setError("Google authentication failed. Please try again.")}
              />
            </div>
          ) : (
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <button className="px-6 py-3 rounded-lg bg-white text-neutral-900 font-semibold hover:bg-gray-200 transition-all duration-300">
                  Go to Dashboard
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-all duration-300"
              >
                Logout
              </button>
            </div>
          )}

          {!user && (
            <p className="text-center cursor-pointer text-neutral-400 mt-6 text-sm">
              {pageMode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <span
                    className="text-white hover:underline"
                    onClick={() => setPageMode("register")}
                  >
                    Register here
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    className="text-white hover:underline"
                    onClick={() => setPageMode("login")}
                  >
                    Login
                  </span>
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Home;
