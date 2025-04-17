import LeftNav from "@/components/LeftNav";
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react";
import Logo from "./logo";
import LoginPage from "@/pages/login";
export default function Layout({children}) {

  const [showNav, setShowNav] = useState(false)
  const { data: session } = useSession();

  if (!session){
    return (
      <>
      <LoginPage/>
      <div className="bg-bgGray w-screen h-screen flex items-center justify-center ">
          <button onClick={ () => signIn('google') } className="bg-gray-200 p-2 px-4 rounded-lg cursor-pointer ">
            Login with Google
          </button>
      </div>
      </>)
  }

  return (
    <div className="bg-bgGray min-h-screen flex flex-col md:flex-row">
      <div className="md:hidden flex items-center justify-between p-4 shadow-md">
        <button onClick={() => setShowNav(true)} className="z-50">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
          <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
        </svg>
        </button>
        <div className='flex grow justify-center mr-6'>
          <Logo/>
        </div>
      </div>

      <div className="flex flex-1">
        <LeftNav show={showNav} setShow={setShowNav}/>
        <div className=" flex-grow p-4 w-full">
          {children}
        </div>
      </div>

    </div>
  );
  }
