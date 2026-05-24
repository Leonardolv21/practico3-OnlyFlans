const db = require("../models")
const userService = {
    findUserByEmail: async (email) => {
        return await db.user.findOne({
            where: {
                email
            }
        });
    },
    findUserById: async (id) => {
        return await db.user.findByPk(id);
    },
    createUser: async (name, email, password, role) => {
        return await db.user.create({
            name,
            email,
            password: password,
            role
        });
    },
    findCreatorById: async (id) => {
        return await db.user.findOne({ where: { id, role: "creator" } });
    }
}
module.exports = userService;
