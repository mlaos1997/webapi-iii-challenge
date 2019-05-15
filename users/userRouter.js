const express = require('express');
const userDb = require('./userDb.js');

const router = express.Router();

router.post('/', validatePost, validateUser, async (req, res) => {
    const { name } = req.body;
    userDb.insert(name)
    .then(res => {
        res.json(res);
    })
    .catch(err => {
        res.status(500).json({ err: 'Database could not get info'});
    })
});

router.get('/', async (req, res) => {
    try {
        const user = await userDb.get();
        res.json(user);
    } catch(err) {
        res.status(500).json(err);
    }
});

router.get('/:id', (req, res) => {
    res.json(req.user);
});

router.get('/:id/posts', validateUserId, async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await userDb.getUserPosts(id)
        if(posts) {
            res.status(200).json(posts);
        } else {
            res.status(400).json({ message: 'Could not get posts'});
        }
    }
});

router.delete('/:id', validateUserId, async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userDb.remove(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'User cannot be removed'});
    }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
    try {
        
    }
});

//custom middleware

async function validateUserId(req, res, next) {
    try {
        const { id } = req.params;
        const user = await userDb.getById(id);
        if (user) {
            req.user = user;
            next();
        } else {
            res.status(404).json({ message: 'invalid user id' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Failed to process request'});
    }
    next();
};

async function validateUser(req, res, next) {
    const { name } = req.body;
    if(!name) {
        res.status(400).json({ message: "Missing required name field"})
    } else if (!req.body) {
        res.status(400).json({message: 'missing user data'})
    }
    next();
};


module.exports = router;
