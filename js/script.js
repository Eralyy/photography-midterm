document.addEventListener("DOMContentLoaded", function () {
  setupRegistration();
  setupServices();
  setupGallery();
});

function setupRegistration() {
  const form = document.getElementById("registration-form");
  if (!form) return;

  const name = document.getElementById("reg-name");
  const email = document.getElementById("reg-email");
  const password = document.getElementById("reg-password");
  const confirm = document.getElementById("reg-confirm");
  const strength = document.getElementById("password-strength");
  const status = document.getElementById("registration-status");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function feedback(input, message) {
    const note = document.getElementById(input.id + "-feedback");
    note.textContent = message;
    input.classList.toggle("is-invalid", message !== "");
    input.classList.toggle("is-valid", message === "" && input.value.trim() !== "");
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return message === "";
  }

  function passwordLevel(value) {
    if (!value) return "";
    const types = [/[a-z]/.test(value), /[A-Z]/.test(value), /\d/.test(value), /[^A-Za-z0-9]/.test(value)].filter(Boolean).length;
    if (value.length >= 12 && types >= 3) return "strong";
    if (value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value)) return "medium";
    return "weak";
  }

  function showStrength() {
    const level = passwordLevel(password.value);
    strength.textContent = level ? "Password strength: " + level : "Password strength: enter a password";
    strength.className = "password-strength" + (level ? " strength-" + level : "");
  }

  function checkName() {
    return feedback(name, name.value.trim() ? "" : "Enter your name.");
  }

  function checkEmail() {
    const value = email.value.trim();
    return feedback(email, !value ? "Enter your email." : emailPattern.test(value) ? "" : "Enter a valid email address.");
  }

  function checkPassword() {
    showStrength();
    const value = password.value;
    const message = !value ? "Enter a password." : value.length < 8 || !/[A-Za-z]/.test(value) || !/\d/.test(value) ? "Use at least 8 characters, including a letter and a number." : "";
    return feedback(password, message);
  }

  function checkConfirm() {
    return feedback(confirm, !confirm.value ? "Confirm your password." : confirm.value !== password.value ? "Passwords do not match." : "");
  }

  name.addEventListener("input", checkName);
  email.addEventListener("input", checkEmail);
  password.addEventListener("input", function () {
    checkPassword();
    if (confirm.value) checkConfirm();
  });
  confirm.addEventListener("input", checkConfirm);

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const valid = [checkName(), checkEmail(), checkPassword(), checkConfirm()].every(Boolean);
    status.className = "status-message " + (valid ? "is-success" : "is-error");
    status.textContent = valid
      ? "The form is valid. This is a demo; no account was created."
      : "Please correct the marked fields.";
    if (!valid) form.querySelector(".is-invalid").focus();
  });
}

function setupServices() {
  const form = document.getElementById("service-form");
  if (!form) return;

  const name = document.getElementById("service-name");
  const price = document.getElementById("service-price");
  const duration = document.getElementById("service-duration");
  const idField = document.getElementById("service-id");
  const body = document.getElementById("services-body");
  const saveButton = document.getElementById("service-save");
  const cancelButton = document.getElementById("service-cancel");
  const status = document.getElementById("service-status");
  const storageKey = "photography-services-v1";
  const defaults = [
    { id: 1, name: "Portrait", price: 10000, duration: "30 minutes" },
    { id: 2, name: "Outdoor", price: 15000, duration: "1 hour" },
    { id: 3, name: "Event", price: 25000, duration: "2 hours" }
  ];

  function readServices() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(function (item) {
          return Number.isInteger(item.id) && typeof item.name === "string" && Number.isFinite(item.price) && typeof item.duration === "string";
        })) return parsed;
      }
    } catch (error) {
      // The table still works in memory if browser storage is unavailable.
    }
    return defaults.map(function (item) { return { ...item }; });
  }

  let services = readServices();

  function saveServices() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(services));
      return true;
    } catch (error) {
      return false;
    }
  }

  function message(text, saved) {
    status.className = "status-message " + (saved ? "is-success" : "is-error");
    status.textContent = text + (saved ? "" : " Browser storage is unavailable; changes will disappear after reload.");
  }

  function cell(row, value, tagName) {
    const element = document.createElement(tagName || "td");
    element.textContent = value;
    row.appendChild(element);
    return element;
  }

  function render() {
    body.replaceChildren();
    if (services.length === 0) {
      const row = document.createElement("tr");
      cell(row, "No services yet. Add one using the form.", "td").colSpan = 4;
      body.appendChild(row);
      return;
    }
    services.forEach(function (item) {
      const row = document.createElement("tr");
      cell(row, item.name, "th").scope = "row";
      cell(row, Number(item.price).toLocaleString("en-US"));
      cell(row, item.duration);
      const actions = document.createElement("td");
      actions.className = "service-actions";
      [["edit", "Edit"], ["delete", "Delete"]].forEach(function (pair) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-sm btn-outline-secondary";
        button.dataset.action = pair[0];
        button.dataset.id = String(item.id);
        button.textContent = pair[1];
        actions.appendChild(button);
      });
      row.appendChild(actions);
      body.appendChild(row);
    });
  }

  function resetForm() {
    form.reset();
    idField.value = "";
    saveButton.textContent = "Add service";
    cancelButton.hidden = true;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = name.value.trim();
    const amount = Number(price.value);
    const time = duration.value.trim();
    if (!title || !Number.isFinite(amount) || amount <= 0 || !time) {
      status.className = "status-message is-error";
      status.textContent = "Enter a session name, a positive price and a duration.";
      return;
    }

    if (idField.value) {
      const item = services.find(function (service) { return service.id === Number(idField.value); });
      if (!item) return;
      item.name = title;
      item.price = amount;
      item.duration = time;
    } else {
      const nextId = Math.max(0, ...services.map(function (item) { return item.id; })) + 1;
      services.push({ id: nextId, name: title, price: amount, duration: time });
    }
    const saved = saveServices();
    render();
    resetForm();
    message("Service list updated.", saved);
  });

  body.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const item = services.find(function (service) { return service.id === Number(button.dataset.id); });
    if (!item) return;

    if (button.dataset.action === "edit") {
      idField.value = String(item.id);
      name.value = item.name;
      price.value = String(item.price);
      duration.value = item.duration;
      saveButton.textContent = "Save changes";
      cancelButton.hidden = false;
      name.focus();
    } else if (button.dataset.action === "delete" && window.confirm('Delete "' + item.name + '"?')) {
      services = services.filter(function (service) { return service.id !== item.id; });
      const saved = saveServices();
      render();
      resetForm();
      message("Service deleted.", saved);
    }
  });

  cancelButton.addEventListener("click", resetForm);
  render();
}

function setupGallery() {
  const search = document.getElementById("gallery-search");
  if (!search) return;

  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const filters = Array.from(document.querySelectorAll(".filter-btn[data-filter]"));
  const empty = document.getElementById("gallery-empty");
  let category = "all";

  function applyFilter() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    items.forEach(function (item) {
      const title = item.querySelector("figcaption").textContent.toLowerCase();
      const alt = item.querySelector("img").alt.toLowerCase();
      const matches = (category === "all" || item.dataset.category === category) &&
        (title.includes(query) || alt.includes(query) || item.dataset.category.includes(query));
      item.hidden = !matches;
      if (matches) count++;
    });
    empty.hidden = count !== 0;
  }

  search.addEventListener("input", applyFilter);
  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      category = button.dataset.filter;
      filters.forEach(function (filter) {
        const active = filter === button;
        filter.classList.toggle("is-active", active);
        filter.setAttribute("aria-pressed", String(active));
      });
      applyFilter();
    });
  });
  applyFilter();

  if (!window.jQuery) return;
  const $ = window.jQuery;
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightbox-image");
  const lightboxCaption = $("#lightbox-caption");
  let currentItem = null;
  let lastTrigger = null;

  function visibleItems() {
    return items.filter(function (item) { return !item.hidden; });
  }

  function showImage(item) {
    currentItem = item;
    const image = item.querySelector("img");
    lightboxImage.attr("src", image.getAttribute("src"));
    lightboxImage.attr("alt", image.alt);
    lightboxCaption.text(item.querySelector("figcaption").textContent);
  }

  function move(step) {
    const shown = visibleItems();
    if (!shown.length) return;
    const next = (shown.indexOf(currentItem) + step + shown.length) % shown.length;
    lightboxImage.stop(true, true).fadeOut(120, function () {
      showImage(shown[next]);
      lightboxImage.fadeIn(120);
    });
  }

  $(".gallery-trigger").on("click", function () {
    lastTrigger = this;
    showImage(this.closest(".gallery-item"));
    lightbox.attr("aria-hidden", "false").stop(true, true).fadeIn(200, function () {
      document.getElementById("lightbox-close").focus();
    });
  });

  function closeLightbox() {
    lightbox.stop(true, true).fadeOut(200, function () {
      lightbox.attr("aria-hidden", "true");
      if (lastTrigger) lastTrigger.focus();
    });
  }

  $("#lightbox-close").on("click", closeLightbox);
  $("#lightbox-prev").on("click", function () { move(-1); });
  $("#lightbox-next").on("click", function () { move(1); });
  lightbox.on("click", function (event) {
    if (event.target === this) closeLightbox();
  });
  $(document).on("keydown", function (event) {
    if (lightbox.attr("aria-hidden") === "true") return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  });
}
