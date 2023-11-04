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

    const {
      registrationNumber,
      taxStatus,
      taxDueDate,
      motStatus,
      motExpiryDate,
    } = body;

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

    const dvlaData = await prismadb.dvlaData.create({
      data: {
        registrationNumber,
        taxStatus,
        taxDueDate,
        motStatus,
        motExpiryDate,
        vehicleId: params.vehicleId,
      },
    });

    return NextResponse.json(dvlaData);
  } catch (error) {
    console.log("[SAVE_ENQUIRY_POST]", error);
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

    const {
      registrationNumber,
      taxStatus,
      taxDueDate,
      motStatus,
      motExpiryDate,
    } = body;

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

    const dvlaData = await prismadb.dvlaData.updateMany({
      where: {
        vehicleId: params.vehicleId,
      },
      data: {
        registrationNumber,
        taxStatus,
        taxDueDate,
        motStatus,
        motExpiryDate,
        vehicleId: params.vehicleId,
      },
    });

    return NextResponse.json(dvlaData);
  } catch (error) {
    console.log("[SAVE_ENQUIRY_PATCH]", error);
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
      return new NextResponse("Unauthorised", { status: 401 });
    }

    if (!params.vehicleId) {
      return new NextResponse("Vehicle ID is required", { status: 400 });
    }

    const dvlaData = await prismadb.dvlaData.deleteMany({
      where: {
        vehicleId: params.vehicleId,
      },
    });

    return NextResponse.json(dvlaData);
  } catch (error) {
    console.log("SAVE_ENQUIRY_DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
