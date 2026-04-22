import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../contexts/ToastContext";

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    username: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(loginForm.username, loginForm.password);
      addToast({
        type: "success",
        title: "Login Successful",
        message: `Welcome back, ${loginForm.username}!`,
        duration: 3000,
      });
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "Login failed. Please try again.");
      addToast({
        type: "error",
        title: "Login Failed",
        message: error.message || "Login failed. Please try again.",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Additional validation
    if (registerForm.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return;
    }

    if (registerForm.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (!registerForm.email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      await register(
        registerForm.username,
        registerForm.email,
        registerForm.password,
      );
      addToast({
        type: "success",
        title: "Registration Successful",
        message: `Welcome to RPG Bank, ${registerForm.username}! Your account has been created.`,
        duration: 4000,
      });
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message || "Registration failed. Please try again.");
      addToast({
        type: "error",
        title: "Registration Failed",
        message: error.message || "Registration failed. Please try again.",
        duration: 6000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-yellow-400 font-pixel flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-400 animate-glow mb-2">
            RPG BANK
          </h1>
          <p className="text-yellow-300">
            {isLogin ? "Guild Entrance" : "Adventurer Registration"}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-gray-900 border-4 border-yellow-400 rounded-lg p-8 shadow-2xl">
          {error && (
            <div className="bg-red-900 border-2 border-red-400 text-red-200 p-3 rounded mb-4 text-center">
              {error}
            </div>
          )}

          {isLogin ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Adventurer Name
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, username: e.target.value })
                  }
                  className="w-full bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-3 rounded focus:outline-none focus:border-yellow-300"
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Secret Password
                </label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="w-full bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-3 rounded focus:outline-none focus:border-yellow-300"
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 text-black font-bold py-3 px-4 rounded text-lg transition-all transform hover:scale-105"
              >
                {isLoading ? "Entering Guild..." : "Enter Guild"}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Adventurer Name
                </label>
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      username: e.target.value,
                    })
                  }
                  className="w-full bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-3 rounded focus:outline-none focus:border-yellow-300"
                  placeholder="Choose your username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Magic Mail
                </label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  className="w-full bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-3 rounded focus:outline-none focus:border-yellow-300"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Secret Password
                </label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  className="w-full bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-3 rounded focus:outline-none focus:border-yellow-300"
                  placeholder="Create your password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-black border-2 border-yellow-400 text-yellow-400 px-4 py-3 rounded focus:outline-none focus:border-yellow-300"
                  placeholder="Confirm your password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 text-black font-bold py-3 px-4 rounded text-lg transition-all transform hover:scale-105"
              >
                {isLoading ? "Registering..." : "Register Adventurer"}
              </button>
            </form>
          )}

          {/* Toggle between login and register */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-yellow-300 hover:text-yellow-400 underline"
            >
              {isLogin
                ? "New adventurer? Register here!"
                : "Already registered? Enter guild!"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-yellow-300 text-sm animate-pulse">
            Begin your epic financial adventure!
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
