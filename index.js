import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import zod from 'zod';
const app = express()
var mongoDB = 'mongodb+srv://admin:sachu@typingpanda.mgdkzdd.mongodb.net/massage';



app.use(express.json());
app.options('*', cors());

const connectDb = async () => {
  try {
      await mongoose.connect(mongoDB);
      console.log("MongoDB database connected");

  } catch (err) {
      console.error("Error connecting to database:", err);
      throw err; 
  }
}
connectDb();


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
      return res.status(400).json({ error: "invalid input" });
    }

    const { name, email, message } = validationError.data;

    const newMessage = new Message({
      name,
      email,
      message,
      createdAt: new Date()
    });
    console.log(newMessage);
    newMessage.save();

    return res.status(201).json({ message: "Message sent successfully!"});
  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({ error: "Internal server error" });
  }
});








app.listen(3000, () => {
  console.log('Listening on port 3000');
});
