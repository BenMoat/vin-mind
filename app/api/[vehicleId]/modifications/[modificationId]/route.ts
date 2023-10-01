import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { modificationId: string } }
) {
  try {
    if (!params.modificationId) {
      return new NextResponse("Modification ID is required", {
        status: 400,
      });
    }

    const modification = await prismadb.modification.findUnique({
      where: {
        id: params.modificationId,
      },
      include: {
        modificationType: true,
      },
    });

    return NextResponse.json(modification);
  } catch (error) {
    console.log("MODIFICATION_GET", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { vehicleId: string; modificationId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, price, modificationTypeId, isObsolete, notes } = body;

    if (!userId) {
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Vehicle name is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
    }

    if (!modificationTypeId) {
      return new NextResponse("Modification Type ID is required", {
        status: 400,
      });
    }

    if (!params.modificationId) {
      return new NextResponse("Modification ID is required", {
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

    const modification = await prismadb.modification.updateMany({
      where: {
        id: params.modificationId,
      },
      data: {
        modName: name,
        price: price,
        modificationTypeId,
        isObsolete,
        notes,
      },
    });

    return NextResponse.json(modification);
  } catch (error) {
    console.log("MODIFICATION_PATCH", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { vehicleId: string; modificationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!params.modificationId) {
      return new NextResponse("Modification ID is required", {
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

    const modification = await prismadb.modification.deleteMany({
      where: {
        id: params.modificationId,
      },
    });

    return NextResponse.json(modification);
  } catch (error) {
    console.log("MODIFICATION_DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
