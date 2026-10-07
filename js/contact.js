const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  status.hidden = false;
  status.textContent = "Your form is complete. This is a demo, so no message was sent.";
});

form.addEventListener("input", function () {
  status.hidden = true;
});
