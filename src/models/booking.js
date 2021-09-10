'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Booking.hasOne(models.User,{foreignKey:'id'}) //test thử

      Booking.belongsTo(models.Allcode, {foreignKey: 'timeType', targetKey:'keyMap', as:'timeTypeDataPatient'})

      Booking.belongsTo(models.User,{foreignKey:'patientId', as: 'patientData' })// chú ý

    }
  };
  Booking.init({
    // id : DataTypes.INTEGER,// thêm thử để test
    statusId: DataTypes.STRING,
    reason : DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    token: DataTypes.STRING,
    timeType: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};