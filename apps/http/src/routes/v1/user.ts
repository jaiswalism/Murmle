import {Hono} from 'hono'

const userRouter = new Hono()

userRouter.get('metadata', async(c) => {
    
})

userRouter.get('metadata/bulk', async(c) => {

})

export default userRouter