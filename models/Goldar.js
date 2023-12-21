import { Sequelize } from "sequelize"
import db from "../config/Database.js"

const { DataTypes } = Sequelize

const Goldar = db.define('tbl_goldar', {
    id_users: {
        type: DataTypes.INTEGER,
    },
    type_goldar: {
        type: DataTypes.STRING,
    },
    jumlah_goldar: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    diperbarui_pada: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    freezeTableName: true,
});

export default Goldar;

(async() => {
    await db.sync()
})