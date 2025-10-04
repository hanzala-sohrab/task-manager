"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "../components/AuthForm";
import { authApi, LoginResponse } from "../services/api";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (email: string, password: string, name?: string) => {
    setIsLoading(true);

    try {
      if (name) {
        // Sign up flow
        await authApi.register(email, password);
      }

      // Login flow
      const loginData: LoginResponse = await authApi.login(email, password);
      console.log("Login successful:", loginData);

      // Store user data and token if provided
      const userData = {
        email,
        name: loginData.user?.name || name,
      };

      // Store access token in localStorage if provided by backend
      if (loginData.access_token) {
        localStorage.setItem("authToken", loginData.access_token);
        localStorage.setItem("tokenType", loginData.token_type || "bearer");
        localStorage.setItem("userData", JSON.stringify(userData));
      }

      // alert(
      //   `${
      //     name ? "Account created and signed in" : "Signed in"
      //   } successfully! Welcome${userData.name ? ` ${userData.name}` : ""}!`
      // );

      // Redirect to tasks page after successful login
      router.push("/tasks");
    } catch (error) {
      console.error("Authentication error:", error);
      // alert(
      //   error instanceof Error
      //     ? error.message
      //     : "Authentication failed. Please try again."
      // );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <AuthForm onSubmit={handleAuth} isLoading={isLoading} />
    </div>
  );
}
