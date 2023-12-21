import Artikel from "../models/ArtikelModel.js";
import path from 'path'
import fs from "fs"
import Users from "../models/UserModel.js";

export const getArtikel = async(req, res) => {
    try {
        const response = await Artikel.findAll()
        res.json(response)
    } catch (error) {
        console.log(error.message)
    }
}

export const getArtikelById = async(req, res) => {
    try {
        const response = await Artikel.findOne({
            where:{
                id: req.params.id
            }
        })
        res.json(response)
    } catch (error) {
        console.log(error.message)
    }
}

export const saveArtikel = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(204).json({ msg: "Tidak Mempunyai Akses" });
        
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        
        if (!user) {
            return res.status(204).json({ msg: "User Tidak Ditemukan"})
        }

        
        if (req.files === null) return res.status(400).json({ msg: 'Tidak Ada File yang Diupload' });
        const name = req.body.judul;
        const file = req.files.file;
        const contentArtikel = req.body.content;
        const created_at = req.body.dibuat_pada;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        const fileName = file.md5 + ext;
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
        const allowedType = ['.png', '.jpg', '.jpeg'];

        if (!allowedType.includes(ext.toLowerCase())) {
            return res.status(422).json({ msg: "Gambar Invalid" });
        }

        if (fileSize > 8000000) {
            return res.status(422).json({ msg: "Max Image Sized 8MB" });
        }

        file.mv(`./public/images/${fileName}`, async (err) => {
            if (err) {
                return res.status(500).json({ msg: err.message });
            }
            try {
                const userId = user[0].id;

                await Artikel.create({
                    id_users: userId,
                    judul: name,
                    content: contentArtikel,
                    image: fileName,
                    url: url,
                    dibuat_pada: created_at
                });
                res.status(201).json({ msg: "Artikel Berhasil Dibuat" });
            } catch (error) {
                console.log(error.message);
                res.status(500).json({ msg: 'Internal Server Error' });
            }
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};


export const updateArtikel = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(204).json({ msg: "Tidak Mempunyai Akses" });
        
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user) {
            return res.status(204).json({ msg: "User Tidak Ditemukan"})
        }

        const artikel = await Artikel.findOne({
            where:{
                id: req.params.id
            }
        })
        if (!artikel) {
            res.status(404).json({msg:"Data Tidak Ditemukan"})
        }
        let fileName = ""

        if (req.files === null){
            fileName = artikel.image
        } else {
            const file = req.files.file
            const fileSize = file.data.length
            const ext = path.extname(file.name)
            fileName = file.md5 + ext
            const allowedType = ['.png','.jpg','.jpeg']

            if (!allowedType.includes(ext.toLowerCase())) {
                return res.status(422).json({msg:"Gambar Invalid"})
            }
            if (fileSize > 8000000) {
                return res.status(422).json({ msg: "Max Image Sized 8MB"})
            }

            const filePath = `./public/images/${artikel.image}`
            fs.unlinkSync(filePath)

            file.mv(`./public/images/${fileName}`, (err) => {
                if (err) {
                    return res.status(500).json({ msg: err.message})
                }
            })
        }

        const name = req.body.judul
        const contentArtikel = req.body.content
        const update_at = req.body.dibuat_pada;
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

        try {
            await Artikel.update({judul:name, content: contentArtikel, image:fileName, url:url, dibuat_pada: update_at}, {
                where: {
                    id: req.params.id
                }
            })
            res.status(200).json({
                msg: "Artikel Telah Diupdate"
            })
        } catch (error) {
            console.log(error.message)
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}

export const deleteArtikel = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(204).json({ msg: "Tidak Mempunyai Akses" });
        
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });

        if (!user) {
            return res.status(204).json({ msg: "User Tidak Ditemukan"})
        }
        const artikel = await Artikel.findOne({
            where:{
                id: req.params.id
            }
        })
        if (!artikel) {
            res.status(404).json({msg:"Data Tidak Ditemukan"})
        }
        try {
            const filePath = `./public/images/${artikel.image}`
            fs.unlinkSync(filePath)
            await Artikel.destroy({
                where:{
                    id: req.params.id
                }
            })
            res.status(200).json({
                msg: "Artikel Berhasil Dihapus"
            })
        } catch (error) {
            console.log(error.message)
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}