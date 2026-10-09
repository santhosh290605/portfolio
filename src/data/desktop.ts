export type DesktopApp = {
  id: string;
  label: string;
  glyph: string;
  type: "window" | "link";
  href?: string;
  row: number;
  col: number;
};

export const desktopApps: DesktopApp[] = [
  { id: "about", label: "About Me", glyph: "👤", type: "window", row: 0, col: 0 },
  { id: "wins", label: "Career Wins", glyph: "🏆", type: "window", row: 1, col: 0 },
  { id: "build", label: "Production", glyph: "⚙️", type: "window", row: 2, col: 0 },
  { id: "agents", label: "AI Agents", glyph: "🤖", type: "window", row: 3, col: 0 },
  { id: "projects", label: "Projects", glyph: "📁", type: "window", row: 0, col: 1 },
  { id: "leetcode", label: "LeetCode Quest", glyph: "🎮", type: "window", row: 1, col: 1 },
  { id: "contact", label: "Contact", glyph: "✉️", type: "window", row: 2, col: 1 },
  { id: "resume", label: "Resume.pdf", glyph: "📄", type: "link", href: "/resume.pdf", row: 3, col: 1 },
  { id: "games", label: "Games", glyph: "🕹️", type: "window", row: 0, col: 2 },
  { id: "terminal", label: "Terminal", glyph: "⌨️", type: "window", row: 1, col: 2 },
];

export const startMenuApps = desktopApps.filter((a) => a.type === "window");
