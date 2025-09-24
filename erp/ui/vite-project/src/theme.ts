export type Theme = "light" | "dark";

export function setTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
}

export function getTheme(): Theme {
  return (localStorage.getItem("theme") as Theme | null) ?? "light";
}
