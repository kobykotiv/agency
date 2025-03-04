const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }
);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const userRouter = require('./routes/user');
const crewRouter = require('./routes/crew');
const agentRouter = require('./routes/agent');
const taskRouter = require('./routes/task');
const conversationRouter = require('./routes/conversation');

app.use('/user', userRouter);
app.use('/crew', crewRouter);
app.use('/agent', agentRouter);
app.use('/task', taskRouter);
app.use('/conversation', conversationRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});