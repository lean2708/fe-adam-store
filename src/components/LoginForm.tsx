"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { signInAction } from "@/actions/authActions";
import { useAuthStore } from "@/stores/authStore"; // adjust path if needed

// Example schema
const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const signIn = useAuthStore((state) => state.signIn);
  const [values, setValues] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function formSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    const parseResult = formSchema.safeParse(values);
    if (!parseResult.success) {
      alert("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("username", values.username);
    formData.append("password", values.password);

    const res = await signInAction(formData);

    setIsLoading(false);

    if (res.success) {
      alert(res.message);
      if (res.data) {
        signIn(res.data);
        router.push("/");
        return;
      }
    }

    alert(res.message);
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <input
        type="text"
        placeholder="Username"
        value={values.username}
        onChange={e => setValues(v => ({ ...v, username: e.target.value }))}
        disabled={isLoading}
      />
      <input
        type="password"
        placeholder="Password"
        value={values.password}
        onChange={e => setValues(v => ({ ...v, password: e.target.value }))}
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
