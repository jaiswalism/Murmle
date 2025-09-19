import { Hono } from "hono"
import userRouter from "./user"
import adminRouter from "./admin"
import spaceRouter from "./space"
import { SigninSchema, SignupSchema } from "../types"
import client from "@repo/db/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../../config"

const router = new Hono()

router.get('/', (c) => c.text("You reached the route"))

router.post('/signup', async(c) => {
    const data = await c.req.json()
    const parsedData = SignupSchema.safeParse(data)

    if(!parsedData.success){
        return c.json({message: parsedData.error}, 400)
    }
    const hashedPassword = await bcrypt.hash(parsedData.data.password, 10)

    try{
        const user = await client.user.create({
            data: {
                username: parsedData.data.username,
                password: hashedPassword,
                role: parsedData.data.type === "admin" ? "Admin" : "User",
            }
        })
        return c.json({
            userId: user.id
        }, 201)
    }catch(e){
        return c.json({message: "Username already exists"}, 400)
    }
})

router.post('/signin', async(c) => {
    const data = await c.req.json()
    const parsedData = SigninSchema.safeParse(data)

    if(!parsedData.success){
        return c.json({message: "Validation Failed"}, 403)
    }

    try{
        const user = await client.user.findUnique({
            where: {
                username: parsedData.data.username
            }
        })

        if(!user){
            return c.json({
                message: "User not found"
            }, 403)
        }

        const isValid = await bcrypt.compare(parsedData.data.password, user.password)
        console.log(`${parsedData.data.password}`)
        console.log(`${user.password}`)
        if(!isValid){
            return c.json({
                message: "Invalid Password"
            }, 403)
        }

        const token = jwt.sign({
            userId: user.id,
            role: user.role
        }, JWT_SECRET)

        return c.json({
            token: token
        }, 200)
    }catch(e){
        return c.json({
            message: "Invalid username or password"
        }, 400)
    }
})

router.get('/elements', async(c) => {
    try {
        
    } catch (e) {
        
    }
})

router.get('/avatars', async(c) => {
    try {
        
    } catch (e) {
        
    }
})

router.route('/user', userRouter)
router.route('/admin', adminRouter)
router.route('/space', spaceRouter)

export default router