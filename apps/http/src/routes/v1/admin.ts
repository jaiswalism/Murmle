import {Hono} from 'hono'
import { AddElementSchema, CreateAvatarSchema, CreateElementSchema, CreateMapSchema, UpdateElementSchema } from '../types'
import client from "@repo/db/client"

const adminRouter = new Hono()

adminRouter.post("/element", async(c) => {
    const data = await c.req.json()
    const parsedData = CreateElementSchema.safeParse(data)

    if (!parsedData.success){
        return c.json({
            message: "Validation Failed!"
        }, 400)
    }

    try{
        const element = await client.element.create({
            data: {
                width: parsedData.data.width,
                height: parsedData.data.height,
                imageUrl: parsedData.data.imageUrl,
                static: parsedData.data.static
            }
        })

        return c.json({
            id: element.id
        }, 200)
    }catch(e){
        return c.json({message: "Internal Server Error"}, 400)
    }
})

adminRouter.put("/element/:elementId", async(c) => {
    const data = await c.req.json()
    const parsedData = UpdateElementSchema.safeParse(data)

    if(!parsedData.success){
        return c.json({
            message: "Validation Failed"
        }, 400)
    }

    const elementId = c.req.param('elementId')

    try{
        await client.element.update({
            where: {
                id: elementId
            },
            data: {
                imageUrl: parsedData.data.imageUrl
            }
        })

        return c.json({
            message: "Element image updated"
        }, 200)
    }catch(e){
        return c.json({message: "Internal Server Error"}, 400)
    }
})

adminRouter.post("/avatar", async(c) => {
    const data = await c.req.json()
    const parsedData = CreateAvatarSchema.safeParse(data)

    if(!parsedData.success){
        return c.json({
            message: "Validation Failed"
        }, 400)
    }

    try{
        const avatar = await client.avatar.create({
            data: {
                name: parsedData.data.name,
                imageUrl: parsedData.data.imageUrl
            }
        })

        return c.json({
            avatarId: avatar.id
        }, 200)
    }catch(e){
        return c.json({message: "Internal Server Error"}, 400)
    }
})

adminRouter.post("/map", async(c) => {
    const data = await c.req.json()
    const parsedData = CreateMapSchema.safeParse(data)

    if(!parsedData.success){
        return c.json({
            message: "Validation Failed"
        }, 400)
    }

    try {
        
    } catch (e) {
        
    }
})

export default adminRouter