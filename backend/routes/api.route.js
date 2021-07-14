const router = require("express").Router();

const checkAuthorization = require("../middlewares/checkAuthorization");
const userController = require("../controllers/user.controller");
const wordController = require("../controllers/word.controller");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/check-availability", userController.checkAvailability);
router.post("/confirm", userController.confirmEmail);
router.post("/reset", userController.requestPasswordReset);
router.post("/password", userController.resetPassword);

router.get("/public", wordController.getPublic);
router.get("/private", checkAuthorization, wordController.getPrivate);

module.exports = router;
