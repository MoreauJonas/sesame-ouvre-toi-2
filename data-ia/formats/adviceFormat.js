const adviceFormat = {
  type: "object",
  properties: {
    ids: {
      type: "array",
      items: { type: "integer" },
      maxItems: 2,
    },
    message: { type: "string" },
  },
  required: ["ids", "message"],
  additionalProperties: false,
};
