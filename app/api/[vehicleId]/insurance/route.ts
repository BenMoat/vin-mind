import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { startDate, endDate, isInsured } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.vehicleId) {
      return new NextResponse("Vehicle ID is required", { status: 400 });
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

    const modificationType = await prismadb.insurance.create({
      data: {
        startDate,
        endDate,
        isInsured,
        vehicleId: params.vehicleId,
      },
    });

    return NextResponse.json(modificationType);
  } catch (error) {
    console.log("[INSURANCE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { startDate, endDate, isInsured } = body;

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

    const modificationType = await prismadb.insurance.updateMany({
      where: {
        vehicleId: params.vehicleId,
      },
      data: {
        startDate,
        endDate,
        isInsured,
      },
    });

    return NextResponse.json(modificationType);
  } catch (error) {
    console.log("INSURANCE_PATCH", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
