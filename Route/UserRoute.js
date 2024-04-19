const express=require("express")
const router=express.Router()
const UserControllers=require("../Controllers/UserControllers")


router.post("/singup",UserControllers.signup)
router.post("/login",UserControllers.login)
router.post("/confirmedcompte/:code",UserControllers.confirmedmail)
router.post("/forgotpassword",UserControllers.forgotpassword)
router.post("/resetpassword",UserControllers.passwordReset)
module.exports=router