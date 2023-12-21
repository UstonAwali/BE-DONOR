import { Sequelize } from "sequelize"
import db from "../config/Database.js"

const { DataTypes } = Sequelize

const Stories = db.define('tbl_stories', {
    id_users: {
        type: DataTypes.INTEGER,
    },
    judul: {
        type: DataTypes.STRING,
    },
    content: {
        type: DataTypes.TEXT,
    },
    image: {
        type: DataTypes.TEXT,
    },
    url: {
        type: DataTypes.STRING,
    },
    dibuat_pada: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    freezeTableName: true,
});

export default Stories;
(async() => {
    await db.sync()
})