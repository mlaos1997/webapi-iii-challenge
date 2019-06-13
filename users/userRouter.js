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
        const post = {
            user_id: req.user.id,
            text: req.body.text
        };
        const result = await postDb.insert(post);

        if (result) {
            res.json({message: "post added to database"})
        } else {
            res
                .status(400)
                .json({message: "could not add post to database"});
        }
    } catch (err) {
        res
            .status(500)
            .json(err);
    }
});

router.put('/:id', validateUserId, validateBody, validateUser, async(req, res) => {
    console.log(req.body);
    try {
        const user = await userDb.update(req.user.id, req.body);

        if (user) {
            res.json(user)
        } else {
            res
                .status(400)
                .json({message: 'unable to update the user'});
        }
    } catch (err) {
        res
            .status(500)
            .json(err);
    }
});

router.delete('/:id', validateUserId, async(req, res) => {
    try {
        const { id } = req.params;
        const user = await userDb.remove(id);
        res.status(200).json({ message: 'user removed from database'})
    } catch (err) {
        res.status(500).json({ message: 'user cannot be removed from database' })
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
