const express = require('express');
const app = express();
const zod = require('zod');
const cors = require('cors');

var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://admin:sachu@typingpanda.mgdkzdd.mongodb.net/massage';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(express.json());



const massageSchema = zod.object({
  name: zod.string(),
  email: zod.string(),
  message: zod.string(),
})

const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Message = mongoose.model('Message', messageSchema);


app.get("/message", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})



app.post("/message", (req, res) => {
  const { error } = massageSchema.safeParse(req.body);
  const { name, email, message } = req.body;
  const newMessage = new Message({
    name,
    email,
    message,
    createdAt: new Date()
  });
  newMessage.save();
  res.send("Message sent successfully!");
})






app.listen(3000);