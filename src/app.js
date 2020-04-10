const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");
const { Repository } = require("./domain/repository");

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

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
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

  const repository = new Repository(validated.data);
  repositories.push(repository);
  console.log(repository);
  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // TODO
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
});

module.exports = app;
