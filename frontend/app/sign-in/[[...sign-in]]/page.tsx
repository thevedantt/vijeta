import { SignIn, GoogleOneTap } from '@clerk/nextjs'

export default function SignInPage() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <GoogleOneTap />
            <SignIn />
        </div>
    )
}

