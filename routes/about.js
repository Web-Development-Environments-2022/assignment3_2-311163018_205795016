var express = require("express");
var router = express.Router();


router.get("/", (req, res) => res.send("The legandery team of two notorius Full - Stack developers A.K.A Daniel 'the code chewer' Hodisan and Omri 'the debugger' Man."));


module.exports = router;