const Store = require("../model/Store");
const bcrypt = require("bcryptjs");

// -------------- Create a new store --------------------
//TODO: add role - store owner
exports.createStore = async (req, res) => {
  try {
    const { name, email, password, address } = req.body;

    // Check if the store already exists
    let store = await Store.findOne({ email });
    if (store) {
      return res.status(400).json({ message: "Store already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new store
    store = new Store({
      name,
      email,
      password: hashedPassword,
      address,
    });

    // TODO: token for create store

    await store.save();
    res.status(201).json({ message: "Store created successfully", store });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --------------- Get all stores --------------------
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.find({}).populate("ratings.user", "name");
    res.json(stores);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// --------------- Submit a rating ------------------
exports.submitRating = async (req, res) => {
  const { storeId } = req.params;
  const score= req.body.score;
  const userId = req.user._id;      // coming after token verified from protected middleware

  try {
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const existingRating = store.ratings.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingRating) {
      return res
        .status(400)
        .json({
          message:
            "You have already rated this store. Please modify your rating instead.",
        });
    }

    store.ratings.push({ user: userId, score });
    await store.save();

    res.json(store);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ------------ Modify a rating
exports.modifyRating = async (req, res) => {
  const { storeId } = req.params;
  const score  = req.body.score;
  const userId = req.user._id;

  try {
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const ratingIndex = store.ratings.findIndex(
      (r) => r.user.toString() === userId.toString()
    );

    if (ratingIndex === -1) {
      return res
        .status(400)
        .json({
          message:
            "You have not rated this store yet. Please submit a rating first.",
        });
    }

    store.ratings[ratingIndex] = { user: userId, score };
    await store.save();

    res.json(store);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
