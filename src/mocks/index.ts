import { networkHandlers } from "@/mocks/handlers/network";
import { monitoringHandlers } from "@/mocks/handlers/monitoring";
import { storageHandlers } from "@/mocks/handlers/storage";

export const handlers = [
  ...monitoringHandlers,
  ...networkHandlers,
  ...storageHandlers,
];
