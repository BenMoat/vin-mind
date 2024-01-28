import axios from "axios";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

export const checkVehicleExists = async (vehicleName: string) => {
  try {
    const response = await axios.get(`/api/vehicles`, {
      params: { vehicleName: vehicleName },
    });
    return response.data.exists;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const checkModTypeExists = async (
  modificationType: string,
  vehicleId: string
) => {
  try {
    const response = await axios.get(`/api/${vehicleId}/modification-types`, {
      params: { modificationType: modificationType },
    });
    return response.data.exists;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const vehicleEnquiry = async (
  vehicleId: string | string[],
  registrationNumber: string
) => {
  try {
    const response = await axios.post(`/api/${vehicleId}/vehicle-enquiry`, {
      registrationNumber,
    });
    response.data.registrationNumber = registrationNumber;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message);
    }
  }
};

export const getVehicleBySlug = async (slug: string) => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const vehicle = await prismadb.vehicle.findFirst({
    where: { slug, userId },
  });

  if (!vehicle) {
    throw new Error(`Error loading page for vehicle, "${slug}".`);
  }

  return vehicle;
};
