import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const decodeToken = (token: string | null): any | undefined => {
  if (token) {
    const decoded = jwtDecode(token);
    return decoded;
  }
};

export const getToken = () => {
  return decodeToken(localStorage.getItem("token"));
};
