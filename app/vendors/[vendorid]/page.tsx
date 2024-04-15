'use client'

import { usePathname } from 'next/navigation';
import "../styles.css"
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const DynamicPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  if (!session) {
    router.push("/");
    return null;
  }
    function getIdFromPath(path: string): string {
        const startIndex: number = 9;
        if (startIndex !== -1) {
            return path.substring(startIndex, path.length);
        }
        return '';
    }
    
    const pathname = usePathname();
    const Vendorid = getIdFromPath(pathname);

    return (
        <>
        <div className="admin-container">
        <nav className="navbar">
    <div className="navbar-left">
      <h1 className="navbar-title">Vendor Management</h1>
    </div>
    <div className="navbar-right">
      <button className="sign-out-button" onClick={() => signOut()}>
        Sign Out
      </button>
    </div>
  </nav>
  </div>
  </>
    )
}

export default DynamicPage;