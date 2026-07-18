(function () {
  "use strict";

  var menuButton = document.querySelector(".menu-toggle");
  var navigation = menuButton ? document.getElementById(menuButton.getAttribute("aria-controls")) : null;

  function closeMenu(returnFocus) {
    if (!menuButton || !navigation) return;
    navigation.classList.remove("nav-open");
    menuButton.classList.remove("menu-toggle-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Открыть меню");
    if (returnFocus) menuButton.focus();
  }

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      var willOpen = menuButton.getAttribute("aria-expanded") !== "true";
      navigation.classList.toggle("nav-open", willOpen);
      menuButton.classList.toggle("menu-toggle-open", willOpen);
      menuButton.setAttribute("aria-expanded", String(willOpen));
      menuButton.setAttribute("aria-label", willOpen ? "Закрыть меню" : "Открыть меню");
      if (willOpen) {
        var firstLink = navigation.querySelector("a");
        if (firstLink) firstLink.focus();
      }
    });

    navigation.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeMenu(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") closeMenu(true);
    });
  }

  document.querySelectorAll("[data-model-offer]").forEach(function (button) {
    button.addEventListener("click", function () {
      var select = document.querySelector("[data-model-select]");
      if (select) select.value = button.getAttribute("data-model-offer");
      var consultation = document.getElementById("consultation");
      if (consultation) consultation.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  });

  var calloutGroup = document.querySelector(".service-callouts");
  if (calloutGroup && "IntersectionObserver" in window) {
    var calloutObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        calloutGroup.classList.add("callouts-visible");
        calloutObserver.disconnect();
      }
    }, { threshold: 0.35 });
    calloutObserver.observe(calloutGroup);
  } else if (calloutGroup) {
    calloutGroup.classList.add("callouts-visible");
  }

  document.querySelectorAll("[data-callout]").forEach(function (button) {
    button.addEventListener("click", function () {
      var callout = button.closest(".service-callout");
      var willOpen = !callout.classList.contains("is-active");

      document.querySelectorAll(".service-callout.is-active").forEach(function (activeCallout) {
        activeCallout.classList.remove("is-active");
        var activeButton = activeCallout.querySelector("[data-callout]");
        if (activeButton) activeButton.setAttribute("aria-expanded", "false");
      });

      callout.classList.toggle("is-active", willOpen);
      button.setAttribute("aria-expanded", String(willOpen));
    });
  });

  document.querySelectorAll("[data-offer-form]").forEach(function (form) {
    var slot = form.closest(".form-slot");
    var live = form.querySelector("[data-form-live]");
    var success = slot ? slot.querySelector("[data-success]") : null;
    var reset = success ? success.querySelector("[data-form-reset]") : null;

    form.addEventListener("invalid", function (event) {
      event.preventDefault();
      if (live) live.textContent = "Проверьте обязательные поля формы: имя и телефон.";
      event.target.focus();
    }, true);

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) return;
      if (live) live.textContent = "Заявка успешно отправлена.";
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.focus({ preventScroll: true });
      }
    });

    if (reset) {
      reset.addEventListener("click", function () {
        form.reset();
        if (success) success.hidden = true;
        form.hidden = false;
        var firstInput = form.querySelector("input:not([type=hidden])");
        if (firstInput) firstInput.focus();
      });
    }
  });
}());
