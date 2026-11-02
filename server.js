const express = require('express');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
app.use(express.json());

app.use('/api/books', bookRoutes);

app.listen(3000, () => console.log('Server running on port 3000'));