const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (value.length <= 3)
          throw new Error("Name must be more than three characters");
      },
    },
    phone: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isMobilePhone(value, ["ar-EG"]))
          throw new Error("Please Provide your Egyptian phone number");
      },
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Please enter a valid email");
      }, // TODO Date of birth
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (value.length < 6)
          throw new Error(`Password must be 6 chars at least`);
      },
    },
    tokens: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timeStamps: true,
  }
);

// TODO Login;
userSchema.statics.findByCredentials = async (email, password) => {
  const thrownError = "Please Check your Email or Password!";
  const user = await User.findOne({ email });
  if (!user) throw new Error(thrownError);
  const isPassMatch = await bcrypt.compare(password, user.password);
  if (!isPassMatch) throw new Error(thrownError);
  return user;
};

// TODO Hashing Pass;
userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

// TODO Generate Token
userSchema.methods.generateToken = async function () {
  const user = this
  // console.log(user)  //099878iuguyy7868767tft78
  const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
  // [] = 
  user.tokens = user.tokens.concat(token)

  return token
};

const User = mongoose.model("User", userSchema);

module.exports = User;
