const menuPrompt = menu
  .map(
    (e) =>
      `id:${e.id}, name:${e.name}, category:${e.category},price:${e.price},available:${e.available}, `,
  )
  .join("|");
