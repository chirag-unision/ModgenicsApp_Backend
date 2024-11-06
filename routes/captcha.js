const express = require("express")
const router = express.Router()

const { getCaptcha, verifyCaptcha, updateScore, getScore } = require("../controllers/captchaController")

const { auth } = require("../middlewares/auth")

router.get("/getCaptcha", getCaptcha)
router.post("/verifyCaptcha", auth, verifyCaptcha)
router.post("/updateScore", auth, updateScore)
router.post("/getScore", auth, getScore)

module.exports = router