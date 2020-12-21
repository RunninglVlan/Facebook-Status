const path = require('path');
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use('/test', express.static(path.join(__dirname, '../../test')))

app.listen(80, () => console.log('CORS-enabled web server listening on port 80'))
