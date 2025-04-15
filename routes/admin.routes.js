const { Router } = require("express")
const { adminModel, courseModel } = require("../db")
const { adminAuth } = require("../middlewares/admin.middleware")
const { JWT_ADMIN_SECRET } = require("../jwt.config")


const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod")

const adminRouter = Router()

adminRouter.post("/signup", async function (req, res) {

    const requireBody = z.object({
        email: z.string().min(11).max(50).email(),
        password: z.string().min(8).max(50),
        firstName: z.string().min(3).max(50),
        lastName: z.string().min(3).max(50),
    })

    const parsedDataWithSuccess = requireBody.safeParse(req.body)

    if (!parsedDataWithSuccess.success) {
        res.json({
            message: "Incorrect Format!",
            error: parsedDataWithSuccess.error
        })
        return
    }

    const email = req.body.email;
    const password = req.body.password;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    const hasedPassword = await bcrypt.hash(password, 10);

    await adminModel.create({
        email: email,
        password: hasedPassword,
        firstName: firstName,
        lastName: lastName,
    });

    res.json({
        message: "admin signup completed endpoint"
    })
})

adminRouter.post("/signin", async function (req, res) {
    const email = req.body.email;
    const password = req.body.password;

    const admin = await adminModel.findOne({
        email: email,
    });

    const passwordMatch = bcrypt.compare(password, admin.password);
    if (admin && passwordMatch) {
        const token = jwt.sign({
            id: admin._id.toString()
        }, JWT_ADMIN_SECRET);

        res.json({
            token,
            message: "admin signin completed endpoint"
        })
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
})

adminRouter.post("/course", adminAuth, async function (req, res) {
    const adminId = req.adminId

    const { title, description, price, imageUrl } = req.body

    const courseCreate = await courseModel.create({
        title, 
        description, 
        price, 
        imageUrl,
        creatorId: adminId
    })

    res.json({
        message: "admin add-course endpoint",
        courseId: courseCreate._id
    })
})

adminRouter.put("/course", adminAuth, async function (req, res) {
    const adminId = req.adminId

    const { title, description, imageUrl, price, courseId } = req.body

    const courseUpdate = await courseModel.updateOne({
        _id: courseId,
        creatorId: adminId
    }, {
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price
    })

    res.json({
        message: "admin update-course endpoint",
        courseId
    })
})

adminRouter.delete("/course", adminAuth, async function (req, res) {
    const adminId = req.adminId

    const { courseId } = req.body

    const deletedCourseId = courseId

    const courseUpdate = await courseModel.deleteOne({
        _id: courseId,
        creatorId: adminId
    })

    res.json({
        message: "admin delete-course endpoint",
        courseId
    })
})

adminRouter.get("/course", adminAuth, async function (req, res) {
    const adminId = req.adminId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message: "admin see-course endpoint",
        courses
    })
})

module.exports = {
    adminRouter: adminRouter
}