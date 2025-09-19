import {Hono} from 'hono'
import { UpdateMetaverseSchmea } from '../types'
import client from "@repo/db/client"
import { userMiddleware } from '../middlewares/user'

const userRouter = new Hono()

userRouter.post('metadata', userMiddleware,async(c) => {
    const data = await c.req.json()
    const parsedData = UpdateMetaverseSchmea.safeParse(data)

    if(!parsedData.success){
        return c.json({
            message: "Validation Failed"
        }, 400)
    }

    try{
        await client.user.update({
            where: {
                id: data.userId
            },
            data: {
                avatarId: parsedData.data.avatarId
            }
        })

        return c.json({message: "Metadata Updated"}, 200)
    }catch(e){
        return c.json({message: "Internal Server Error"}, 400)
    }
})

userRouter.get('metadata/bulk', async(c) => {

})

export default userRouter