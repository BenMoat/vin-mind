import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-up");
  }

  const vehicle = await prismadb.vehicle.findFirst({
    where: {
      userId,
    },
  });

  if (vehicle) {
    redirect(`/${vehicle.slug}`);
  }

  return <>{children}</>;
}
