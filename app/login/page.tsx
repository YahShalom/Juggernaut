import { signInWithEmail } from "@/app/auth/actions";

export default function LoginPage() {

  return (
    <form action={signInWithEmail} className="flex flex-col gap-4">
      <input name="email" type="email" required placeholder="you@example.com" className="border p-2" />

      <button type="submit" className="bg-purple-600 text-white p-2">
        Sign In with Email
      </button>


    </form>
  );
}