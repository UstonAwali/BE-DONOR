import Goldar from "../models/Goldar.js";
import Users from "../models/UserModel.js";

export const getGoldar = async(req, res) => {
    try {
        const response = await Goldar.findAll()
        res.json(response)
    } catch (error) {
        console.log(error.message)
        res.status(401).json({
            msg: error.message
        })
    }
}

export const getGoldarById = async(req, res) => {
    try {
        const response = await Goldar.findOne({
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

export const saveGoldar = async (req, res) => {
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
        
        const type = req.body.type_goldar;
        const jumlah = req.body.jumlah_goldar;
        const userId = user[0].id;

        await Goldar.create({
            id_users: userId,
            type_goldar: type,
            jumlah_goldar: jumlah,
        });
        res.status(201).json({ msg: "Goldar Berhasil Dibuat" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: 'Internal Server Error' });
    }
};


export const updateGoldar = async(req, res) => {
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
        const goldar = await Goldar.findOne({
            where:{
                id: req.params.id
            }
        })
        if (!goldar) {
            res.status(404).json({msg:"Data Tidak Ditemukan"})
        }
        

        const type = req.body.type_goldar;
        const jumlah = req.body.jumlah_goldar;

        try {
            await Goldar.update({
                type_goldar: type,
                jumlah_goldar: jumlah,
            }, {
                where: {
                    id: req.params.id
                }
            });
            res.status(201).json({ msg: "Goldar Berhasil Diupdate" });
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

export const deleteGoldar = async(req, res) => {
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
        const goldar = await Goldar.findOne({
            where:{
                id: req.params.id
            }
        })
        if (!goldar) {
            res.status(404).json({msg:"Data Tidak Ditemukan"})
        }
        try {
            await Goldar.destroy({
                where:{
                    id: req.params.id
                }
            })
            res.status(200).json({
                msg: "Goldar Berhasil Dihapus"
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