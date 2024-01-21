import axios, { AxiosError } from "axios";

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
    throw error;
  }
};
