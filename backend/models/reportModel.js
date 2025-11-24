const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  title: String,
  category: String,
  date: Date,
  value: Number,
});

// Text index for fast search on title
reportSchema.index({ title: "text" });

// Index category + date for faster filtering
reportSchema.index({ category: 1, date: -1 });

module.exports = mongoose.model("Report", reportSchema);
