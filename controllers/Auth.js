const usermodel = require("../models/user");
const ownermodel = require("../models/owner");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/generatetoken");
const upload = require("../config/multer-config");

exports.signup = async (req, res) => {
  try {
    let { name, email, password,street,city,state,postalCode } = req.body;

    const existinguser = await usermodel.findOne({ email });

    if (existinguser) {
      return res.status(201).json({ message: "Email already registered" });
    } else {
      try {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
              return res.json({ message: err.message });
            }
            let createduser = await usermodel.create({
              name,
              email,
              password: hash,
              address: {
                street: street,
                city: city,
                state: state,
                postalCode: postalCode,
              },
            });
            console.log(createduser);
            return res
              .status(200)
              .json({ message: "User Succesfully Created" });
          });
        });
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;

    let user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(301).json({ message: "Invalid email or password" });
    }
    bcrypt.compare(password, user.password, (err, result) => {
      if (result) {
        let token = generateToken(user);
        res.cookie("token", token, {
          maxAge: 3600000,
          sameSite: "lax",
        });

        return res
          .status(200)
          .json({ message: "Logged In Successfully", token: token });
      } else {
        return res.status(201).json({ message: "Incorrect Email Or Password" });
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.ownersignup = async (req, res) => {
  const { name, email, password, businessname, contact, gstin } = req.body;

  if (req.file) {
    try {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          if (err) {
            return res.json({ message: err.message });
          }
          let owner = await ownermodel.create({
            name,
            password:hash,
            businessname,
            contact,
            email,
            gstin,
            logo: req.file.buffer,
          });
          console.log(owner);
          let token = generateToken(user);
          res.cookie("token", token, {
            maxAge: 3600000,
            sameSite: "lax",
          });
          return res.status(200).json({ message: "Account created Successfully",token:token });
        });
      });

     
    } catch (err) {
      console.log(err);
      res.status(201).json({ message: "error creating account" });
    }
  }
};

exports.ownerlogin = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Find the owner by email
    let owner = await ownermodel.findOne({ email });

    if (!owner) {
      // Use status 401 for Unauthorized access
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Use async/await for bcrypt.compare
    const isMatch = await bcrypt.compare(password, owner.password);
    
    if (isMatch) {
      let token = generateToken(owner);

      // Set a cookie with the token
      res.cookie("token", token, {
        maxAge: 3600000, // 1 hour
        sameSite: "lax",
      });

      return res.status(200).json({ message: "Logged In Successfully", token: token });
    } else {
      // Use status 401 for Unauthorized when password doesn't match
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    // Return 500 status for server error
    return res.status(500).json({ message: err.message });
  }
};

exports.updateprofile = async (req, res) => {
  try {
    const { id } = req.params;
    
    let updateFields = {};
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updateFields.password = hashedPassword;
    }
    if (req.file && req.file.buffer) {
      updateFields.profile = req.file.buffer;
    }

    // Check if updateFields is empty
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const user = await usermodel.findOneAndUpdate({ _id: id }, updateFields, { new: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to update profile" });
  }
};
exports.getprofile = async (req, res) => {
  try {
    const {id}=req.params
    const user = await usermodel.findOne({_id:id});
    
    return res.status(200).json({ message: "Profile fetched successfully",user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch profile" });
  }
}
