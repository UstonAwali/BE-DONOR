import Pendonor from "../models/PendonorModel.js";
import Users from "../models/UserModel.js";

export const getPendonor = async(req, res) => {
    try {
        const response = await Pendonor.findAll()
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.status(401).json({
            msg: error.message
        })
    }
}

export const getPendonorById = async(req, res) => {
    try {
        const response = await Pendonor.findOne({
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

export const savePendonor = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(204);
        
        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        
        const userId = user[0].id;
        const goldarId = req.body.id_goldar;
        const namaUser = req.body.nama;
        const alamat = req.body.alamat;
        const kelurahan = req.body.kelurahan;
        const kecamatan = req.body.kecamatan;
        const jenkel = req.body.jenkel;
        const tempat_lahir = req.body.tempat_lahir;
        const tanggal_lahir = req.body.tanggal_lahir;
        const pekerjaan = req.body.pekerjaan;
        const nama_ibu_kandung = req.body.nama_ibu_kandung;
        const status_pernikahan = req.body.status_pernikahan;
        const reshus = req.body.reshus;
        const no_hp = req.body.no_hp;

        await Pendonor.create({
            id_users: userId,
            id_goldar: goldarId,
            nama: namaUser,
            alamat: alamat,
            kelurahan: kelurahan,
            kecamatan: kecamatan,
            jenkel: jenkel,
            tempat_lahir: tempat_lahir,
            tanggal_lahir: tanggal_lahir,
            pekerjaan: pekerjaan,
            nama_ibu_kandung: nama_ibu_kandung,
            status_pernikahan: status_pernikahan,
            reshus: reshus,
            no_hp: no_hp,
        });
        res.status(201).json({ msg: "Pendonor Berhasil Dibuat" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: `error ${error.message}` });
    }
};


export const updatePendonor = async(req, res) => {
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
        const pendonor = await Pendonor.findOne({
            where:{
                id: req.params.id
            }
        })
        if (!pendonor) {
            res.status(404).json({msg:"Data Tidak Ditemukan"})
        }
        

        const goldarId = req.body.id_goldar;
        const namaUser = req.body.nama;
        const alamat = req.body.alamat;
        const kelurahan = req.body.kelurahan;
        const kecamatan = req.body.kecamatan;
        const jenkel = req.body.jenkel;
        const tempat_lahir = req.body.tempat_lahir;
        const tanggal_lahir = req.body.tanggal_lahir;
        const pekerjaan = req.body.pekerjaan;
        const nama_ibu_kandung = req.body.nama_ibu_kandung;
        const status_pernikahan = req.body.status_pernikahan;
        const reshus = req.body.reshus;
        const no_hp = req.body.no_hp;
        try {
            await Pendonor.update({
                id_goldar: goldarId,
                nama: namaUser,
                alamat: alamat,
                kelurahan: kelurahan,
                kecamatan: kecamatan,
                jenkel: jenkel,
                tempat_lahir: tempat_lahir,
                tanggal_lahir: tanggal_lahir,
                pekerjaan: pekerjaan,
                nama_ibu_kandung: nama_ibu_kandung,
                status_pernikahan: status_pernikahan,
                reshus: reshus,
                no_hp: no_hp,
            }, {
                where: {
                    id: req.params.id
                }
            });
            res.status(201).json({ msg: "Pendonor Berhasil Diupdate" });
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

export const deletePendonor= async(req, res) => {
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
        const pendonor = await Pendonor.findOne({
            where:{
                id: req.params.id
            }
        })
        if (!pendonor) {
            res.status(404).json({msg:"Data Tidak Ditemukan"})
        }
        try {
            await Pendonor.destroy({
                where:{
                    id: req.params.id
                }
            })
            res.status(200).json({
                msg: "Pendonor Berhasil Dihapus"
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