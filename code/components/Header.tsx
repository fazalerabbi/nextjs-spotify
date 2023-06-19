"use client";

import { useRouter } from "next/navigation";
import { FC, ReactNode } from "react"
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModel";

interface HeaderProps {
    children: ReactNode;
    className?: string
}

const Header: FC<HeaderProps> = ({ children, className }) => {
    const router = useRouter();
    const authModal = useAuthModal();
    return (
        <div className={twMerge(`h-fit bg-gradient-to-b from-emerald-800 p-6`, className)}>
            <div className="w-full mb-4 flex items-center justify-between">
                <div className="hidden md:flex gap-x-2 items-center">
                    <button
                        className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
                        onClick={() => router.back()}
                    >
                        <RxCaretLeft size={35} className="text-white" />
                    </button>
                    <button
                        className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
                        onClick={() => router.forward()}
                    >
                        <RxCaretRight size={35} className="text-white" />
                    </button>
                </div>
                <div className="flex md:hidden gap-x-2 items-center">
                    <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
                        <HiHome size={20} className="text-black" />
                    </button>
                    <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition">
                        <BiSearch size={20} className="text-black" />
                    </button>
                </div>

                <div className="flex justify-between items-center gap-x-4">
                    <>
                        <div>
                            <Button
                                onClick={authModal.onOpen}
                                className="bg-transparent text-neutral-300 font-medium"
                            >
                                Sign up
                            </Button>
                        </div>
                        <div>
                            <Button
                                onClick={authModal.onOpen}
                                className="bg-white px-6 py-2"
                            >
                                Login
                            </Button>
                        </div>
                    </>
                </div>
            </div>
            {children}
        </div>
    )
}

export default Header;