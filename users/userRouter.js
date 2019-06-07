const express = require('express');

const router = express.Router();

const Posts = require('../posts/postDb')
const Users = require('./userDb')

router.post('/', validateUser, async (req, res) => {
    try {
        const users = await Users.insert(req.body);
        res.status(201).json(users);
    } catch (error) {
    console.log(error);
    }
});

router.post('/:id/posts', validatePost, async (req, res) => {
    try {
    const userId  = req.body
    const posts = await Posts.insert(userId);
    res.status(200).json(posts);
    } catch (error) {
        console.log(error);
    }
});

router.get('/', async (req, res) => {
    try {
        const users = await Users.get(req.query);
        res.status(200).json(users);
    } catch (error) {
    console.log(error);
    }
});

router.get('/:id', validateUserId, async (req, res) => {
    try {
        const userId = await Users.getById(req.params.id);
        res.status(200).json(userId);
    } catch (error) {
    console.log(error);
    }
});

router.get('/:id/posts', async (req, res) => {
    try {
        const userId = req.params.user_id;
    const posts = await Posts.get(userId);
    res.status(200).json(posts);
    } catch (error) {
        console.log(error);
    }
});

router.delete('/:id', async (req, res) => {
try {
    const deleteId = await Users.remove(req.params.id);
    res.status(200).json(deleteId)
} catch (error) {
console.log(error);
}
});

router.put('/:id', async (req, res) => {
try {
    const { id } = req.params;
    const changes = req.body;
    const updatedUser = await Users.update(id, changes);
    res.status(201).json(updatedUser);
} catch (error) {
    console.log(error);
}
});

//custom middleware

function validateUserId(req, res, next) {
    console.log('Hello from ValidateId.')
    const { id } = req.params;
    Users.getById(id)
    .then(user => {
        if(user) {
            req.user = user;
            next();
        } else {
            res.status(404).json({ message: 'Invalid ID; User ID does not exist.'})
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ message: 'Failed to process request.'})
    })
};

function validateUser(req, res, next) {
    console.log('Hello from the User.');
    if(req.body && Object.keys(req.body).length > 0) {
        next();
    } else if(!req.name) {
        res.status(400).json({ message: 'Missing required name field.'})
    } else {
    res.status(400).json({ message: 'Missing required name field.'})
    }
};

function validatePost(req, res, next) {
    console.log('Hello from the PostValidator.');
    if(req.body && Object.keys(req.body).length > 0) {
        next();
    } else if(!req.text) {
        res.status(400).json({ message: 'Missing required text field.'})
    } else {
    res.status(400).json({ message: 'Missing required fields.'})
    }
};

module.exports = router;
