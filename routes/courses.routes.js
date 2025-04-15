const { Router } = require("express")
const { userAuth } = require("../middlewares/user.middleware");
const { purchaseModel, courseModel } = require("../db")

const coursesRouter = Router()

coursesRouter.get('/', async (req, res) => {

    const courses = await courseModel.find({});

    res.json({
        message: "courses endpoint",
        courses
    })
})

coursesRouter.post('/purchase',userAuth, async (req, res) => {

    const userId = req.userId;
    const courseId = req.body.courseId;

    // Check if the user has already purchased this course
    const existingPurchase = await purchaseModel.findOne({ userId, courseId });
    if (existingPurchase) {
        return res.status(400).json({
            message: "You have already purchased this course."
        });
    }

    // should check that the user has actually paid the price
    await purchaseModel.create({
        userId,
        courseId
    });

    res.json({
        message: "courses purchase endpoint"
    })
})


module.exports = {
    coursesRouter: coursesRouter
}