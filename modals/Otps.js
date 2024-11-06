module.exports= (sequelize, DataTypes)=> {
    const Otps= sequelize.define('otps', {
        pid: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        uid: DataTypes.STRING,
        otp: DataTypes.STRING,
    });
    return Otps;
}