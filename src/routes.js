const express = require('express')
const multer = require('multer')
const multerConfig = require('./config/multer')
const routes = express.Router()

require('./app/controllers/index')

routes.get("/", (req, res) => {
    res.send("Hello World")
})

routes.post("/boxes", BoxController.store);
routes.get("/boxes", BoxController.list);
routes.delete("/boxes", BoxController.remove);
routes.get("/boxes/:id", BoxController.show);
routes.post("/boxes/:id/files",
    multer(multerConfig).single('file'),
    FileController.store
);


module.exports = routes;