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
function handleExterminate(isExterminate, button, message) {
  const mainContain = document.querySelector("main");

  mainContain.classList.toggle("exterminate-main", isExterminate);

  if (isExterminate) {
    htmlResponseAi(
      button,
      message,
      "Doctor Who détecté ...EXTERMINATE !!!!",
      "is-error",
    );

    renderMenu("all", "exterminate");
    let extermin = [" EXTERMINATE !!!!!!!!!!!"];
    for (let i = 0; i < 5; i++) {
      alert(`${extermin.join("")}`);
      extermin.push(extermin[0]);
    }
  } else {
    renderMenu("all");
  }
}
