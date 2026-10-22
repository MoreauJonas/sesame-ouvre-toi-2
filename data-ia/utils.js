function htmlResponseAi(
  button,
  messageContent,
  textContent,
  className = null,
  buttonDisabled = false,
) {
  const buttonAi = document.querySelector(button);
  const messageOrderAi = document.querySelector(messageContent);

  messageOrderAi.textContent = textContent;
  if (className) {
    messageOrderAi.classList.toggle(className);
  }
  if (buttonDisabled) {
    buttonAi.disabled = true;
  }
}
