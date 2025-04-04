const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
const bycrypt = require("bcrypt");

const getAll = async (req, res) => {
    // #swagger.tags = ["Users"]
    try {
        const result = await mongodb.getDatabase().db().collection("users").find();
        const users = await result.toArray();

        res.setHeader("Content-type", "application/json");
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while fetching users", error: err });
    }
};


const getSingle = async (req, res) => {
    // #swagger.tags = ["Users"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json("You must have a valid id to find user");
        }

        const userId = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection("users").find({ _id: userId });
        const users = await result.toArray();

        res.setHeader("Content-type", "application/json");
        res.status(200).json(users[0]);
    } catch (err) {
        res.status(500).json({ message: "An error occurred while fetching the user", error: err });
    }
};


const CreateUser = async (req, res) => {
    // #swagger.tags = ["Users"]
    try {
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            email: req.body.email
        };

        const response = await mongodb.getDatabase().db().collection("users").insertOne(user);

        if (response.acknowledged > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error occurred while inserting the user");
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while creating the user", error: err });
    }
};


const updateUser = async (req, res) => {
    // #swagger.tags = ["Users"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json("You must have a valid id to update user");
        }

        const userid = new ObjectId(req.params.id);
        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: req.body.password,
            email: req.body.email
        };

        const response = await mongodb.getDatabase().db().collection("users").replaceOne({ _id: userid }, user);

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "Some error occurred while updating the user");
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while updating the user", error: err });
    }
};


const deleteUser = async (req, res) => {
    // #swagger.tags = ["Users"]
    try {
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json("You must have a valid id to delete user");
        }

        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("users").deleteOne({ _id: userId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json(response.error || "An error occurred while deleting the user");
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred while deleting the user", error: err });
    }
};


module.exports = {
    getAll,
    getSingle,
    CreateUser,
    updateUser,
    deleteUser
}