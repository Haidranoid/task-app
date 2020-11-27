const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');
const validator = require('validator');

// declares the schema and his properties
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
    },
    age: {
        type: Number,
        default: 0,
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
    // to render the avatar use the tag
    // <img src="datA:image/jpg;base64,<BUFFER>"
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true,
})

// apply validation for each property in the schema
/*
userSchema.path('email').validate({
    validator: async value => {
        try {
            // TODO - validate when the self user try to change his email
            const emailCounted = await User.countDocuments({email: value});
            return emailCounted <= 0 && validator.isEmail(value);
        } catch (e) {
            console.log(e)
            return false;
        }
    },
    message: props => !validator.isEmail(props.value)
        ? `${props.value} is not a valid email.`
        : `The email ${props.value} already exists.`
})
*/
userSchema.path('email').validate({
    validator: value => validator.isEmail(value),
    message: props => `${props.value} is an invalid email.`
})

userSchema.path('password').validate({
    validator: value => value.toLowerCase() !== "password",
    message: "Invalid password."
});

userSchema.path('age').validate({
    validator: value => value >= 0,
    message: props => `${props.value} must be a positive number.`
});

// find the user in the data base
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) throw new Error('User or password incorrect');

    const isMatch = await bcrypt.compareSync(password, user.password);
    if (!isMatch) throw new Error('User or password incorrect');

    return user;
}
// remove the password and version sent
userSchema.methods.toJSON = function (props) {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    delete userObject.__v;

    return userObject;
};

// remove the password and version sent
userSchema.methods.generateAuthToken = async function (props) {
    const token = jwt.sign(JSON.stringify(this), 'secret-development')

    this.tokens = this.tokens.concat({token})
    await this.save();

    return token;
};

// hash the user password before save it
userSchema.pre("save", function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }

    next();
})

userSchema.plugin(uniqueValidator, {message: 'Error, expected {PATH} to be unique.'});

const User = mongoose.model('User', userSchema);
module.exports = User;

