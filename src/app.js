const express = require("express");
const cors = require("cors");

const { isUuid } = require("uuidv4");
const { Repository, Repositories } = require("./model/repository");

const app = express();

app.use(express.json());
app.use(cors());

function validateInput(input, fields) {
  const validated = {
    data: {},
    error: false,
    messages: [],
  };
  for (const field of fields) {
    const message = {
      field: field.name,
      errors: [],
    };

    if (field.required) {
      if (!input[field.name]) {
        message.errors.push(`The field '${field.name}' is required`);
        continue;
      }

      if (field.type === "array" && !Array.isArray(input[field.name])) {
        message.errors.push(`The field '${field.name}' should be a list`);
        continue;
      } else if (field.type === "number" && isNaN(input[field.name])) {
        message.errors.push(`The field '${field.name}' should be a number`);
        continue;
      }
    }

    validated.data[field.name] = input[field.name] || field.default;
  }

  if (validated.messages.length) {
    validated.error = true;
  }

  return validated;
}

const repositoriesData = [];
const repositories = new Repositories(repositoriesData);

app.get("/repositories", (request, response) => {
  return response.json(repositories.findAll());
});

app.post("/repositories", (request, response) => {
  const validated = validateInput(request.body, [
    { name: "title", required: true },
    { name: "url", required: true },
    { name: "techs", required: true, type: "array" },
    { name: "likes", type: "number" },
  ]);

  if (validated.error) {
    return response.status(400).json(validated);
  }

  try {
    const repository = new Repository(validated.data);
    repositories.save(repository);

    return response.status(201).json(repository);
  } catch (error) {
    return response.status(400).json({ error });
  }
});

app.put("/repositories/:id", (request, response) => {
  const id = request.params.id;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "The 'id' param must be valid" });
  }

  if (!repositories.has(id)) {
    return response
      .status(400)
      .json({ error: "The repository must exists to be updated" });
  }

  const validated = validateInput(request.body, [
    { name: "title", required: true },
    { name: "url", required: true },
    { name: "techs", required: true, type: "array" },
  ]);

  if (validated.error) {
    return response.status(400).json(validated);
  }

  try {
    const updatedRepository = repositories.save({ id, ...validated.data });

    return response.json(updatedRepository);
  } catch (error) {
    return response.status(400).json({ error });
  }
});

app.delete("/repositories/:id", (request, response) => {
  const id = request.params.id;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "The 'id' param must be valid" });
  }

  try {
    const strict = true;
    repositories.delete(id, strict);

    return response.status(204).send();
  } catch (error) {
    return response.status(400).json({ error });
  }
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
