const express = require("express");
const Request = require("../models/Request");

const router = express.Router();

router.get("/status/:requestId", async(req, res) => {
    const request = await Request.findById(req.params.requestId);
    res.json(request);
});

module.exports = router;