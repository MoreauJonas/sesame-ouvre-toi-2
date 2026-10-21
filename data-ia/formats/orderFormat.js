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
    exterminate: { type: "boolean" },
  },
  required: ["lines", "customer", "exterminate"],
  additionalProperties: false,
};
