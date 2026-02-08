'use client';

import { useGetUserProfileQuery } from "@/store/api/[module]/userApi";
import { setUser } from "@/store/slice/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export default function AuthInitializer() {
    const dispatch = useDispatch();

    // Skip query if we already have a user? 
    // Actually cleaner to always try fetching on mount to validate session/cookie
    const { data: user, error, isLoading } = useGetUserProfileQuery();

    useEffect(() => {
        if (user) {
            // console.log("AuthInitializer: User restored from session", user);
            dispatch(setUser({
                id: user.id || '',
                email: user.email || '',
                name: user.full_name || '',
                role: user.role || '',
                phone: user.phone_number,
                location: user.location,
            }));
        }
        // Handle error if needed, e.g., clear user if 401
        if (error) {
            // console.log("AuthInitializer: Failed to restore user", error);
            // Optional: dispatch(signOut()) if we want to be strict, but invalid session usually means just guest state
        }
    }, [user, error, dispatch]);

    return null; // This component renders nothing
}
