import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, registrationNumber } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Vehicle name is required", { status: 400 });
    }

    const vehicle = await prismadb.vehicle.create({
      data: {
        name,
        registrationNumber,
        userId,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.log("[VEHICLES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
