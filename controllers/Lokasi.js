import Lokasi from "../models/LokasiModel.js";
import path from 'path'
import fs from "fs"
import Users from "../models/UserModel.js";

export const getLokasi = async(req, res) => {
    try {
        const response = await Lokasi.findAll()
        res.json(response)
    } catch (error) {
        console.log(error.message)
    }
}

export const getLokasiById = async(req, res) => {
    try {
        const response = await Lokasi.findOne({
            where:{
                id: req.params.id
            }
        })
        res.json(response)
    } catch (error) {
        console.log(error.message)
    }
}

export const saveLokasi = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(204);
        
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        

        if (req.files === null) return res.status(400).json({ msg: 'Tidak Ada File yang Diupload' });
        const name = req.body.nama_tempat;
        const file = req.files.file;
        const tempat = req.body.tempat;
        const waktudantanggal = req.body.tanggal_dan_waktu_buka;
        const waktubuka = req.body.waktu_buka;
        const waktututup = req.body.waktu_tutup;
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

                await Lokasi.create({
                    id_users: userId,
                    nama_tempat: name,
                    tempat: tempat,
                    image: fileName,
                    url: url,
                    tanggal_dan_waktu_buka: waktudantanggal,
                    waktu_buka: waktubuka,
                    waktu_tutup: waktututup,
                });
                res.status(201).json({ msg: "Lokasi Berhasil Dibuat" });
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


export const updateLokasi = async(req, res) => {
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
        
        const lokasi = await Lokasi.findOne({
            where:{
                id: req.params.id
            }
        })
        if (!lokasi) {
            res.status(404).json({msg:"Data Tidak Ditemukan"})
        }
        let fileName = ""
        
        if (req.files === null){
            fileName = lokasi.image
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

            const filePath = `./public/images/${lokasi.image}`
            fs.unlinkSync(filePath)

            file.mv(`./public/images/${fileName}`, (err) => {
                if (err) {
                    return res.status(500).json({ msg: err.message})
                }
            })
        }

        const name = req.body.nama_tempat;
        const tempat = req.body.tempat;
        const waktudantanggal = req.body.tanggal_dan_waktu_buka;
        const waktubuka = req.body.waktu_buka;
        const waktututup = req.body.waktu_tutup;
        const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

        try {
            await Lokasi.update({
                nama_tempat:name, 
                tempat: tempat, 
                image:fileName, 
                url:url, 
                tanggal_dan_waktu_buka: waktudantanggal,
                waktu_buka: waktubuka,
                waktu_tutup: waktututup,
            }, {
                where: {
                    id: req.params.id
                }
            })
            res.status(200).json({
                msg: "Lokasi Telah Diupdate"
            })
        } catch (error) {
            console.log(error.message)
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}

export const deleteLokasi = async(req, res) => {
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
        
        const lokasi = await Lokasi.findOne({
            where:{
                id: req.params.id
            }
        })
        if (!lokasi) {
            res.status(404).json({msg:"Data Tidak Ditemukan"})
        }
        try {
            const filePath = `./public/images/${lokasi.image}`
            fs.unlinkSync(filePath)
            await Lokasi.destroy({
                where:{
                    id: req.params.id
                }
            })
            res.status(200).json({
                msg: "Lokasi Berhasil Dihapus"
            })
        } catch (error) {
            console.log(error.message)
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
}