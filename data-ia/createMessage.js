// message prompt envoyé a chaque commande a Dalek

function createMessages(userMessage, systemPrompt) {
  // console.log(systemPrompt);
  return [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: userMessage,
    },
  ];
}
