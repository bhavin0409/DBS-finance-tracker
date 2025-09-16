import { PrismaClient } from '@prisma/client';
export const db = globalThis.prisma|| new PrismaClient();

if (process.env.NODE_ENV !== 'production') 
    {globalThis.prisma = db;}

//globalThis.prisma: the global variable ensures that the prisma client instance is reused across hot reloads during development. Without this, each time your application reloads, a new instance of prisma client will be created, potentially leading to connection issues.
//process.env.NODE_ENV: checks if the application is running in production mode. If not in production mode, it assigns the prisma client instance to globalThis.prisma
//this approach helps to maintain a single instance of the prisma client during development, improving performance and avoiding connection problems.