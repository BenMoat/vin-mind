export const sectionRoutes = [
  {
    href: "#overview",
    label: "Overview",
  },
  {
    href: "#modifications",
    label: "Modifications",
  },
  {
    href: "#servicing",
    label: "Servicing",
  },
  {
    href: "#settings",
    label: "Settings",
  },
];

export type MockVehicle = {
  id?: string;
  name?: string;
  userId?: string;
  totalModifications?: number;
  totalPrice?: number;
  updatedAt?: Date;
  taxStatus?: string;
  taxDueDate?: Date;
};

export const mockData = [
  {
    id: "1",
    name: "A90 Toyota Supra",
    userId: "Benjie",
    totalModifications: 12,
    totalPrice: 1360.69,
    updatedAt: new Date("2024-01-13T09:47:25"),
    taxStatus: "Taxed",
    taxDueDate: new Date("2024-04-20"),
  },
  {
    id: "2",
    name: "McLaren F1",
    userId: "Future Benjie",
    totalModifications: 2,
    totalPrice: 123.92,
    updatedAt: new Date("2024-01-13T13:15:30"),
    taxStatus: "SORN",
    taxDueDate: new Date("2021-09-27"),
  },
  {
    id: "3",
    name: "Mercedes AMG GT Black Series",
    userId: "Slightly more realistic Future Benjie",
    totalModifications: 13,
    totalPrice: 19286.78,
    updatedAt: new Date("2023-10-04T11:18:22"),
    taxStatus: "Taxed",
    taxDueDate: new Date("2024-09-01"),
  },
];
