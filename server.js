const express = require("express")
const path = require("path");

const app = express();


app.use(express.static(path.join(__dirname,"frontend")));


const PORT = 8000 || process.env.PORT;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));