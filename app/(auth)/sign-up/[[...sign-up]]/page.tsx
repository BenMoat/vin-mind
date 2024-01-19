import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function Page() {
  return (
    <SignUp afterSignUpUrl="/get-started" appearance={{ baseTheme: dark }} />
  );
}
