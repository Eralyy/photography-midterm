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
  const confirmation = document.getElementById("reg-confirm");
  const strength = document.getElementById("password-strength");
  const status = document.getElementById("registration-status");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showFeedback(input, message) {
    document.getElementById(input.id + "-feedback").textContent = message;
    input.classList.toggle("is-invalid", message !== "");
    input.classList.toggle("is-valid", message === "" && input.value !== "");
    input.setAttribute("aria-invalid", message ? "true" : "false");
    return message === "";
  }

  function checkName() {
    if (name.value.trim() === "") return showFeedback(name, "Enter your name.");
    return showFeedback(name, "");
  }

  function checkEmail() {
    if (email.value.trim() === "") return showFeedback(email, "Enter your email.");
    if (!emailPattern.test(email.value.trim())) return showFeedback(email, "Enter a valid email address.");
    return showFeedback(email, "");
  }

  function checkPassword() {
    const value = password.value;
    let level = "weak";
    if (value.length >= 12 && /[a-z]/.test(value) && /[A-Z]/.test(value) &&
        /\d/.test(value) && /[^A-Za-z0-9]/.test(value)) {
      level = "strong";
    } else if (value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value)) {
      level = "medium";
    }
    strength.textContent = value ? "Password strength: " + level : "Password strength: enter a password";
    strength.className = "password-strength" + (value ? " strength-" + level : "");

    if (value === "") return showFeedback(password, "Enter a password.");
    if (value.length < 8 || !/[A-Za-z]/.test(value) || !/\d/.test(value)) {
      return showFeedback(password, "Use at least 8 characters with a letter and a number.");
    }
    return showFeedback(password, "");
  }

  function checkConfirmation() {
    if (confirmation.value === "") return showFeedback(confirmation, "Confirm your password.");
    if (confirmation.value !== password.value) return showFeedback(confirmation, "Passwords do not match.");
    return showFeedback(confirmation, "");
  }

  name.addEventListener("input", checkName);
  email.addEventListener("input", checkEmail);
  password.addEventListener("input", function () {
    checkPassword();
    if (confirmation.value !== "") checkConfirmation();
  });
  confirmation.addEventListener("input", checkConfirmation);
  form.addEventListener("input", function () { status.textContent = ""; });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const nameOk = checkName();
    const emailOk = checkEmail();
    const passwordOk = checkPassword();
    const confirmationOk = checkConfirmation();
    const valid = nameOk && emailOk && passwordOk && confirmationOk;
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
  const id = document.getElementById("service-id");
  const body = document.getElementById("services-body");
  const saveButton = document.getElementById("service-save");
  const cancelButton = document.getElementById("service-cancel");
  const status = document.getElementById("service-status");
  const startingServices = [
    { name: "Portrait", price: 10000, duration: "30 minutes" },
    { name: "Outdoor", price: 15000, duration: "1 hour" },
    { name: "Event", price: 25000, duration: "2 hours" }
  ];
  let services = startingServices;

  function showStatus() {
    status.textContent = "Service list updated. Changes last until the page is reloaded.";
    status.className = "status-message is-success";
  }

  function clearForm() {
    form.reset();
    id.value = "";
    saveButton.textContent = "Add service";
    cancelButton.hidden = true;
  }

  function renderTable() {
    body.innerHTML = "";
    if (services.length === 0) {
      body.innerHTML = '<tr><td colspan="4">No services yet. Add one using the form.</td></tr>';
      return;
    }

    services.forEach(function (service, index) {
      const row = body.insertRow();
      row.innerHTML = '<th scope="row"></th><td></td><td></td><td class="service-actions"></td>';
      row.cells[0].textContent = service.name;
      row.cells[1].textContent = Number(service.price).toLocaleString("en-US");
      row.cells[2].textContent = service.duration;

      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "btn btn-sm btn-outline-secondary";
      editButton.textContent = "Edit";
      editButton.addEventListener("click", function () {
        id.value = String(index);
        name.value = service.name;
        price.value = service.price;
        duration.value = service.duration;
        saveButton.textContent = "Save changes";
        cancelButton.hidden = false;
        name.focus();
      });

      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "btn btn-sm btn-outline-secondary";
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        if (!window.confirm('Delete "' + service.name + '"?')) return;
        services.splice(index, 1);
        clearForm();
        renderTable();
        showStatus();
      });

      row.cells[3].append(editButton, deleteButton);
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const newService = {
      name: name.value.trim(),
      price: Number(price.value),
      duration: duration.value.trim()
    };
    if (!newService.name || !Number.isFinite(newService.price) ||
        newService.price <= 0 || !newService.duration) {
      status.textContent = "Enter a name, a positive price and a duration.";
      status.className = "status-message is-error";
      return;
    }
    if (id.value === "") {
      services.push(newService);
    } else {
      services[Number(id.value)] = newService;
    }
    clearForm();
    renderTable();
    showStatus();
  });

  cancelButton.addEventListener("click", clearForm);
  renderTable();
}

function setupGallery() {
  const search = document.getElementById("gallery-search");
  if (!search) return;

  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const buttons = document.querySelectorAll(".filter-btn");
  const empty = document.getElementById("gallery-empty");
  let category = "all";

  function filterPhotos() {
    const query = search.value.trim().toLowerCase();
    let count = 0;
    items.forEach(function (item) {
      const title = item.querySelector("figcaption").textContent.toLowerCase();
      const photoCategory = item.dataset.category;
      const matchesCategory = category === "all" || photoCategory === category;
      const matchesSearch = title.includes(query) || photoCategory.includes(query);
      item.hidden = !(matchesCategory && matchesSearch);
      if (!item.hidden) count++;
    });
    empty.hidden = count > 0;
  }

  search.addEventListener("input", filterPhotos);
  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      category = button.dataset.filter;
      buttons.forEach(function (other) {
        const active = other === button;
        other.classList.toggle("is-active", active);
        other.setAttribute("aria-pressed", String(active));
      });
      filterPhotos();
    });
  });
  filterPhotos();

  if (!window.jQuery) return;
  const $ = window.jQuery;
  const lightbox = $("#lightbox");
  const lightboxImage = $("#lightbox-image");
  let currentIndex = 0;

  function visiblePhotos() {
    return items.filter(function (item) { return !item.hidden; });
  }

  function showPhoto(index) {
    const photos = visiblePhotos();
    if (photos.length === 0) return;
    currentIndex = (index + photos.length) % photos.length;
    const photo = photos[currentIndex];
    const image = photo.querySelector("img");
    lightboxImage.attr("src", image.getAttribute("src"));
    lightboxImage.attr("alt", image.alt);
    $("#lightbox-caption").text(photo.querySelector("figcaption").textContent);
  }

  $(".gallery-trigger").on("click", function () {
    currentIndex = visiblePhotos().indexOf(this.closest(".gallery-item"));
    showPhoto(currentIndex);
    lightbox.attr("aria-hidden", "false").fadeIn(200);
  });

  function closeLightbox() {
    lightbox.fadeOut(200, function () { lightbox.attr("aria-hidden", "true"); });
  }

  function move(step) {
    lightboxImage.fadeOut(120, function () {
      showPhoto(currentIndex + step);
      lightboxImage.fadeIn(120);
    });
  }

  $("#lightbox-close").on("click", closeLightbox);
  $("#lightbox-prev").on("click", function () { move(-1); });
  $("#lightbox-next").on("click", function () { move(1); });
  lightbox.on("click", function (event) {
    if (event.target === this) closeLightbox();
  });
}
