"use client"

import { useAuth } from "@clerk/nextjs"
import { useQuery } from "@tanstack/react-query";

export default function Testing () {
    const  user = useAuth();

    console.log(user)

   /*  const currentUser = useQuery({
        queryKey: ["currentUser"]
    }) */


    return (
        <div>
            testing
        </div>
    )
}