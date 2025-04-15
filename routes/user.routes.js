const { Router } = require("express")
const { userModel, purchaseModel } = require("../db")
const { userAuth } = require("../middlewares/user.middleware")
const {JWT_USER_SECRET} = require("../jwt.config")

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod")

const userRouter = Router()

userRouter.post('/signup', async (req, res) => {

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

    await userModel.create({
        email: email,
        password: hasedPassword,
        firstName: firstName,
        lastName: lastName
    });

    res.json({
        message: "signup completed endpoint"
    })
})

userRouter.post('/signin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({
        email: email,
    });

    const passwordMatch = bcrypt.compare(password, user.password);
    if (user && passwordMatch) {
        const token = jwt.sign({
            id: user._id.toString()
        }, JWT_USER_SECRET);

        res.json({
            token,
            message: "signin completed endpoint"
        })
    } else {
        res.status(403).json({
            message: "Incorrect creds"
        })
    }
})

userRouter.get('/purchases', userAuth, async (req, res) => {
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })
    
    res.json({
        message: "purchases endpoint",
        purchases,
        coursesData
    })
})

module.exports = {
    userRouter: userRouter
}