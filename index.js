const express = require('express');
const app = express();
const zod = require('zod');
const cors = require('cors');

app.use(cors());
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://admin:sachu@typingpanda.mgdkzdd.mongodb.net/massage';
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.use(express.json());



const massageSchema = zod.object({
  name: zod.string(),
  email: zod.string().email(),
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


app.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
})



app.post("/message", (req, res) => {
  try {
    const validationError = massageSchema.safeParse(req.body);

    if (validationError.success === false) {
      return res.status(400).json({ error: "invalid emanil" });
    }

    const { name, email, message } = validationError.data;

    const newMessage = new Message({
      name,
      email,
      message,
      createdAt: new Date()
    });

    newMessage.save();

    res.status(201).json({ message: "Message sent successfully!"});
  } catch (error) {
    console.error("Error:", error);

    res.status(500).json({ error: "Internal server error" });
  }
});







app.listen(3000);