const jwt = require("jsonwebtoken");

exports.userAuth = (req, res, next) => {

 const authHeader = req.cookies['authtoken'];

 	console.log(authHeader);

 if(!authHeader){
    console.log("Empty Token");

    return res.redirect("/login");
 };

 let authSplit = authHeader.split(' ');

 const [authType, authToken] = [
 	authSplit[0],
 	authSplit[1]
 ]


 if(authType !== 'Bearer') return res.status(401).send("Invalid Token").end();

 try{
 	const verifyToken = jwt.verify(authToken, "rahasia");
 	req.user = verifyToken
 	next();

 } catch{

 	res.status(401).end();

 }

}

exports.isLogin = (req, res, next) => {
    const token = req.cookies['authtoken'];

    if(token) return res.redirect("/dashboard");

    next();
}


