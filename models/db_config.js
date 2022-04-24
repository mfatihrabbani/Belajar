const mysql = require('mysql');
const bcrypt = require('bcrypt');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "dataUser"
});

db.connect((error) => {
	if (error) throw error;

	console.log("Database Connected");
})

// const getUserValidation = (email, password) => {

// 	const sql = `SELECT * FROM dataUser WHERE email = '${email}';`

//  db.query(sql, (error, result) => {
// 		if (error) throw error;

// 		const checkPassword = bcrypt.compare(password, result[0].password);

// 			if(!(email == result[0].email && checkPassword)){
// 				res.status(404).send("Login gagal");
// 			}else{
// 				res.send("Login sukses");
// 			}
		
// 	})
// }


const registerUSer = ([input]) => {
	const sql = `INSERT INTO dataUser (name, email, password, status) VALUES ('${input.name}', '${input.email}', '${input.password}', 'false')`;

		db.query(sql, (error) => {
			if (error) throw error;
			console.log("Registration sucess");
		})
}

module.exports = { registerUSer };