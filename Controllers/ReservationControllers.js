const Reservation = require("../Models/ReservationModels")
const SalleModels=require("../Models/SalleModels")
const User=require("../Models/UserModels")
const moment =require("moment")


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'azzizzflash@gmail.com',
        pass: 'rnba lbty wsmd yvgl',
    },
    tls: {
        rejectUnauthorized: false
    },
});

exports.addReservation = async (req, res) => {
    try {
        const date_debut = moment(req.body.date_debut).format("YYYY-MM-DD");
        const date_fin = moment(req.body.date_fin).format("YYYY-MM-DD");
        const heureDebut = moment(req.body.heure_debut, "HH:mm");
        const heureFin = moment(req.body.heure_fin, "HH:mm");
        const today = moment().startOf('day'); 
        if (moment(date_debut).isBefore(today)) {
            return res.status(402).json("La date de début doit être après la date d'aujourd'hui");
        }
 
        if (heureDebut.isAfter(heureFin)) {
            return res.status(402).json("L'heure de fin doit être après l'heure de début");
        }
        const reservationExisteDebut = await Reservation.countDocuments({
           
            heure_debut: { 
                $gte: heureDebut,
                 $lte: heureFin 
                }
        }) > 0;

        const reservationExisteFin = await Reservation.countDocuments({
          
            heure_fin: {
                 $gte: heureDebut,
                  $lte: heureFin 
                        }
        }) > 0;

        if (reservationExisteDebut || reservationExisteFin) {
            return res.status(401).json("Une réservation existe déjà pour cette période");
        } else {
            const new_reservation=new Reservation(req.body)
           await new_reservation.save()
           await SalleModels.findByIdAndUpdate({_id:req.params.id},{$addToSet:{reservation:new_reservation._id}},{new:true}) 
            return res.status(200).json("Réservation ajoutée avec succès");
        }
    } catch (error) {
        console.error("Erreur lors de l'ajout de la réservation :", error);
        return res.status(400).json(error);
    }
}

  exports.getReservation = async (req, res) => {
    try {
      const reservation = await Reservation.findById(req.params.reservationId).populate("user");
  
      if (!reservation) {
        return res.status(404).json({ error: "Reservation not found" });
      }
  
      res.status(200).json(reservation);
    } catch (error) {
      console.error("Error getting reservation:", error);
      res.status(500).json({ error: "Failed to fetch reservation" });
    }
  }
  exports.deleteReservation = async (req, res) => {
    try {
        const reservationId=req.params.reservationId
          
await SalleModels.findByIdAndUpdate({_id:reservationId},{$pull:{reservation:reservationId}},{new:true})
      await Reservation.findByIdAndDelete(req.params.reservationId);
      res.status(204).json({ message: "Reservation deleted successfully" });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      res.status(404).json({ error: "Reservation not found" });
    }
  }
  exports.updateReservation = async (req, res) => {
    try {
        const { id } = req.params; 
        const { date_debut, date_fin, heure_debut, heure_fin } = req.body;

        const formattedDebut = moment(date_debut).format("YYYY-MM-DD");
        const formattedFin = moment(date_fin).format("YYYY-MM-DD");
        const formattedHeureDebut = moment(heure_debut, "HH:mm");
        const formattedHeureFin = moment(heure_fin, "HH:mm");

        const today = moment().startOf('day');

        if (moment(formattedDebut).isBefore(today)) {
            return res.status(402).json("La date de début doit être après la date d'aujourd'hui");
        }

        if (formattedHeureDebut.isAfter(formattedHeureFin)) {
            return res.status(402).json("L'heure de fin doit être après l'heure de début");
        }

        const reservationExisteDebut = await Reservation.countDocuments({
      
            heure_debut: { $gte: formattedHeureDebut, $lte: formattedHeureFin },
        }) > 0;
        const reservationExisteFin = await Reservation.countDocuments({
            date_fin: formattedFin,
            heure_fin: { $gte: formattedHeureDebut, $lte: formattedHeureFin },
        }) > 0;
        if (reservationExisteDebut || reservationExisteFin) {
            return res.status(401).json("Une réservation existe déjà pour ces heures.");
        } else {
          
            await Reservation.findByIdAndUpdate(id, {
                date_debut: formattedDebut,
                date_fin: formattedFin,
                heure_debut: formattedHeureDebut,
                heure_fin: formattedHeureFin
            });
            return res.status(200).json("Réservation mise à jour avec succès.");
        }
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la réservation :", error);
        return res.status(400).json(error);
    }
}
exports.annullerreservation=async(req,res)=>{
    try {

        const existeadmin = await User.findOne({role:"admin"})

      const existereservation= await Reservation.findByIdAndUpdate({_id:req.params.id},{
        archive:true
       },{new:true})
          const existesalle=await Salle.findOne({reservation:req.params.id})
       transporter.sendMail({
        from: 'from appreservation',
        to: existeadmin.email,
        subject: 'email pour une annulation de reservation',
        

        html: `<b>Bonjour  ${existeadmin.nom} ${existeadmin.prenom}! </b> <br>
 
nous vous informer que la reservation pour la salle <b>${existesalle.nom} </b>entre  la date <b>${existereservation.date_debut}   ${existereservation.heure_debut}</b> et la date<b> ${existereservation.date_fin}   ${existereservation.heure_fin}</b> a éte annuler par la user <br>
<b> Cordialement </b>
`,

    },

        async (err, succes) => {
            if (err) {
                console.log(err);
                return res.status(400).json(err)
            } 

        })

       res.status(200).json("reservation archiver avec suucs")
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}
exports.getreservatyByuser=async(req,res)=>{
    try {
        const iduser=req.params.id
          const ReservationUser=await Reservation.find({user:iduser}).populate("user")
          res.status(200).json(ReservationUser)
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}
exports.getAllresrrvationarchiver=async(req,res)=>{
    try {
        const allreservation=await Reservation.find({archive:true}).populate("user")
        res.status(200).json(allreservation)
    } catch (error) {
        console.log(error);
        res.status(400).json(error)
    }
}