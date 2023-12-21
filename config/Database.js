import { Sequelize } from "sequelize"
const db = new Sequelize('donors', 'root',  '', {
    host: 'localhost',
    dialect: "mysql"
})

export default db
