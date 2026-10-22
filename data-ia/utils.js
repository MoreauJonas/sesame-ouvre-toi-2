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

    showDalekAlert();
  } else {
    renderMenu("all");
  }
}
function showDalekAlert() {
  let extermin = [" EXTERMINATE !!!!!"];
  const margin = 10;
  const mainContain = document.querySelector("main");

  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const dialog = document.createElement("dialog");

      dialog.classList.add("dalek-dialog");

      dialog.innerHTML = `
      <img
        src="https://thedoctorwhosite.co.uk/wp-images/daleks/profiles/19c-dalek-group.jpg"
        alt="Daleks"
        width="500"
      >
      <p>${extermin.join("")}</p>
      <button type="button">Fuir les Daleks !</button>
    `;
      extermin.push(extermin[0]);

      mainContain.append(dialog);

      dialog.querySelector("button").addEventListener("click", () => {
        dialog.close();
      });

      dialog.addEventListener("close", () => {
        dialog.remove();
      });

      dialog.show();

      // Position et dimensions de main dans la fenêtre
      const mainRect = mainContain.getBoundingClientRect();

      // Dimensions visibles de main
      const visibleLeft = Math.max(0, mainRect.left);
      const visibleTop = Math.max(0, mainRect.top);

      const visibleRight = Math.min(window.innerWidth, mainRect.right);
      const visibleBottom = Math.min(window.innerHeight, mainRect.bottom);

      // Dimensions du dialogue
      const dialogWidth = dialog.offsetWidth;
      const dialogHeight = dialog.offsetHeight;

      // Positions possibles dans la zone visible
      const maxX = Math.max(
        0,
        visibleRight - visibleLeft - dialogWidth - margin * 2,
      );

      const maxY = Math.max(
        0,
        visibleBottom - visibleTop - dialogHeight - margin * 2,
      );

      // Position aléatoire, relative à main
      const randomX =
        visibleLeft - mainRect.left + margin + Math.random() * maxX;

      const randomY = visibleTop - mainRect.top + margin + Math.random() * maxY;

      dialog.style.left = `${randomX}px`;
      dialog.style.top = `${randomY}px`;
    }, i * 1000);
  }
}
function validateAiInput(messageInput, htmlButton, htmlMessage, htmlTarget) {
  if (messageInput === "") {
    htmlResponseAi(htmlButton, htmlMessage, "Une envie d'EXTERMINATION !?");
    htmlTarget.classList.remove("is-error");

    return false;
  }
  return true;
}
