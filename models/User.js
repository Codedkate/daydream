import bcrypt from 'bcrypt';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      username: {
        type: DataTypes.STRING,
        unique: true
      },
      password: {
        type: DataTypes.STRING
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
    }, {
      hooks: {
        beforeCreate: user => user.password && user.hashPassword(),
        beforeUpdate: user => user.password && user.hashPassword()
      }
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Note, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
  };

  User.prototype.hashPassword = async function hashPassword() {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    return this.password;
  };

  User.prototype.validPassword = function validPassword(password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
