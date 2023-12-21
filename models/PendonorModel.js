import { Sequelize } from "sequelize"
import db from "../config/Database.js"

const { DataTypes } = Sequelize

const Pendonor = db.define('tbl_pendonor', {
    id_users: {
        type: DataTypes.INTEGER,
    },
    id_goldar: {
        type: DataTypes.INTEGER,
    },
    nama: {
        type: DataTypes.STRING,
    },
    alamat: {
        type: DataTypes.STRING,
    },
    kelurahan: {
        type: DataTypes.STRING,
    },
    kecamatan: {
        type: DataTypes.STRING,
    },
    jenkel: {
        type: DataTypes.STRING,
    },
    tempat_lahir: {
        type: DataTypes.STRING,
    },
    tanggal_lahir: {
        type: DataTypes.DATE,
    },
    pekerjaan: {
        type: DataTypes.STRING,
    },
    nama_ibu_kandung: {
        type: DataTypes.STRING,
    },
    status_pernikahan: {
        type: DataTypes.STRING,
    },
    reshus: {
        type: DataTypes.STRING,
    },
    no_hp: {
        type: DataTypes.STRING,
    },
}, {
    freezeTableName: true,
});

export default Pendonor;

(async() => {
    await db.sync()
})