import React, { useState } from 'react'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

function FreeTrialButton() {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [isOpen, setIsOpen] = useState(false)

    const mutation = useMutation({
        mutationFn: (phone: string) =>
            axios.post('/api/auth/stripe/free-trial', { phoneNumber: phone }),
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutation.mutate(phoneNumber)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Start Free Trial</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Enter Your Phone Number</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className="col-span-3"
                            placeholder="Enter your phone number"
                        />  
                    </div>
                    <Button type="submit" disabled={mutation.isPending} className="ml-auto">
                        {mutation.isPending ? "Activating..." : "Activate Free Trial"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default FreeTrialButton