import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load authentication state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setToken(storedToken);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Save token and user to localStorage whenever they change
  useEffect(() => {
    if (token && user) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }, [token, user]);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });

      const { token: jwtToken, userId, username: userName } = response.data;

      setUser({
        id: userId,
        username: userName,
        email: "",
      });
      setToken(jwtToken);
    } catch (error: any) {
      console.error("Login error:", error);

      // Enhanced error messages based on response
      let errorMessage = "Login failed. Please try again.";

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 400:
            errorMessage =
              "Invalid username or password format. Please check your inputs.";
            break;
          case 401:
            errorMessage = "Invalid username or password. Please try again.";
            break;
          case 403:
            errorMessage = "Account is locked. Please contact support.";
            break;
          case 404:
            errorMessage =
              "User not found. Please check your username or register.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage = data.message || "Login failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/auth/register", {
        username,
        email,
        password,
      });

      const { token: jwtToken, userId, username: userName } = response.data;

      setUser({
        id: userId,
        username: userName,
        email,
      });
      setToken(jwtToken);
    } catch (error: any) {
      console.error("Registration error:", error);

      // Enhanced error messages based on response
      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 400:
            if (data.message?.includes("username")) {
              errorMessage =
                "Username already exists. Please choose a different username.";
            } else if (data.message?.includes("email")) {
              errorMessage =
                "Email already registered. Please use a different email.";
            } else if (data.message?.includes("password")) {
              errorMessage =
                "Password is too weak. Please use a stronger password.";
            } else {
              errorMessage =
                data.message ||
                "Invalid registration data. Please check your inputs.";
            }
            break;
          case 409:
            errorMessage =
              "Username or email already exists. Please try different credentials.";
            break;
          case 422:
            errorMessage =
              "Invalid input data. Please check all fields and try again.";
            break;
          case 500:
            errorMessage = "Server error. Please try again later.";
            break;
          default:
            errorMessage =
              data.message || "Registration failed. Please try again.";
        }
      } else if (error.request) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      }

      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
