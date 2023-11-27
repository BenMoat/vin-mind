import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { vehicleId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);

    const modificationTypeId =
      searchParams.get("modificationTypeId") || undefined;
    const isObsolete = searchParams.get("isObsolete");

    if (!params.vehicleId) {
      return new NextResponse("Vehicle ID is required", { status: 400 });
    }

    const modifications = await prismadb.modification.findMany({
      where: {
        vehicleId: params.vehicleId,
        modificationTypeId,
        isObsolete: isObsolete ? true : undefined,
      },
      include: {
        modificationType: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(modifications);
  } catch (error) {
    console.log("[MODIFICATIONS_GET]", error);
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

    let { name, price, modificationTypeId, isObsolete, notes, files } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Modification is required", { status: 400 });
    }

    if (!price) {
      price = 0;
    }

    if (!modificationTypeId) {
      return new NextResponse("Modification Type ID is required", {
        status: 400,
      });
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

    const modification = await prismadb.modification.create({
      data: {
        name,
        price,
        modificationTypeId,
        isObsolete,
        notes,
        vehicleId: params.vehicleId,
        files: {
          createMany: {
            data: [...files.map((file: { url: string }) => file)],
          },
        },
      },
    });

    return NextResponse.json(modification);
  } catch (error) {
    console.log("[MODIFICATIONS_POST]", error);
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

    const modification = await prismadb.modification.deleteMany({
      where: {
        vehicleId: params.vehicleId,
      },
    });

    console.log(modification);
    return NextResponse.json(modification);
  } catch (error) {
    console.log("MODIFICATIONS_DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
