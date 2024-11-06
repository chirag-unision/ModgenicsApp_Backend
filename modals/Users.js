module.exports= (sequelize, DataTypes)=> {
    const Users= sequelize.define('users', {
        uid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        username: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: DataTypes.STRING,
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
    });
    return Users;
}