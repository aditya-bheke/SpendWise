const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const transactionsRoute = require('./routes/transactions');
const budgetsRoute = require('./routes/budgets');
const summaryRoute = require('./routes/summary');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionsRoute);
app.use('/api/budgets', budgetsRoute);
app.use('/api/summary', summaryRoute);

let mongoServer;

const startServer = async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
  console.log('MongoDB in-memory database connected');

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer().catch(err => console.error(err));

process.on('SIGINT', async () => {
  if (mongoServer) {
    await mongoose.disconnect();
    await mongoServer.stop();
  }
  process.exit();
});
