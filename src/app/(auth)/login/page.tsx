// import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/Forms/login-form"
import Image from "next/image"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden items-center bg-[#f6fff9] lg:flex">
        <Image
          src="/images/login-cover.svg"
          width={1000}
          height={1000}
          alt="Image"
          className="absolute inset-0 h-[800px] w-[800px] mx-auto self-center object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">

        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
