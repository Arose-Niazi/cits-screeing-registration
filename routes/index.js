const mysql = require('mysql2/promise');
var express = require("express");
var router = express.Router();
var QRCode = require('qr-image');

const connectionObject = {
  host: "51.210.180.137",
  user: "cits",
  password: "PLUY0P3Du0bNz2iN",
  database: "cits",
};

router.get("/users", async function (req, res, next) {
  const connection = await mysql.createConnection(connectionObject);
  const [rows, fields] = await connection.query('SELECT * FROM semi');
  const visited = rows.filter((value) => value.Arrived == 1);

  res.render("users", { users: rows, visited });
});

/* GET home page. */
router.get("/", async function (req, res, next) {
  var ID = req.query.ID ? req.query.ID : null;
  var fName = req.query.fName ? req.query.fName : '';
  var lName = req.query.lName ? req.query.lName : '';
  if (ID) {
    const connection = await mysql.createConnection(connectionObject);
    if (fName.length > 1) {

      connection.query('INSERT IGNORE INTO semi VALUES (?,?,?,0);', [ID, fName, lName]);
      let qr_png = QRCode.image(ID, { type: 'png', parse_url: true, ec_level: 'H', size: 10 });
      await qr_png.pipe(require('fs').createWriteStream('public/Images/QR/' + req.query.ID + '.png'));
      res.render("index", { ID, fName });
    }
    else {
      if (req.query.token == '123') {
        const [rows, fields] = await connection.query('SELECT * FROM semi WHERE ID=? LIMIT 1', [ID]);
        console.log(rows);
        res.render("view", rows[0]);
        connection.query('UPDATE semi SET Arrived=1 WHERE ID=? LIMIT 1', [ID]);
      }
      else
        res.render('poster');
    }

  }
  else
    res.render('poster');
});




module.exports = router;
