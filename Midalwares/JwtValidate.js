const jwt = require('jsonwebtoken');
const TOKEN_SECRET = 'sqldklfqlqs545';

const validatelogin = function (req,res,next){
  console.log(req);
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(401).send('Access Denied');
    try {
    jwt.verify(authHeader, process.env.scretorkey,(err,user)=>{
if(err) return res.sendStatus(403)
req.user = user;
        next();
        });
        
    } catch (error) {
      console.log(error);
      return res.status(401).send('Invalid Token') ;
    }
}
const isAdmin=async(req,res,next)=>{
    try {
        const User=req.user
        if(User.role=="admin"){
            next()
        }else{
            res.status(501).json("vous n'ete pas authorize to acceder a cete function" )
        }
    } catch (error) {
        console.log(error);
        res.status(401).json(error)
    }
}

module.exports={
    isAdmin:isAdmin,
    validatelogin:validatelogin
}