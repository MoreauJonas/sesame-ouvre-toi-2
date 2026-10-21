// Format pour les commandes
const orderFormat = {
  type: "object",
  properties: {
    lines: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          quantity: { type: "integer" },
        },
        required: ["id", "name", "quantity"],
        additionalProperties: false,
      },
    },
    customer: { type: "string" },
  },
  required: ["lines", "customer"],
  additionalProperties: false,
};
