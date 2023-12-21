import { Sequelize } from "sequelize"
import db from "../config/Database.js"

const { DataTypes } = Sequelize

const Users = db.define('tbl_users', {
    name: {
        type: DataTypes.STRING
    },
    username: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    no_telp: {
        type: DataTypes.STRING
    },
    alamat: {
        type: DataTypes.TEXT
    },
    tanggal_lahir: {
        type: DataTypes.DATE
    },
    jk: {
        type: DataTypes.STRING
    },
    nik: {
        type: DataTypes.STRING
    },
    image: {
        type: DataTypes.TEXT
    },
    url: {
        type: DataTypes.STRING
    },
    role: {
        type: DataTypes.STRING
    },
    refresh_token : {
        type: DataTypes.TEXT
    }
},{
    freezeTableName:true
})

export default Users


