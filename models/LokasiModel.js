import { Sequelize } from "sequelize"
import db from "../config/Database.js"

const { DataTypes } = Sequelize

const Lokasi = db.define('tbl_lokasi', {
    id_users: {
        type: DataTypes.INTEGER,
    },
    nama_tempat: {
        type: DataTypes.STRING,
    },
    tempat: {
        type: DataTypes.STRING,
    },
    image: {
        type: DataTypes.TEXT,
    },
    url: {
        type: DataTypes.STRING,
    },
    tanggal_dan_waktu_buka: {
        type: DataTypes.DATE,
    },
    waktu_buka: {
        type: DataTypes.TIME,
    },
    waktu_tutup: {
        type: DataTypes.TIME,
    },
}, {
    freezeTableName: true,
});

export default Lokasi;
(async() => {
    await db.sync()
})