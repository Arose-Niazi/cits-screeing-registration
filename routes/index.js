var express = require("express");
var router = express.Router();
var QRCode = require('qr-image');

/* GET home page. */
router.get("/", async function (req, res, next) {
  if (req.query.ID) {
    let qr_png = QRCode.image(JSON.stringify({ ID: req.query.ID, fName: req.query.fName, lName: req.query.lName }), { type: 'png' });
    await qr_png.pipe(require('fs').createWriteStream('public/Images/QR/' + req.query.ID + '.png'));
    res.render("index", { ID: req.query.ID });
  }
  else
    res.send("Nothing to see");
});
module.exports = router;
