"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    // Redirect to the login page if the user is not logged in
    router.push("/admin");
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
