const route = require("express").Router();
const auth = require("../../middleware/auth")
const Profile = require("../../models/Profile")
const User = require("../../models/User")
const { check, validationResult } = require("express-validator");
const { update } = require("../../models/Profile");

route.get("/me", auth, async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ["name", "avatar"])
        if (!profile) return res.status(400).json({ msg: "the is no profile for this user" })
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server error")
    }
})

route.post("/", [auth, check("status", "Staus is required").not().isEmpty(),
        check("skills", "Skills is required").not().isEmpty()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

        const profileFields = {}
        profileFields.user = req.user.id;
        if (req.body.company) profileFields.company = req.body.company
        if (req.body.website) profileFields.website = req.body.website
        if (req.body.location) profileFields.location = req.body.location
        if (req.body.bio) profileFields.bio = req.body.bio
        if (req.body.status) profileFields.status = req.body.status
        if (req.body.githubusername) profileFields.githubusername = req.body.githubusername
        if (req.body.skills)
            profileFields.skills = req.body.skills.split(',').map(skill => skill.trim())

        profileFields.social = {}
        if (req.body.youtube) profileFields.social.youtube = req.body.youtube
        if (req.body.twitter) profileFields.social.twitter = req.body.twitter
        if (req.body.facebook) profileFields.social.facebook = req.body.facebook
        if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
        if (req.body.instagram) profileFields.social.instagram = req.body.instagram

        try {
            let profile = await Profile.findOne({ user: req.user.id })
            if (profile) {
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true, })
                return res.json(profile)
            }
            profile = new Profile(profileFields)
            await profile.save();
            res.json(profile)
        } catch (Err) {
            console.err(Err.message)
            return res.status(500).send("server err");
        }
    })

module.exports = route