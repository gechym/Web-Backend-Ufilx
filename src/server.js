require('dotenv').config()// môi trường ảo
import express from 'express'
import bodyParser from 'body-parser'
import viewEngine from './config/viewEngine'// import viewengine 
import router from './router/web' // import các router 
import connectDB from './config/connectDB'
// import cors from 'cors'

let app = express();// khởi tao web app
let port = process.env.PORT || 6969;// port khi khởi chạy server


// CORS middleware
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    // res.setHeader('Access-Control-Allow-Origin', 'http://9ad2198f4f79.ngrok.io');

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');


    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

// config app 
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// app.use(cors({origin:true}))

viewEngine(app)
router(app)
connectDB()

app.listen(port, () => {
    console.log(`Example app listening at http://locallhost:${port}`)
})





