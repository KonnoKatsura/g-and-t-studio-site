(() => {
  const address = `${["singasong", "piyo8"].join("")}@${["gmail", "com"].join(".")}`;
  const subject = "G&T Studio ご相談";

  document.querySelectorAll("[data-contact-mail]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = `mailto:${address}?subject=${encodeURIComponent(subject)}`;
    });
  });
})();
