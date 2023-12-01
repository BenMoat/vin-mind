import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    let {
      provider,
      type,
      mileage,
      details,
      cost,
      serviceDate,
      nextServiceDate,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!cost) {
      cost = 0;
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

    const servicing = await prismadb.serviceHistory.create({
      data: {
        vehicleId: params.vehicleId,
        provider,
        type,
        mileage,
        details,
        cost,
        serviceDate,
        nextServiceDate,
      },
    });

    return NextResponse.json(servicing);
  } catch (error) {
    console.log("[SERVICING_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
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

    const servicing = await prismadb.serviceHistory.deleteMany({
      where: {
        vehicleId: params.vehicleId,
      },
    });

    console.log(servicing);
    return NextResponse.json(servicing);
  } catch (error) {
    console.log("SERVICING_DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
