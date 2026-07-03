import { SignIn, GoogleOneTap } from '@clerk/nextjs'

export default function SignInPage() {
    return (
        <>
            <GoogleOneTap />
            <SignIn />
        </>
    )
}

