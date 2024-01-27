import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

import generateSlug from "@/lib/util-types/slug-utils";
import {
  removeFilesFromAlbum,
  removeVehicleFolder,
} from "@/app/actions/cloudinary-api";

export async function PATCH(
  req: Request,
  { params }: { params: { vehicleId: string } }
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

    if (!params.vehicleId) {
      return new NextResponse("Vehicle ID is required", { status: 400 });
    }

    const slug = generateSlug(name);

    const vehicle = await prismadb.vehicle.updateMany({
      where: {
        id: params.vehicleId,
        userId,
      },
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(vehicle);
  } catch (error) {
    console.log("VEHICLE_PATCH", error);
    return new NextResponse("Internal server error", { status: 500 });
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

    const vehicle = await prismadb.vehicle.findFirst({
      where: {
        id: params.vehicleId,
        userId,
      },
      include: {
        images: true,
        modifications: {
          include: {
            files: true,
          },
        },
      },
    });

    // Delete all photos from cloudinary
    const imageRemovalPromises = vehicle?.images.map((image) => {
      return removeFilesFromAlbum([image.url]);
    });

    // Delete all modification files from cloudinary
    const fileRemovalPromises = vehicle?.modifications.flatMap(
      (modification) => {
        return modification.files.map((file) => {
          return removeFilesFromAlbum([file.url]);
        });
      }
    );

    // Wait for all removeFilesFromAlbum promises to resolve
    await Promise.all([
      ...(imageRemovalPromises || []),
      ...(fileRemovalPromises || []),
    ]);

    // Delete vehicle folder from cloudinary
    await removeVehicleFolder(vehicle?.id as string);

    const vehicleDb = await prismadb.vehicle.deleteMany({
      where: {
        id: params.vehicleId,
        userId,
      },
    });

    return NextResponse.json(vehicleDb);
  } catch (error) {
    console.log("VEHICLE_DELETE", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
