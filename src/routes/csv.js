const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/csv/:requestId", (req, res) => {
  const { requestId } = req.params;
  const csvPath = path.join(__dirname, "../../csv_outputs", `${requestId}.csv`);

  if (!fs.existsSync(csvPath)) {
    return res.status(404).json({ error: "CSV file not found for this request ID." });
  }

  fs.readFile(csvPath, "utf8", (err, data) => {
    if (err) {
      console.error(`Error reading CSV file:`, err);
      return res.status(500).json({ error: "Error reading CSV file." });
    }

    let formattedCSV = data.replace(/""/g, '"'); 
    formattedCSV = formattedCSV.replace(/\r?\n/g, "\r\n"); 

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${requestId}.csv"`);

    return res.status(200).send(formattedCSV);
  });
});

module.exports = router;
