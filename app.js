const express = require("express");
const bcrypt = require("bcrypt");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
const jwt = require("jsonwebtoken");
const { userAuth, isLogin } = require("./middleware/auth.js");

const { registerUSer } = require("./models/db_config.js");
const app = express();

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "dataUser"
});

const users = [];

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());


app.get("/" , (req, res) => {
	res.send("Hello World");
})

app.get("/login", isLogin ,(req, res) => {
	res.render("login.ejs");
})

app.get("/dashboard", userAuth, (req, res) => {
	console.log(req.user)
	res.render("dasboard.ejs", {
		id: req.user.userId,
		name: req.user.name
	})
});

app.get('/logout', (req, res) => {

  res.clearCookie("authtoken");

  console.log("Log Out");

	res.redirect("/login");

 });

app.post("/dashboard", (req, res) => {

	if(req.body.confirm){
		const id = req.id;
	}

	console.log(id);

	try{
	 confirmAbsen(idUser.userId);	

	 res.status(200).send("Anda berhsil Login");
	} catch{
		res.status(404).send("Gagal Absen");
	}
	
})


app.get("/register", isLogin ,(req, res) => {
	res.render("register.ejs")
})

app.post("/register", async (req, res) => {
	try{

	const hashedPassword = await bcrypt.hash(req.body.password, 10);
	
		users.push({
			id: Date.now().toString(),
			name: req.body.nama,
			email: req.body.email,
			password: hashedPassword
		});
		res.redirect("/login");
	} catch{
		res.redirect("/register");
	}

	console.log(users);
	registerUSer(users);

});

app.post("/login" ,(req, res) => {

	const data = req.body;

	console.log(data.email);

	db.getConnection ( async (err, connection) => {

		if(err) throw err;

		const sql = `SELECT * FROM dataUser WHERE email = '${data.email}';`

	await connection.query(sql, async (error, result) => {

		connection.release();

		if (error) throw error;

			if(result.length == 0){
				res.status(404).send("Login gagal");
			}else{

				console.log(result[0].password)

				const hashedPasswordLogin = result[0].password;

				
				if(await bcrypt.compare(data.password, hashedPasswordLogin)){
					console.log("Login sukses");

					const token = jwt.sign({
						userId: result[0].id,
						name: result[0].name
					}, "rahasia",
					{
						expiresIn: '2h', 
					});

					 res.cookie('authtoken', "Bearer " + token, {
					 httpOnly: true,
					})

					console.log(token)

					res.redirect("/dashboard");
				}else{
					console.log("Login gagal")
					res.status(404).send("Anda gagal login")
				}

			}	
	})
})


	
})

app.listen(3000);