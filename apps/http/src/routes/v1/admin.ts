import {Hono} from 'hono'

const adminRouter = new Hono()

adminRouter.post("/element", async(c) => {
    
})

adminRouter.put("/element/:elementId", async(c) => {

})

adminRouter.post("/avatar", async(c) => {

})

adminRouter.post("/map", async(c) => {

})

export default adminRouter