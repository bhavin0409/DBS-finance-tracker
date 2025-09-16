import { PrismaClient } from '@prisma/client';
export const db =globleThis.prisma|| new PrismaClient();

if (process.env.NODE_ENV !== 'production') 
    {globleThis.prisma = db;}

//globleThis.prisma: the globle variable ensure that the prisma client instance is resused across hot reloads during development.without this ,each time of your application reloads,new instance of prisma client will be created ,potentially leading to connection issues 
//process.env.NODE_ENV:check if the application is running in production mode.if not in production mode,it assigns the prisma client instance to globleThis.prisma
//this approach helps to maintain a single instance of the prisma client during development,improving performance and avoiding connection problems.

