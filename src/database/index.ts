import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import User from './models/user';

dotenv.config();
const env: any = process.env; 

export const sequelize = new Sequelize(env.DB_SCHEMA, env.DB_USER, env.DB_PASSWORD, {
    dialect: 'postgres',
    host: env.DB_HOST,
    logging: false
});

export const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};