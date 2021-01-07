const route = require("express").Router();
const User = require("../../models/User");
const gravater = require("gravatar");
const bcrypt = require("bcryptjs")
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken")
const config = require("config")

route.post("/", [
    check('name', "Name is reqiured").not().isEmpty(),
    check('email', "Please include a valid email").isEmail(),
    check('password', "Please enter a passowrd with 6 or more charachters").isLength({ min: 6 })
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, password } = req.body

    try {
        let user = await User.findOne({ email })
        if (user) return res.status(400).json({ errors: [{ msg: "User allready exits" }] })
        const avatar = gravater.url(email, { s: '200', r: 'pg', d: 'mm' })
        user = new User({ name, email, password, avatar })

        const salt = await bcrypt.genSalt(8)
        user.password = await bcrypt.hash(password, salt)

        await user.save()

        const payload = {
            user: {
                id: user.id,
            }
        }
        jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ token })
        })

    } catch (err) {
        console.log(err)
        res.status(500).send("server err")
    }

})
module.exports = route