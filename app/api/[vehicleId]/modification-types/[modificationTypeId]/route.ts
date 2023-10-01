import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { modificationTypeId: string } }
) {
  try {
    if (!params.modificationTypeId) {
      return new NextResponse("Modification Type ID is required", {
        status: 400,
      });
    }

    const modificationType = await prismadb.modificationType.findUnique({
      where: {
        id: params.modificationTypeId,
      },
    });

    return NextResponse.json(modificationType);
  } catch (error) {
    console.log("MODIFICATION-TYPE_GET", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { vehicleId: string; modificationTypeId: string } }
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

    if (!params.modificationTypeId) {
      return new NextResponse("Modification Type ID is required", {
        status: 400,
      });
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

    const modificationType = await prismadb.modificationType.updateMany({
      where: {
        id: params.modificationTypeId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(modificationType);
  } catch (error) {
    console.log("MODIFICATION-TYPE_PATCH", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { vehicleId: string; modificationTypeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.vehicleId) {
      return new NextResponse("Modification Type ID is required", {
        status: 400,
      });
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
        id: params.modificationTypeId,
      },
    });

    return NextResponse.json(modificationType);
  } catch (error) {
    console.log("MODIFICATION-TYPE_DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
