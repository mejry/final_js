const express=require("express")
const router=express.Router()
const SalleControllers=require("../Controllers/SalleControllers")
const { validatelogin, isAdmin } = require("../Midalwares/JwtValidate")

router.post("/ajouter",validatelogin,isAdmin,SalleControllers.AddSalle)
router.get("/get",validatelogin,SalleControllers.getSalle)
router.put("/modifier/:id",validatelogin,isAdmin,SalleControllers.updateSalle)
router.delete("/supprimer/:id",validatelogin,isAdmin,SalleControllers.deleteSalle)
router.get("/getid/:id",validatelogin,SalleControllers.getidSalle)


module.exports=router