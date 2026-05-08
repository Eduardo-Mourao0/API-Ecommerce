import { prisma } from "../database/prisma/prisma-client";
import { v4 as uuidv4 } from 'uuid';

export class Logger{

    static async info(message: string, route?: string){
        try {
            await prisma.log.create({
                data:{
                    id: uuidv4(),
                    level: "INFO",
                    message,
                    route
                }
            });
        } catch (error) {
            console.error('Falha ao registrar log:', error);
        }
    }

    static async warn(message: string) {
        try {
            await prisma.log.create({
                data: {
                    id: uuidv4(),
                    level: "WARN",
                    message,
                }
            });
        } catch (error) {
            console.error('Falha ao registrar log:', error);
        }
    }

    static async error(error: any, route?: string) {
        try {
            await prisma.log.create({
                data: {
                    id: uuidv4(),
                    level: "ERROR",
                    message: error.message,
                    stack: error.stack,
                    route
                }
            });
        } catch (logError) {
            console.error('Falha ao registrar log:', logError);
        }
    }
}
