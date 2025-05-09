module.exports = function (app, db) {
  app.post("/notes", async (req, res) => {
    try {
      const note = { text: req.body.body, title: req.body.title };
      const result = await db.collection("notes").insertOne(note);
      res.status(201).send(result.ops?.[0] || result); // в v6 result.ops может быть undefined
    } catch (err) {
      console.error("Insert error:", err);
      res.status(500).send({ error: "An error has occurred" });
    }
  });
};
