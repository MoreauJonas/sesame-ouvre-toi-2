const adviceFormat = {
  type: "object",
  properties: {
    ids: {
      type: "array",
      items: { type: "integer" },
      maxItems: 2,
      uniqueItems: true,
    },
    message: { type: "string" },
    exterminate: { type: "boolean" },
  },
  required: ["ids", "message", "required"],
  additionalProperties: false,
};
