import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import agent from "../api/agent";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "../api/models";
import { toast } from "sonner";

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (loginData: LoginRequest) => {
      return agent.auth.login(loginData);
    },
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success(`Welcome back, ${data.username}!`);
      navigate("/orders");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (registerData: RegisterRequest) => {
      return agent.auth.register(registerData);
    },
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem("token", data.token);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("Registration successful!");
      navigate("/orders");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return {
    logout: () => {
      localStorage.removeItem("token");
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/");
    },
  };
};

export const useCurrentUser = () => {
  const token = localStorage.getItem("token");

  const getDecodedToken = () => {
    if (!token) return null;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      return {
        username: decoded.sub,
        userId: decoded.userId,
        exp: decoded.exp,
      };
    } catch (error) {
      return null;
    }
  };

  const decodedToken = getDecodedToken();

  const isAuthenticated = () => {
    if (!decodedToken) return false;

    const expirationTime = decodedToken.exp * 1000;
    if (Date.now() >= expirationTime) {
      localStorage.removeItem("token");
      return false;
    }

    return true;
  };

  return {
    isAuthenticated: isAuthenticated(),
    username: decodedToken?.username || null,
    userId: decodedToken?.userId || null,
    decodedToken,
  };
};
