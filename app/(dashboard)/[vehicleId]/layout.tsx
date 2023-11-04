import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { vehicleId: string };
}) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const vehicle = await prismadb.vehicle.findFirst({
    where: {
      id: params.vehicleId,
      userId,
    },
  });

  if (!vehicle) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      <main className="container">{children}</main>
      <Footer />
    </>
  );
}
