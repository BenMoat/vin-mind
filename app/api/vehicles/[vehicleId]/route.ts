import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

import generateSlug from "@/lib/util-types/slug-utils";

export async function PATCH(
  req: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Vehicle name is required", { status: 400 });
    }

    if (!params.vehicleId) {
      return new NextResponse("Vehicle ID is required", { status: 400 });
    }

    const slug = generateSlug(name);

    const vehicle = await prismadb.vehicle.updateMany({
      where: {
        id: params.vehicleId,
        userId,
      },
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.log("VEHICLE_PATCH", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!params.vehicleId) {
      return new NextResponse("Vehicle ID is required", { status: 400 });
    }

    const vehicle = await prismadb.vehicle.deleteMany({
      where: {
        id: params.vehicleId,
        userId,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.log("VEHICLE_DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
