const User = require('../../model/userModel')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const bcrypt = require('bcrypt');
const bcryptjs = require('bcryptjs')

const awsEmailResisterUrl = '';

const createUser = async (req, res) => {
    try{
        // check if the user already exists
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
          throw new Error("User already exists");
        }
    
     
       // hash the password
       const saltRounds = 10;
       const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
       req.body.password = hashedPassword;
    
        // save the user
        const user = new User(req.body);
        user.code = Date.now()
        await user.save();

        res.status(201).send({
            success: true,
            message: "User registered successfully!",
          });

      } catch (error) {
        res.send({
          success: false,
          message: error.message,
        });
      }
};

const login = async (req, res) => {
  try {

     // check if the user exists
     const user = await User.findOne({ email: req.body.email });
     if (!user) {
       throw new Error("User does not exist");
     }
 
     if (req.body.password !== user.passwordConfirm) {
        throw new Error('Unable to login 2')
      }

    const token = await user.generateAuthToken()
    res.send({
      success: true,
      data: token,
      message: "User logged in successfully",
      user: user
    });
    
  } catch (e) {
    res.status(400).send({
        success: false,
        message: e.message,
      })
    console.log(e)
  }
}

const logout = async (req, res) => {
  try {
    let token
    const authorization = req.get('authorization')
    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.substring(7)
    }
    const decoded = jwt.decode(token)
    const user = await User.findOne({ _id: decoded._id })

    if (!user) res.status(400).send('token is corrupted')

    const alreadyInvalidated = await User.find({ invalidatedTokens: token })

    if (alreadyInvalidated.length === 0) user.invalidatedTokens.push(token)

    user.invalidatedTokens = user.invalidatedTokens.filter((token) => {
      const { exp } = jwt.decode(token)
      if (Date.now() >= exp * 1000) return false
      else return true
    })

    await user.save()

    res.send('You Logged out')
  } catch (e) {
    res.status(500).send({ error: e.message || e.toString() })
  }
}

const updateUser = async (req, res) => {
  try {
    const id = req.user._id
    const usr = req.body
    const userOld = await User.findById(id).exec()
    const user = await User.findByIdAndUpdate(id, usr, { new: true }).exec()
    const token = await user.generateAuthToken()

    if (user.email !== userOld.email || !(user.isEmailRegistered)){
      axios.post(awsEmailResisterUrl, {
          InstructorEmail: user.email
        })
        .then(res => {
          console.log('email resistered: ' + res)
          User.findByIdAndUpdate(id, { isEmailRegistered :true }).exec()
        })
        .catch(err => {
          console.log("can't resister email: " + err)
          User.findByIdAndUpdate(id, { isEmailRegistered: false }).exec()
        })
    }else{
      console.log("email is not changed or already registered")
    }

    res.status(201).send({ user, token })
  } catch (e) {
    res.status(400).send(e)
  }
}

const deleteUser = async (req, res) => {
  try {
    await req.user.remove()
    res.status(200).send('Deleted thanks')
  } catch (e) {
    res.status(500).send('invalid Email')
  }
}

const me = async (req, res) => {
  res.send(req.user)
}

module.exports = {
  createUser,
  login,
  updateUser,
  logout,
  deleteUser,
  me
}