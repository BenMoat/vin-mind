import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { insurance, mileage, taxAndMot, totalModifications } = body;

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    const vehicleByUserId = await prismadb.vehicle.findFirst({
      where: {
        id: params.vehicleId,
        userId,
      },
    });

    if (!vehicleByUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const dashboardConfigure = await prismadb.dashboardConfigure.updateMany({
      where: {
        vehicleId: params.vehicleId,
      },
      data: {
        insurance,
        mileage,
        taxAndMot,
        totalModifications,
      },
    });

    return NextResponse.json(dashboardConfigure);
  } catch (error) {
    console.log("DASHBOARD-CONFIGURE_PATCH", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
