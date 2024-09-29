"use client";

import { useSession } from 'next-auth/react';
import { redirect, useSearchParams } from 'next/navigation';
import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    const { status } = useSession()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl")

    if (status === "authenticated") {
        if (callbackUrl) {
            return redirect(callbackUrl)
        } else {
            return redirect("/")
        }
    }


    return (
        <div>
            {children}
        </div>
    )
}

export default AuthLayout
