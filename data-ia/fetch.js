const MODEL_NAME = "dalek";
const OLLAMA_URL = "http://localhost:11434/api/chat";
async function askModel(messages, format = orderFormat) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages: messages,
      think: false,
      stream: false,
      format: format,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error);
  }
  const result = JSON.parse(data.message.content);

  // console.log("Réponse complète Ollama :", result);
  // console.log("lines :", result.lines);
  // console.log("customer :", result.customer);
  console.log("exterminate :", result.exterminate);

  return result;
}
