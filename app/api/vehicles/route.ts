import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request) {
  try {
    const { userId } = auth();

    const url = new URL(req.url);
    const vehicleName = url.searchParams.get("vehicleName");

    if (!vehicleName) {
      return new NextResponse("Vehicle name is required as a query parameter", {
        status: 400,
      });
    }

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const vehicle = await prismadb.vehicle.findFirst({
      where: {
        name: vehicleName,
        userId,
      },
    });

    return NextResponse.json({ exists: Boolean(vehicle) });
  } catch (error) {
    console.error("[VEHICLES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      registrationNumber,
      taxStatus,
      taxDueDate,
      motStatus,
      motExpiryDate,
    } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Vehicle name is required", { status: 400 });
    }

    let vehicle;

    if (!registrationNumber) {
      vehicle = await prismadb.vehicle.create({
        data: {
          name,
          userId,
        },
      });
    } else {
      vehicle = await prismadb.vehicle.create({
        data: {
          name,
          userId,
          dvlaData: {
            create: {
              registrationNumber,
              taxStatus,
              taxDueDate,
              motStatus,
              motExpiryDate,
            },
          },
        },
      });
    }

    //Create dashboard configuration with all info cards visible
    await prismadb.dashboardConfigure.create({
      data: {
        vehicleId: vehicle.id,
        taxAndMot: true,
        insurance: true,
        totalModifications: true,
        mileage: true,
        servicing: true,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.log("[VEHICLES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
