const express = require("express");
const {register,login,logout,getUser,oneUser}=require("../controller/user_controller.js");
const { isLogIn, auth } = require("../middleware/role_auth_middleware.js");
const router = express.Router();



// managing session and user authentication
router.get("/",isLogIn,oneUser)
router.post("/register",register);

router.post("/login",login );
router.post("/logout",logout)
router.get("/all",isLogIn,auth("Admin"),getUser)



module.exports = router;
