const express = require('express');
const userDb = require('../users/userDb.js');
const postDb = require('../posts/postDb.js');

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const users = await userDb.get();
        res.json(users);
    } catch (err) {
        res
            .status(500)
            .json({err});
    };
});

router.get('/:id', validateUserId, async(req, res) => {
    res.json(req.user);
});

router.post('/', validateBody, validateUser, async(req, res) => {
    try {
        console.log('hey')
        const user = await userDb.insert(req.body);

        res
            .status(200)
            .json({message: 'User successfully added to database'});
    } catch (err) {
        res
            .status(500)
            .json({err});
    }
});

router.post('/:id/posts', validateUserId, validateBody, validatePost, async(req, res) => {
    try {
        console.log('inside post')
        const post = {
            user_id: req.user.id,
            text: req.user.text
        };
        const result = await postDb.insert(post);

        if (result) {
            res
                .status(200)
                .json({message: 'Post succesfully added to database'});
        } else {
            res
                .status(400)
                .json({message: 'Unable to add post to database'});
        }
    } catch (err) {
        res
            .status(500)
            .json(err);
    }
});

function validateBody(req, res, next) {
    if (!req.body || Object.keys(req.body).length === 0) {
        res
            .status(400)
            .json({message: 'missing user data'});
    };
    next();
};

async function validateUserId(req, res, next) {
    console.log('Validate User Id running')
    const {id} = req.params;
    if (!id) {
        res
            .status(400)
            .json({message: 'invalid user id'});
        req.user = user;
    };

    try {
        const user = await userDb.getById(id);
        if (!user) {
            res
                .status(400)
                .json({message: 'invalid user id'})
        }
        req.user = user;
    } catch (err) {
        res
            .status(500)
            .json({err});
    }
    next();
};

function validateUser(req, res, next) {
    const {name} = req.body;
    if (!name) {
        return res
            .status(400)
            .json({message: 'missing required name field'});
    };
    next();
};

function validatePost(req, res, next) {
    const {text} = req.body;

    if (!text) {
        res
            .status(400)
            .json({message: 'missing required text field'});
    };
    next();
};

module.exports = router;
