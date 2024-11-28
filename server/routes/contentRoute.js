const express = require("express");
const {
  createContent,
  getAllContent,
  flagContent,
} = require("../controller/content_controller.js");
const { isLogIn, auth } = require("../middleware/role_auth_middleware.js");
const router = express.Router();

// Corrected route where auth middleware is used with roles passed correctly
router.post(
  "/",
  isLogIn,
  
  auth("Admin", "Moderator"), // Ensure roles are passed correctly
  createContent
);

router.get("/", isLogIn, getAllContent);

router.put("/flag/:id", isLogIn, auth("Moderator"), flagContent);

module.exports = router;
