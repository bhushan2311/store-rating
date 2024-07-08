const Store = require("../model/Store");
const User = require("../model/User");

exports.getUsers = async (req, res) => {
    try {
        
      const users = await User.find({}).select('-password');
      const stores = await Store.find({}).select('-password');
      const data = [...users, ...stores];
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };