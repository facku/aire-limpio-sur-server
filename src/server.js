require('./config');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const app = express();

app.use(cors());

app.use(express.json());

app.use(require('./routes'));

//Global Erros Handlers
app.use((error, req, res, next) => {
    return res.status(500).json({ ok: false, error: error.message });
});

app.listen(process.env.PORT, (server) =>
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
);
