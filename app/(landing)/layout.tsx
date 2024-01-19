import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import Footer from "@/components/footer";
import { LandingNavbar } from "./components/landing-navbar";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) {
    return (
      <div className="bg-[#060609] text-white dark">
        <LandingNavbar />
        <main className="container">{children}</main>
        <Footer />
      </div>
    );
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
}
