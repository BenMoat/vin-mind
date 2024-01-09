import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Footer from "@/components/footer";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    return <>{children}</>;
  }

  //Sort vehicles by name and redirect to the first one
  const vehicles = await prismadb.vehicle.findMany({
    where: {
      userId,
    },
    orderBy: { name: "asc" },
  });

  const vehicle = vehicles[0];

  if (vehicle) {
    redirect(`/${vehicle.id}`);
  }

  return <>{children}</>;
}
