const express=require("express")
const router=express.Router()
const Reservationcontrollers=require("../Controllers/ReservationControllers")
const { validate } = require("../Models/UserModels")
router.post("/ajouter/:id",validatelogin,Reservationcontrollers.addReservation)
router.put("/update/:id",validatelogin,Reservationcontrollers.updateReservation)
router.delete("/delete/:id",validatelogin,Reservationcontrollers.deleteReservation)
router.put("/annulerreservation/:id",validatelogin,isAdmin,Reservationcontrollers.annullerreservation)
router.get("/getallreservation/",validatelogin,Reservationcontrollers.getAllresrrvationarchiver)
router.get("/getonereservation/:id",validatelogin,Reservationcontrollers.getReservation)
router.get("/getreservationbyuser/:id",validatelogin,Reservationcontrollers.getreservatyByuser)




module.exports=router