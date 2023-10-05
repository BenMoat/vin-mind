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
        files: true,
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

    const { name, price, modificationTypeId, isObsolete, notes, files } = body;

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

    await prismadb.modification.update({
      where: {
        id: params.modificationId,
      },
      data: {
        name,
        price,
        modificationTypeId,
        isObsolete,
        notes,
        files: {
          deleteMany: {},
        },
      },
    });

    const modification = await prismadb.modification.update({
      where: {
        id: params.modificationId,
      },
      data: {
        files: {
          createMany: {
            data: [...files.map((file: { url: string }) => file)],
          },
        },
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
