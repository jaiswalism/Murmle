import { createMiddleware } from "hono/factory";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

export const userMiddleware = createMiddleware(async (c, next) => {
    const header = c.req.header('authorization')
    const token = header?.split(" ")[1]
    
    if(!token){
        return c.json({message: "Unauthorized"}, 403)
    }

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as { role: String, userId: String }
        c.set("userId", decoded.userId)
        await next()
    }catch(e){
        return c.json({message: "Unauthorized"}, 401)
    }
})