const Box = require("../models/Box")

class BoxController {
    async store(req, res) {
        const box = await Box.create({ title: req.body.title });
        return res.json(box)
    }

    async show(req, res) {
        const box = await Box.findById(req.params.id).populate({
            path: 'files',
            options: {
                sort: { createdAt: -1 }
            }
        });
        return res.json(box)
    }
    
    async list(req, res){
        const box = await Box.find(req.params.title)
        return res.json(box)
    }
    
    async remove(req, res){
        console.log(req.body._id)
        const box = await Box.remove({_id: req.body._id});
        return res.json(box.deletedCount)
    }
}

module.exports = new BoxController();