import React, { ReactNode } from 'react'

interface ContainerProps {
    children: ReactNode
}

export default function Container({ children }: ContainerProps) {
    return (
        <div className='max-w-7xl px-5 mx-auto'>
            {children}
        </div>
    )
}