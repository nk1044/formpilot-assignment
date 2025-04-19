import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../server/server";

function Auth({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkUser = async () => {
    const storedToken = localStorage.getItem("tokenFormpilot");
    if (!storedToken) {
      return null;
    }

    try {
      const currentUser = await getUser(storedToken);
      console.log("Current user:", currentUser.user);
      if (currentUser) {
        localStorage.setItem("userFormpilot", JSON.stringify(currentUser.user));
        return currentUser;
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }

    // Cleanup if token is invalid or user not found
    localStorage.removeItem("tokenFormpilot");
    localStorage.removeItem("userFormpilot");
    return null;
  };

  useEffect(() => {
    const init = async () => {
      const user = await checkUser();
      if (!user) {
        navigate("/");
      } else {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center text-white">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}

export default Auth;
