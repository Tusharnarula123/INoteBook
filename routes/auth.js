const express = require('express')
const router = express.Router()
const User = require("../models/user")
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const JWT_SECRET = 'Thisisabestinotebookwebsite'
const jwt = require('jsonwebtoken')
const fetchuser=require('../middleware/fetchuser');

// ROUTE:1 create a user using post "/api/auth/createuser"
router.post('/createuser', [
   body('name', "enter a valid name").isLength({ min: 3 }),
   body('email', "enter a valid email").isEmail(),
   body('password', "password must be atleast 5 character").isLength({ min: 5 }),
], async (req, res) => {
   let success=false;
   //If there is error return Bad request

   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
   }

   //check weather user with same  already exists

   try {
      let user = await User.findOne({ email: req.body.email })
      if (user) {
         return res.status(400).json({ error: "Sorry a user with same emailalready exists" })
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt)
      //create a new user
      user = await User.create({
         name: req.body.name,
         email: req.body.email,
         password: secPass,
      })


      const data = {
         user: {
            id: user.id
         }
      }
      const authToken = jwt.sign(data, JWT_SECRET)

      success=true;
      res.json({success, authToken })
   } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
   }
})



//ROUTE:2 Authenticate  a user using post "/api/auth/login"
router.post('/login', [
   body('email', "enter a valid email").isEmail(),
   body('password', "Password cannot be blank").exists(),
], async (req, res) => {
   let success=false;
   const errors = validationResult(req);
   if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
   }
   const { email, password } = req.body;
   try {
      let user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ error: "Pleae try to login with correct credentials" });
      }

      const passwordCompare =await  bcrypt.compare(password, user.password)
      if (!passwordCompare) {
         success=false;
         return res.status(400).json({success, error: "Pleae try to login with correct credentials" });
      }

      const data = {
         user: {
            id: user.id
         }
      }
      const authToken = jwt.sign(data, JWT_SECRET)
      success=true;
      res.json({ success,authToken })
   }  catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
   }

})

//ROUTE:3 Get logedin user detail using:  POST "/api/auth/getuser" Login required

router.post('/getuser',fetchuser, async (req, res) => {
try {
   userId=req.user.id;
   const user=await User.findById(userId).select("-password")
   res.send(user)
} catch (error) {
   console.log(error.message);
   res.status(500).send("Internal Server Error");
}
})
module.exports = router