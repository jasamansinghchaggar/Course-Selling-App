const express = require('express')
const mongoose = require("mongoose")
require('dotenv').config()
const app = express()
app.use(express.json());

const port = 3000

const { userRouter } = require("./routes/user.routes")
const { coursesRouter } = require("./routes/courses.routes")
const { adminRouter } = require("./routes/admin.routes")

app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/courses", coursesRouter)

async function main() {
    mongoose.connect(process.env.MONGO_URL)
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}
main()