import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const LandingPage = db.define('tbl_landingpage', {
    id_users: {
        type: DataTypes.INTEGER,
    },
    judul: {
        type: DataTypes.STRING,
    },
    deskripsi: {
        type: DataTypes.TEXT,
    },
    video_url: {
        type: DataTypes.STRING,
    },
    thumbnail_url: {
        type: DataTypes.STRING,
    },
    dibuat_pada: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
}, {
    freezeTableName: true,
});

export default LandingPage;
(async() => {
    await db.sync()
})