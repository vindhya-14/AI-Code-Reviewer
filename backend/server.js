const app = require("./src/app");
require('dotenv').config();

app.get('/api/ping', (req, res) => {
  res.send('Server is awake!');
});


app.listen(3000, () => {
    console.log(`server is running`)
})