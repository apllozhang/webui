(() => {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.getElementById("primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const filter = document.querySelector("[data-category-filter]");
  if (filter) {
    filter.addEventListener("input", () => {
      const query = filter.value.trim().toLocaleLowerCase();
      document.querySelectorAll("[data-course-card]").forEach((card) => {
        card.hidden = Boolean(query) && !card.textContent.toLocaleLowerCase().includes(query);
      });
    });
  }

  const sidebar = document.querySelector("[data-sidebar]");
  if (sidebar && window.matchMedia("(max-width: 860px)").matches) {
    const heading = sidebar.querySelector(".sidebar-heading");
    if (heading) {
      heading.setAttribute("role", "button");
      heading.setAttribute("tabindex", "0");
      heading.setAttribute("aria-label", "展开或收起课程目录");
      const activate = () => sidebar.classList.toggle("collapsed");
      heading.addEventListener("click", activate);
      heading.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") activate();
      });
    }
  }
})();
