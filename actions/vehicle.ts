import axios from "axios";

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
