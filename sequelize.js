const Sequelize= require('sequelize');

const sequelize= new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PSWD, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

sequelize.authenticate().then(()=> {
    console.log('Connected')
})
.catch(err => {
    console.error('Unable to connect to the database:', err)
})

module.exports= sequelize;