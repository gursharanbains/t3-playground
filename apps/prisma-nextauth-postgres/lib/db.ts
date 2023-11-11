import { PrismaClient } from "@prisma/client";
import { currentUser } from "./extensions/currentUser";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(currentUser());
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
