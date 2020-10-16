module.exports = function(sequelize, DataTypes) {
  var Favorite = sequelize.define("Favorite", {
    name:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rating:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description:  {
      type: DataTypes.STRING,
      allowNull: false,
    },
    menuLink:    {
      type: DataTypes.STRING,
      allowNull: false,
    },  
  });

  Favorite.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Favorite.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Favorite;
};