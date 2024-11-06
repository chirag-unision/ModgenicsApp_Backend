const express = require("express")
const router = express.Router()

const {
  login,
  signup,
  verifyOtp,
  sendOtp,
  resetPassword,
  validateToken,
} = require("../controllers/authController")

// const { auth } = require("../middleware/auth")

router.post("/login", login)  
router.post("/signup", signup)  
router.post("/sendOtp", sendOtp)  
router.post("/verifyOtp", verifyOtp)  
router.post("/resetPassword", resetPassword)  
router.post("/validateToken", validateToken)  

module.exports = router