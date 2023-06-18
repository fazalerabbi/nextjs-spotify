
import { createContext, useContext } from "react";
import { User } from "@supabase/auth-helpers-nextjs";

import { Subscription, UserDetails } from "@/types";

type userContextType = {
    accessToken: string | null;
    user: User | null;
    userDetails: UserDetails | null;
    isLoading: boolean;
    subscription: Subscription | null;
}

export const UserContext = createContext<userContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a MyUserContextProvider");
    }

    return context;
}