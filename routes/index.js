import express from "express"
import { refreshToken } from "../controllers/RefreshToken.js"
import { getUsers, Login, Logout, Me, nePassword, Register, resetPassword, updateUsers } from "../controllers/Users.js"
import { verifyToken } from "../middleware/VerifyToken.js"
import { getArtikel, getArtikelById, saveArtikel, updateArtikel, deleteArtikel } from "../controllers/Artikel.js"
import { deleteLokasi, getLokasi, getLokasiById, saveLokasi, updateLokasi } from "../controllers/Lokasi.js"
import { deleteStories, getStories, getStoriesById, saveStories, updateStories } from "../controllers/Stories.js"
import { deleteGoldar, getGoldar, getGoldarById, saveGoldar, updateGoldar } from "../controllers/Goldar.js"
import { deletePendonor, getPendonor, getPendonorById, savePendonor, updatePendonor } from "../controllers/Pendonor.js"
import { deleteLandingPage, getLandingPage, getLandingPageById, saveLandingPage, updateLandingPage } from "../controllers/LandingPage.js"
const router = express.Router()

router.get('/users', getUsers)
router.get('/me/:id', Me)
router.post('/users', Register)
router.post('/login', Login)
router.patch('/editUsers/:id',verifyToken, updateUsers)
router.get('/token', refreshToken)
router.delete('/logout', Logout)

router.post('/reset-password', resetPassword)
router.patch('/newpassword', nePassword)

router.get('/artikel', getArtikel)
router.get('/artikel/:id', getArtikelById)
router.post('/addartikel', verifyToken, saveArtikel)
router.patch('/editartikel/:id',verifyToken, updateArtikel)
router.delete('/deleteartikel/:id',verifyToken, deleteArtikel)

router.get('/lokasi', getLokasi)
router.get('/lokasi/:id', getLokasiById)
router.post('/addlokasi', verifyToken, saveLokasi)
router.patch('/editlokasi/:id',verifyToken, updateLokasi)
router.delete('/deletelokasi/:id',verifyToken, deleteLokasi)

router.get('/stories', getStories)
router.get('/stories/:id', getStoriesById)
router.post('/addstories', verifyToken, saveStories)
router.patch('/editstories/:id',verifyToken, updateStories)
router.delete('/deletestories/:id',verifyToken, deleteStories)

router.get('/goldar', getGoldar)
router.get('/goldar/:id', getGoldarById)
router.post('/addgoldar', verifyToken, saveGoldar)
router.patch('/editgoldar/:id',verifyToken, updateGoldar)
router.delete('/deletegoldar/:id',verifyToken, deleteGoldar)

router.get('/pendonor', getPendonor)
router.get('/pendonor/:id', getPendonorById)
router.post('/addpendonor', verifyToken, savePendonor)
router.patch('/editpendonor/:id',verifyToken, updatePendonor)
router.delete('/deletependonor/:id',verifyToken, deletePendonor)

router.get('/landing', getLandingPage)
router.get('/landing/:id', getLandingPageById)
router.post('/addlanding', verifyToken, saveLandingPage)
router.patch('/editlanding/:id',verifyToken, updateLandingPage)
router.delete('/deletelanding/:id',verifyToken, deleteLandingPage)

export default router