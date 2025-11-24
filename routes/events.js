const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const { authMiddleware } = require('../middleware/auth');

const collectionName = 'events';

// Create new event (Protected)
router.post('/', authMiddleware, async (req, res) => {
  const db = req.db;
  const { title, shortDescription, fullDescription, date, price, imageUrl } = req.body;

  try {
    const newEvent = {
      title,
      shortDescription,
      fullDescription,
      date: new Date(date),
      price: Number(price),
      imageUrl: imageUrl || 'placeholder.jpg',
      creator: req.user.id, 
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'Active',
    };

    const result = await db.collection(collectionName).insertOne(newEvent);
    res.status(201).json({ ...newEvent, _id: result.insertedId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get all events (Public)
router.get('/', async (req, res) => {
  const db = req.db;
  try {
    const events = await db.collection(collectionName).find({}).sort({ date: 1 }).toArray();
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Get single event by ID
router.get('/:id', async (req, res) => {
  const db = req.db;
  try {
    const id = new ObjectId(req.params.id);
    const event = await db.collection(collectionName).findOne({ _id: id });
    if (!event) return res.status(404).json({ msg: 'Event not found' });
    res.json(event);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Delete event (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  const db = req.db;
  try {
    const id = new ObjectId(req.params.id);
    const event = await db.collection(collectionName).findOne({ _id: id });
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    if (event.creator !== req.user.id) {
      return res.status(403).json({ msg: 'User not authorized to delete this event' });
    }

    await db.collection(collectionName).deleteOne({ _id: id });
    res.json({ msg: 'Event removed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
