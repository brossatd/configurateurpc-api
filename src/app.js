const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const authRoutes = require('./routes/auth');
const componentRoutes = require('./routes/components');
const categoryRoutes = require('./routes/categories');
const partnerRoutes = require('./routes/partners');
const configurationRoutes = require('./routes/configurations');
const userRoutes = require('./routes/users');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // port du backoffice React
  credentials: true
}));
app.use(express.json());

// Routes principales
app.use('/api/auth', authRoutes);
app.use('/api/components', componentRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/configurations', configurationRoutes);
app.use('/api/users', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Exemple de route de test
app.get('/', (req, res) => {
  res.send('API ConfigurateurPC opérationnelle');
});

app.use(errorHandler);

module.exports = app;