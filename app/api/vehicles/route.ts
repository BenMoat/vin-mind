import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

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

    return NextResponse.json(vehicle);
  } catch (error) {
    console.log("[VEHICLES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
