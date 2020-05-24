const User = require('../models/user.model');

exports.register = (req,res) => {
    if(!req.body) {
        return res.status(400).send({
            message: "Please fill all required field"
        });
    }
    // Create a new User
    const newUser = new User({
        name: req.body.fullName,
        email:req.body.email,
        password:req.body.password
    })

    newUser.password = newUser.generateHash(req.body.password);
    newUser.save().then(rec => {
        res.status(201).json(rec);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something went wrong while creating new user."
        });
    });
}

exports.login = (req, res) => {
    User.findOne({email:req.body.email}).then(loginUser => {
        if(!loginUser) {
            return res.status(401).json({message:'Invalid username or password'})
        }
        if(!loginUser.validatePassword(req.body.password)) {
            return res.status(401).json({message:'Invalid username or password'})
        }
        //const withToken = {...loginUser};
        const withToken = {email:loginUser.email,_id:loginUser._id};
        withToken.token = loginUser.generateJWT();
        res.status(200).json(withToken);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Something went wrong while login."
        });
    });
}

