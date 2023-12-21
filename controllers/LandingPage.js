import LandingPage from "../models/LandingPageModel.js";
import Users from "../models/UserModel.js";

export const getLandingPage = async(req, res) => {
    try {
        const response = await LandingPage.findAll()
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.status(401).json({
            msg: error.message
        })
    }
}

export const getLandingPageById = async(req, res) => {
    try {
        const response = await LandingPage.findOne({
            where:{
                id: req.params.id
            }
        })
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.status(401).json({
            msg: error.message
        })
    }
}

export const saveLandingPage = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(204);
        
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        
        const judul = req.body.judul;
        const deskripsi = req.body.deskripsi;
        const video_url = req.body.video_url;
        const thumbnail_url = req.body.thumbnail_url;
        const userId = user[0].id;

        await LandingPage.create({
            id_users: userId,
            judul: judul,
            deskripsi: deskripsi,
            video_url: video_url,
            thumbnail_url: thumbnail_url,
        });
        res.status(201).json({ msg: "LandingPage Berhasil Dibuat" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};


export const updateLandingPage = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(204);
        
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user) {
            return res.status(204).json({
                msg: "User Tidak Ditemukan"
            })
        }

        const landing = await LandingPage.findOne({
            where:{
                id: req.params.id
            }
        })
        if (!landing) {
            res.status(404).json({msg:"Data Tidak Ditemukan"})
        }
        

        const judul = req.body.judul;
        const deskripsi = req.body.deskripsi;
        const video_url = req.body.video_url;
        const thumbnail_url = req.body.thumbnail_url;

        try {
            await LandingPage.update({
                judul: judul,
                deskripsi: deskripsi,
                video_url: video_url,
                thumbnail_url: thumbnail_url,
            }, {
                where: {
                    id: req.params.id
                }
            });
            res.status(201).json({ msg: "LandingPage Berhasil Diupdate" });
        } catch (error) {
            res.status(401).json({
                msg: error.message
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}

export const deleteLandingPage = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(204);
        
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user) {
            return res.status(204).json({
                msg: "User Tidak Ditemukan"
            })
        }
        
        const landing = await LandingPage.findOne({
            where:{
                id: req.params.id
            }
        })
        if (!landing) {
            res.status(404).json({msg:"Data Tidak Ditemukan"})
        }
        try {
            await LandingPage.destroy({
                where:{
                    id: req.params.id
                }
            })
            res.status(200).json({
                msg: "LandingPage Berhasil Dihapus"
            })
        } catch (error) {
            console.log(error.message)
            res.status(401).json({
                msg: error.message
            })
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}