// Create web server

// Import modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { Comment } = require('../models');
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

// GET route that returns a list of comments
router.get('/', asyncHandler(async (req, res) => {
    const comments = await Comment.findAll();
    res.json(comments);
}));

// GET route that returns a comment by id
router.get('/:id', asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);
    res.json(comment);
}));

// POST route that creates a new comment
router.post('/', authenticateUser, [
    check('comment')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "comment"'),
], asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400).json({ errors: errorMessages });
    } else {
        const comment = await Comment.create(req.body);
        res.status(201).json(comment);
    }
}));

// PUT route that updates a comment
router.put('/:id', authenticateUser, [
    check('comment')
        .exists({ checkNull: true, checkFalsy: true })
        .withMessage('Please provide a value for "comment"'),
], asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => error.msg);
        res.status(400).json({ errors: errorMessages });
    } else {
        const comment = await Comment.findByPk(req.params.id);
        if (comment) {
            await comment.update(req.body);
            res.status(204).end();
        } else {
            res.status(404).json({ message: 'Comment not found' });
        }
    }
}));

// DELETE route that deletes a comment
router.delete('/:id', authenticateUser, asyncHandler(async (req, res) => {
    const comment = await Comment.findByPk(req.params.id);
    if (comment) {
        await comment.destroy();
        res.status(204).end();
    } else {
        res.status(404).json({ message: 'Comment not found' });
    }
}));

module.exports = router;