import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.get("/", (req, res) => res.render("index"));

router.get("/login", (req, res) => res.render("login", { error: null }));
router.post("/login", authController.loginUser);

router.get("/signup", (req, res) => res.render("signup", { error: null }));
router.post("/signup", authController.registerUser);

router.get("/forgot-password", (req, res) => res.render("forgot-password", { error: null }));
router.post("/forgot-password", authController.forgotPassword);

router.get("/reset-password/:token", authController.renderResetPassword);
router.post("/reset-password/:token", authController.resetPassword);

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

export default router;
