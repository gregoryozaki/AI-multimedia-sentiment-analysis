import express from "express";

import { 
    renderTextForm, 
    registerTextEmotion 
} from "../controllers/emotionsController.js";

import { 
    renderImageForm, 
    registerImageEmotion 
} from "../controllers/emotionsImageController.js";

import { uploadImage } from "../config/uploadImage.js";

const router = express.Router();

/* -------------------------
   TELA PRINCIPAL DO TRACKER
-------------------------- */

router.get("/track", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("emotion-tracker");
});

/* -------------------------
   HISTÓRICO COMPLETO
-------------------------- */

router.get("/history", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("emotion-history");
});

/* -------------------------
   ESCOLHER TIPO DE REGISTRO
-------------------------- */

router.get("/select", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("select-type");
});

/* -------------------------
   REGISTRO POR TEXTO
-------------------------- */

router.get("/register/text", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    renderTextForm(req, res);
});

router.post("/register/text", registerTextEmotion);

/* -------------------------
   REGISTRO POR IMAGEM
-------------------------- */

router.get("/register/image", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    renderImageForm(req, res);
});

router.post(
    "/register/image",
    uploadImage.single("image"),
    registerImageEmotion
);

/* -------------------------
   REGISTRO POR ÁUDIO (PLACEHOLDER)
-------------------------- */

router.get("/register/audio", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("register-audio");
});

router.post("/register/audio", (req, res) => {
    console.log("Áudio recebido.");
    console.log(req.body.audioData);
    res.redirect("/dashboard");
});

/* -------------------------
   REGISTRO POR VÍDEO (PLACEHOLDER)
-------------------------- */

router.get("/register/video", (req, res) => {
    if (!req.session.user) return res.redirect("/login");
    res.render("register-video");
});

router.post("/register/video", (req, res) => {
    console.log("Vídeo recebido.");
    console.log(req.body.videoData);
    res.redirect("/dashboard");
});

export default router;
