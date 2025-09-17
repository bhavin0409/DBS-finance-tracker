import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma"

export const checkUser= async () => {
    const User = await currentUser();

    if(!User) {
        return null;
    }

    try { 
        const loggedInUser = await db.user.findUnique({
            where: { clerkUserId: User.id },
        });
            

        if(!loggedInUser){
            return loggedInUser;
        }

        const name = `${User.firstName} ${User.lastName}`;

        const newUser= await db.user.create({
            data:{
                clerkUserId:User.id,
                name,
                imageUrl: User.imageUrl,
                email: User.emailAddresses[0].emailAddress,
            },
        });

        return newUser;
    } catch (error) {
        console.log(error.message);
    }
}