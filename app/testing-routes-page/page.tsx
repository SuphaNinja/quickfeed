"use client"

import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function Testing() {
    const { userId } = useAuth();

    const { data: currentUser, isLoading, error } = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => axios.get("/api/user-routes/get-current-user"),
        enabled: !!userId 
    });

    if (isLoading) return <div>Loading...<button onClick={() => console.log(currentUser)}>test</button></div>;
    if (error) return <div>An error occurred: {error.message} <button onClick={() => console.log(currentUser)}>test</button></div>;

    console.log("Current user data:", currentUser);

    return (
        <div>
            <h1>Testing</h1>
            <p>User ID: {userId}</p>
            <pre><button onClick={() => console.log(currentUser)}>test</button></pre>
        </div>
    );
}