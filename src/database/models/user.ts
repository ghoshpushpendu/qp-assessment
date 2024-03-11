import { createPasswordHash } from '../../utils/helper';
import { sequelize } from '../index';
import { DataTypes } from 'sequelize';

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

User.sync().then(async () => {
    User.create({
        username: 'root',
        password: createPasswordHash('root'),
        email: 'admin@admin.com',
        role: 'admin'
    }).then(() => {
        console.log('User table created');
    }).catch((error) => {
        console.log('Error creating user table', error);
    });
});

export default User;