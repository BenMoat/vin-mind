import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { vehicleId: string; modificationId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    let { url } = body;

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

    const file = await prismadb.files.create({
      data: {
        modificationId: params.modificationId,
        url: url,
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.log("[FILE_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { vehicleId: string; modificationId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    let { url } = body;

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

    const file = await prismadb.files.deleteMany({
      where: {
        url: url,
      },
    });

    return NextResponse.json(file);
  } catch (error) {
    console.log("[FILE_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
