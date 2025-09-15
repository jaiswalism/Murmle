import { Hono } from "hono"
import { logger } from "hono/logger";
import v1Router from "./routes/v1"
import client from "@repo/db"

const app = new Hono();

app.use('*', logger())
app.route("/api/v1", v1Router)


export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch
}