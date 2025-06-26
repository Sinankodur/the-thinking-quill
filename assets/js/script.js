document.addEventListener("DOMContentLoaded", function () {
  // Handle dynamic base tag for GitHub Pages
  const base = document.getElementById("dynamic-base");
  if (base) {
    const isGitHub = window.location.hostname.includes("github.io");
    base.setAttribute("href", isGitHub ? "/the-thinking-quill/" : "/");
  }

  // Restore previous theme (from session storage)
  const isDarkSession = sessionStorage.getItem("previous-theme") === "dark";
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedDarkMode = localStorage.getItem("darkMode");

  const toggleInput = document.getElementById("toggleDark");
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");

  const enableDark = () => {
    document.documentElement.classList.add("dark");
    if (toggleInput) toggleInput.checked = true;
  };

  const disableDark = () => {
    document.documentElement.classList.remove("dark");
    if (toggleInput) toggleInput.checked = false;
  };

  if (
    savedDarkMode === "true" ||
    (!savedDarkMode && prefersDark) ||
    isDarkSession
  ) {
    enableDark();
  } else {
    disableDark();
  }

  const updateIcons = () => {
    if (!sunIcon || !moonIcon) return;
    const isDark = document.documentElement.classList.contains("dark");
    sunIcon.classList.toggle("hidden", isDark);
    moonIcon.classList.toggle("hidden", !isDark);
  };

  updateIcons();

  if (toggleInput) {
    toggleInput.addEventListener("change", () => {
      document.documentElement.classList.toggle("dark");
      updateIcons();
      localStorage.setItem(
        "darkMode",
        document.documentElement.classList.contains("dark")
      );
    });
  }

  // Save current mode before page unload
  window.addEventListener("beforeunload", () => {
    const isDark = document.documentElement.classList.contains("dark");
    sessionStorage.setItem("previous-theme", isDark ? "dark" : "light");
  });

  // Read time estimator
  document.querySelectorAll("article[data-read-time]").forEach((article) => {
    const text = article.innerText || "";
    const wordCount = text.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.round(wordCount / 100));
    const target = article.querySelector("[data-read-time-target]");
    if (target) {
      target.textContent = `${readTime} min read`;
    }
  });

  // Subscribe form handling (if present)
  const form = document.getElementById("subscribeForm");
  const message = document.getElementById("formMessage");
  if (form && message) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      try {
        const res = await fetch("https://formspree.io/f/movwpdjo", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });

        if (res.ok) {
          form.reset();
          message.classList.remove("hidden");
          message.classList.add("block");
          message.textContent = "Thanks for subscribing!";
        } else {
          message.textContent = "Something went wrong. Please try again later.";
          message.classList.remove("hidden");
          message.classList.add("text-red-600", "block");
        }
      } catch (error) {
        message.textContent =
          "An error occurred. Please check your connection.";
        message.classList.remove("hidden");
        message.classList.add("text-red-600", "block");
      }
    });
  }
});
