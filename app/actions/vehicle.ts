import axios from "axios";
import prismadb from "@/lib/prismadb";

export const checkVehicleExists = async (vehicleName: string) => {
  try {
    const response = await axios.get(`/api/vehicles`, {
      params: { vehicleName: vehicleName },
    });
    return response.data.exists;
  } catch (error) {
    console.error(error);
    throw error;
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

export async function getVehicleBySlug(slug: string) {
  const vehicle = await prismadb.vehicle.findFirst({
    where: { slug },
  });

  if (!vehicle) {
    throw new Error(`Error loading page for "${slug}".`);
  }

  return vehicle;
}
