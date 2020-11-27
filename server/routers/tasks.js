const express = require('express');
const {pick, isEmpty} = require('lodash');
const Task = require("./../models/Task");
const router = new express.Router();

router.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({});

        return res.status(201).json(tasks)
    } catch (e) {
        return res.status(500).send(e.message)
    }
});

router.get('/api/tasks/:id', async (req, res) => {
    const {id} = req.params;

    Task.findById(id, (error, task) => {
        if (error || !task) return res.status(404).send('The task was not found');

        return res.status(200).json(task)
    });
});

router.post('/api/tasks', async (req, res) => {
    const body = pick(req.body, ['description']);

    if (isEmpty(body)) return res.status(400).send('Empty body request');

    if (!body.description) return res.status(400).send('Error in body request');

    const task = new Task(body);

    try {
        const taskDB = await task.save();

        return res.status(201).json(taskDB)
    } catch (e) {
        return res.status(500).send(e.message)
    }
});

router.put('/api/tasks/:id', async (req, res) => {
    const {id} = req.params;
    const body = pick(req.body, ['description','completed']);

    if (isEmpty(body)) return res.status(400).send('Empty body request');

    Task.findById(id, (error, task) => {
        if (error || !task) return res.status(404).send('The task was not found');

        const taskKeys = Object.keys(body);

        taskKeys.forEach(key => {
            task[key] = body[key] || task[key];
        })

        task.save((error1, taskDB) => {
            if (error1) res.status(500).send(error1.message);

            return res.status(201).json(taskDB)
        });
    });

});

router.delete('/api/tasks/:id', (req, res) => {
    const {id} = req.params;

    Task.findByIdAndRemove(id, (error, taskRemoved) => {
        if (error || !taskRemoved) return res.status(404).send('The task was not found');

        return res.status(200).json(taskRemoved)
    });
});

module.exports = router;
