"use client";

import { signIn } from "next-auth/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/vendors");
    return null;
  }
  const handleGoogleSignIn = () => {
    signIn("google");
  };

  return (
    <div className="container">
      <h1 className="heading">Vendor Management</h1>
      <button className="button" onClick={handleGoogleSignIn}>
        Sign in with Google
      </button>
    </div>
  );
}
