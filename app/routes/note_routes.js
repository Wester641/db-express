const { ObjectId } = require("mongodb"); // Импортируем ObjectId из библиотеки mongodb

module.exports = function (app, db) {
  // POST запрос для добавления заметки
  app.post("/notes", (req, res) => {
    const { title, body } = req.body;

    if (!title || !body) {
      return res.status(400).send({ error: "Title and body are required" });
    }

    const note = { text: body, title };

    db.collection("notes").insertOne(note, (err, result) => {
      if (err) {
        console.log("Insert error:", err);
        return res.status(500).send({ error: "An error has occurred" });
      } else {
        res.status(201).send({
          message: "Note inserted successfully!",
          note: result.ops[0],
        });
      }
    });
  });

  // GET запрос для получения всех заметок
  app.get("/notes", async (req, res) => {
    try {
      const notes = await db.collection("notes").find({}).toArray();
      res.status(200).send(notes);
    } catch (err) {
      console.log("Error retrieving notes:", err);
      res.status(500).send({ error: "Ошибка при получении заметок" });
    }
  });

  // PUT запрос для обновления заметки
  app.put("/notes/:id", async (req, res) => {
    const noteId = req.params.id; // Получаем ID из URL

    if (!noteId) {
      return res.status(400).send({ error: "ID is required" }); // Проверка на обязательность ID
    }

    const { title, body } = req.body; // Деструктурируем данные из тела запроса

    if (!title || !body) {
      return res.status(400).send({ error: "Title and body are required" }); // Проверка на обязательность данных
    }

    try {
      // Проверяем корректность ID
      const objectId = new ObjectId(noteId); // Используем ObjectId из mongodb

      const updatedNote = { title, text: body };

      // Выполняем обновление заметки
      const result = await db.collection("notes").updateOne(
        { _id: objectId }, // Находим заметку по ObjectId
        { $set: updatedNote } // Обновляем только title и text
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({ error: "Note not found" });
      }

      res.status(200).send({ message: "Note updated successfully!" });
    } catch (err) {
      console.log("Invalid ID or Update error:", err);
      res.status(400).send({
        error: "Invalid ID format or error during update",
        details: err.message,
      });
    }
  });

  app.delete("/notes/:id", async (req, res) => {
    const noteId = req.params.id;

    if (!noteId) {
      return res.status(400).send({ error: "ID is required" });
    }

    try {
      const objectId = new ObjectId(noteId); // Преобразуем ID в ObjectId

      const result = await db.collection("notes").deleteOne({ _id: objectId });

      if (result.deletedCount === 0) {
        return res.status(404).send({ error: "Note not found" });
      }

      res.status(200).send({ message: "Note deleted successfully!" });
    } catch (err) {
      console.log("Delete error:", err);
      res
        .status(500)
        .send({ error: "An error has occurred during the delete" });
    }
  });
};
