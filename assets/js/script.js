tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#2C3639",
        accent: "#5F7A71",
        parchment: "#F8F5F0",
        darkParchment: "#1C1A16",
        secondary: "#8B5D33",
        subtle: "#D1C6AD",
      },
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Crimson Text", "serif"],
      },
    },
  },
};

window.addEventListener("beforeunload", () => {
  const isDark = document.documentElement.classList.contains("dark");
  sessionStorage.setItem("previous-theme", isDark ? "dark" : "light");
});

document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.classList.add("js-loaded");
  const toggleInput = document.getElementById("toggleDark");
  const sunIcon = document.getElementById("sunIcon");
  const moonIcon = document.getElementById("moonIcon");

  function updateIcons() {
    const isDark = document.documentElement.classList.contains("dark");
    sunIcon.classList.toggle("hidden", isDark);
    moonIcon.classList.toggle("hidden", !isDark);
  }

  toggleInput.addEventListener("change", () => {
    document.documentElement.classList.toggle("dark");
    updateIcons();
    localStorage.setItem(
      "darkMode",
      document.documentElement.classList.contains("dark")
    );
  });

  const savedDarkMode = localStorage.getItem("darkMode");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedDarkMode === "true" || (savedDarkMode === null && prefersDark)) {
    document.documentElement.classList.add("dark");
    toggleInput.checked = true;
  }

  updateIcons();

  if ("#subscribeForm") {
    const form = document.getElementById("subscribeForm");
    const message = document.getElementById("formMessage");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);

      try {
        const res = await fetch("https://formspree.io/f/movwpdjo", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        if (res.ok) {
          form.reset();
          message.classList.remove("hidden");
          message.classList.add("block");
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
