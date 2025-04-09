require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./Routes/route");

require('./Database/dbConnection')

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use('/Uploads', express.static('./Uploads'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`my Server running on port ${PORT} and waiting for client requests!`);
});

app.get('/', (req, res) => {
    res.status(200).send('<p style="color:green;">my Server running and waiting for client requests!</p>');
});
