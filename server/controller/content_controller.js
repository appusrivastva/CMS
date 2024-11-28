const Content = require("../model/contentModel");

// Create new content
exports.createContent = async (req, res) => {
  try {
    const { title, body } = req.body;
    const content = new Content({ title, body, createdBy: req.user.id });
    await content.save();
    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all content
exports.getAllContent = async (req, res) => {
  try {
    const content = await Content.find();
    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Flag content
exports.flagContent = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);
    if (!content) return res.status(404).json({ message: "Content not found" });

    content.flagged = !content.flagged;
    await content.save();
    res
      .status(200)
      .json({ message: "Content flagged status updated", content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
