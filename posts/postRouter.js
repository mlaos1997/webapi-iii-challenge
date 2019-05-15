const express = require('express');
const postDb = require('../posts/postDb.js');

const router = express.Router();

router.get('/', async(req, res) => {
    try {
        const posts = await postDb.get();
    
        if(Object.keys(posts).length === 0) {
            res.status(400).json({ message: 'could not retrieve posts' })
        };
        res.json(posts);
    } catch (err) {
        res.status(500).json({ err });
    }
});

router.get('/:id', (req, res) => {});

router.delete('/:id', (req, res) => {});

router.put('/:id', (req, res) => {});

// custom middleware
function validatePost(req, res, next) {
    const {text} = req.body;

    if (!text) {
        res
            .status(400)
            .json({message: 'missing required text field'});
    };
    next();
};

async function validatePostId(req, res, next) {
    const {id} = req.params;
    try {
        const post = await postDb.getById(id);
        if (Object.keys(post).length === 0) {
            return res
                .status(400)
                .json({message: 'could not retrieve post'});
            req.post = post;
        };
    } catch (err) {
        res
            .status(500)
            .json({err});
    }
    next();
};

function validateBody(req, res, next) {
    if (!req.body || Object.keys(req.body).length === 0) {
        res
            .status(400)
            .json({message: 'missing user data'});
    };
    next();
};

module.exports = router;