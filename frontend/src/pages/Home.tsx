import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  CredentialResponse,
} from "@react-oauth/google";
import { login, register, getUser } from "../server/server";

function Home() {
  const [user, setUser] = useState<any>(() =>
    localStorage.getItem("userFormpilot")
      ? JSON.parse(localStorage.getItem("userFormpilot") as string)
      : null
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageMode, setPageMode] = useState<"login" | "register">("register");
  const navigate = useNavigate();

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-neutral-800 to-neutral-900 text-white p-6">
        <div className="bg-neutral-800 rounded-xl shadow-2xl p-8 max-w-md w-full border border-neutral-700">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">CrudLibrary</h1>
            <p className="text-neutral-400 text-sm">Your personal document management system</p>
          </div>
          
          {/* Mode Selector Tabs */}
          <div className="flex mb-6 bg-neutral-900 rounded-lg p-1">
            <button 
              onClick={() => setPageMode("login")}
              className={`flex-1 py-2 rounded-md text-center font-medium transition-all duration-300 ${
                pageMode === "login" 
                  ? "bg-blue-600 text-white shadow-lg" 
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => setPageMode("register")}
              className={`flex-1 py-2 rounded-md text-center font-medium transition-all duration-300 ${
                pageMode === "register" 
                  ? "bg-purple-600 text-white shadow-lg" 
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">
                {pageMode === "login" ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-neutral-400 text-sm">
                {pageMode === "login" 
                  ? "Sign in to access your documents" 
                  : "Join CrudLibrary to manage your documents"
                }
              </p>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {!user ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
                    <div className="w-4 h-4 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-4 h-4 rounded-full bg-pink-500 animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    <span className="text-sm text-neutral-300 ml-2">Authenticating...</span>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center my-4">
                      <div className="flex-grow border-t border-neutral-700"></div>
                      <span className="mx-4 text-sm text-neutral-400">Continue with</span>
                      <div className="flex-grow border-t border-neutral-700"></div>
                    </div>
                    <div className="flex justify-center">
                      <GoogleLogin
                        onSuccess={handleGoogleLogin}
                        onError={() =>
                          setError("Google authentication failed. Please try again.")
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-neutral-700/30 p-4 rounded-lg border border-neutral-700">
                  <p className="text-center text-sm">
                    Logged in as <span className="font-medium">{user.name || user.email}</span>
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <Link to="/dashboard" className="w-full">
                    <button className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg">
                      Go to Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full px-6 py-3 rounded-lg bg-neutral-700 text-white font-semibold hover:bg-neutral-600 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-neutral-500 text-xs">
            &copy; {new Date().getFullYear()} CrudLibrary. All rights reserved.
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

export default Home;