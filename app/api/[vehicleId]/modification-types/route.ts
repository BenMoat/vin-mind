import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    if (!params.vehicleId) {
      return new NextResponse("Vehicle ID is required", { status: 400 });
    }

    const modificationTypes = await prismadb.modificationType.findMany({
      where: {
        vehicleId: params.vehicleId,
      },
    });

    return NextResponse.json(modificationTypes);
  } catch (error) {
    console.log("[MODIFICATION-TYPES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Modification Type is required", { status: 400 });
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

    const modificationType = await prismadb.modificationType.create({
      data: {
        name,
        vehicleId: params.vehicleId,
      },
    });

    return NextResponse.json(modificationType);
  } catch (error) {
    console.log("[MODIFICATION-TYPES_POST]", error);
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

    const modificationType = await prismadb.modificationType.deleteMany({
      where: {
        vehicleId: params.vehicleId,
      },
    });

    console.log(modificationType);
    return NextResponse.json(modificationType);
  } catch (error) {
    console.log("MODIFICATION-TYPES_DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
