import { Sequelize } from "sequelize"
import db from "../config/Database.js"

const { DataTypes } = Sequelize

const Artikel = db.define('tbl_artikel', {
    id_users: {
        type: DataTypes.STRING,
    },
    judul: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
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

export default Artikel;

(async() => {
    await db.sync()
})