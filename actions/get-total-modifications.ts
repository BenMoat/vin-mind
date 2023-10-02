import prismadb from "@/lib/prismadb";

export const getTotalModifications = async (vehicleId: string) => {
  const result = await prismadb.modification.findMany({
    where: {
      vehicleId,
    },
  });

  const totalModificationsPrice = result.reduce((total, modification) => {
    const priceNumber = Number(modification.price);
    if (!isNaN(priceNumber)) {
      return total + priceNumber;
    }
    return total;
  }, 0);

  return totalModificationsPrice;
};
