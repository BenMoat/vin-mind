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
        modName: "asc",
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

    const { name, price, modificationTypeId, isObsolete, notes } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Modification is required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is required", { status: 400 });
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
        modName: name,
        price,
        modificationTypeId,
        isObsolete,
        notes,
        vehicleId: params.vehicleId,
      },
    });

    return NextResponse.json(modification);
  } catch (error) {
    console.log("[MODIFICATIONS_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
