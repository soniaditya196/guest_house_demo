const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const companySchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            trim: true
        },
        companyName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        phoneNumber: {
            type: String,
            trim: true
        },
        companyType: {
            type: String,
            enum: ["Software", "Core"]
        },
        links: {
            website: String,
            linkedin: String,
            facebook: String,
            twitter: String
        },
        secretToken: String,
        active: Boolean,

        role: {
            type: String,
            default: "company"
        }
    },
    {
		timestamps: {
			createdAt: 'createdAt',
			updatedAt: 'updatedAt'
		}
    }
);

const Company = mongoose.model('Company', companySchema);

module.exports = Company;

module.exports.hashPassword = async (password) => {
	try {
		const salt = await bcrypt.genSalt(10);
		return await bcrypt.hash(password, salt);
	} catch (error) {
		throw new Error('Hashing failed', error);
	}
};

module.exports.comparePasswords = async (inputPassword, hashedPassword) => {
	try {
		return await bcrypt.compare(inputPassword, hashedPassword);
	} catch (error) {
		throw new Error('Comparing failed', error);
	}
};