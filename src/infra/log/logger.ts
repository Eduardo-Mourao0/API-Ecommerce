import { prisma } from "../database/prisma/prisma-client";
import { v4 as uuidv4 } from 'uuid';

export class Logger{

    static async info(message: string, route?: string){
        await prisma.log.create({
            data:{
                id: uuidv4(),
                level: "INFO",
                message,
                route
            }
        });
    }

    static async warn(message: string) {
        await prisma.log.create({
            data: {
                id: uuidv4(),
                level: "WARN",
                message,
            }
        });
    }

    static async error(error: any, route?: string) {
        await prisma.log.create({
            data: {
                id: uuidv4(),
                level: "ERROR",
                message: error.message,
                stack: error.stack,
                route
            }
        });
    }
}