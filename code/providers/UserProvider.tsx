"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { useSessionContext, useUser as useSupaUser } from "@supabase/auth-helpers-react";
import { Subscription, UserDetails } from "@/types";
import { UserContext } from "@/hooks/useUser";

interface UserProviderProps {
    children: ReactNode
}

export interface Props {
    [propsName: string]: any;
}

export const MyUserContextProvider = (props: Props) => {
    const { session, isLoading: isLoadingUser, supabaseClient: supabase } = useSessionContext();

    const user = useSupaUser();
    const accessToken = session?.access_token ?? null;

    const [isLoadingData, setIsLoadingData] = useState<boolean>(false);
    const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
    const [subscription, setSubscription] = useState<Subscription | null>(null);

    const getUserDetails = () => supabase
        .from('users')
        .select('*')
        .single();
    const getSubscription = () => supabase
        .from('subscriptions')
        .select('*, prices(*, products(*))')
        .in('status', ['trialing', 'active'])
        .single();

    useEffect(() => {
        if (user && !isLoadingData && !userDetails && !subscription) {
            setIsLoadingData(true);

            Promise.allSettled([getUserDetails(), getSubscription()]).then((result) => {
                const userDetailsPromise = result[0];
                const subscriptionPromise = result[1];

                if (userDetailsPromise.status == 'fulfilled') {
                    setUserDetails(userDetailsPromise.value.data as UserDetails);
                }
                if (subscriptionPromise.status == 'fulfilled') {
                    setSubscription(subscriptionPromise.value.data as Subscription);
                }

                setIsLoadingData(false);
            })
        } else if (!user && !isLoadingUser && !isLoadingData) {
            setUserDetails(null);
            setSubscription(null);
        }
    }, [user, isLoadingUser]);

    const value = {
        accessToken,
        user,
        userDetails,
        isLoading: isLoadingUser || isLoadingData,
        subscription
    };

    return <UserContext.Provider value={value} {...props} />
}

const UserProvider: FC<UserProviderProps> = ({ children }) => {
    return (
        <MyUserContextProvider>
            {children}
        </MyUserContextProvider>
    );
}

export default UserProvider;