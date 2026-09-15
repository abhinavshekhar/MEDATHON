await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Medium" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });
await figma.loadFontAsync({ family: "Inter", style: "Bold" });

const page = figma.currentPage;
page.name = "MEDATHON — Improved UI";

let maxX = 0;
for (const child of page.children) {
  maxX = Math.max(maxX, child.x + child.width);
}

const colors = {
  bg: { r: 0.97, g: 0.98, b: 0.99 },
  sidebar: { r: 0.06, g: 0.09, b: 0.16 },
  sidebarHover: { r: 0.12, g: 0.16, b: 0.24 },
  primary: { r: 0.02, g: 0.59, b: 0.55 },
  card: { r: 1, g: 1, b: 1 },
  text: { r: 0.06, g: 0.09, b: 0.16 },
  muted: { r: 0.39, g: 0.45, b: 0.55 },
  border: { r: 0.89, g: 0.91, b: 0.94 },
  violet: { r: 0.49, g: 0.23, b: 0.93 },
  rose: { r: 0.94, g: 0.27, b: 0.37 },
  amber: { r: 0.96, g: 0.62, b: 0.04 },
};

function solid(c, a = 1) {
  return [{ type: "SOLID", color: { r: c.r, g: c.g, b: c.b }, opacity: a }];
}

function text(content, size, weight, color, name) {
  const t = figma.createText();
  t.fontName = { family: "Inter", style: weight };
  t.fontSize = size;
  t.fills = solid(color);
  t.characters = content;
  t.name = name;
  return t;
}

function auto(name, dir = "VERTICAL") {
  const f = figma.createAutoLayout();
  f.name = name;
  f.layoutMode = dir;
  f.primaryAxisAlignItems = "MIN";
  f.counterAxisAlignItems = "MIN";
  f.fills = [];
  return f;
}

const screen = auto("Dashboard — Improved", "HORIZONTAL");
screen.fills = solid(colors.bg);
screen.resize(1440, 900);
screen.x = maxX + 120;
screen.y = 0;
screen.clipsContent = true;

const sidebar = auto("Sidebar", "VERTICAL");
sidebar.resize(260, 900);
sidebar.layoutSizingVertical = "FILL";
sidebar.fills = solid(colors.sidebar);
sidebar.paddingTop = 24;
sidebar.paddingBottom = 24;
sidebar.paddingLeft = 16;
sidebar.paddingRight = 16;
sidebar.itemSpacing = 8;

const brandRow = auto("Brand", "HORIZONTAL");
brandRow.counterAxisAlignItems = "CENTER";
brandRow.itemSpacing = 12;
const logo = figma.createEllipse();
logo.resize(40, 40);
logo.fills = solid(colors.primary);
const brandText = auto("BrandText", "VERTICAL");
brandText.itemSpacing = 2;
brandText.appendChild(text("MEDATHON", 16, "Bold", { r: 1, g: 1, b: 1 }, "BrandName"));
brandText.appendChild(text("Smart Healthcare", 10, "Regular", { r: 0.58, g: 0.64, b: 0.72 }, "BrandSub"));
brandRow.appendChild(logo);
brandRow.appendChild(brandText);
sidebar.appendChild(brandRow);

const dashNav = auto("NavItem-Active", "HORIZONTAL");
dashNav.counterAxisAlignItems = "CENTER";
dashNav.paddingTop = 10;
dashNav.paddingBottom = 10;
dashNav.paddingLeft = 12;
dashNav.paddingRight = 12;
dashNav.cornerRadius = 12;
dashNav.fills = [{ type: "SOLID", color: colors.primary, opacity: 0.18 }];
dashNav.appendChild(text("Dashboard", 13, "Medium", { r: 0.4, g: 0.85, b: 0.82 }, "NavLabel"));
sidebar.appendChild(dashNav);

for (const item of ["Patient Registration", "Patient Records", "Digital Twin", "Pharmacy", "Lab"]) {
  const nav = auto(`Nav-${item}`, "HORIZONTAL");
  nav.counterAxisAlignItems = "CENTER";
  nav.paddingTop = 10;
  nav.paddingBottom = 10;
  nav.paddingLeft = 12;
  nav.paddingRight = 12;
  nav.cornerRadius = 12;
  nav.appendChild(text(item, 13, "Regular", { r: 0.58, g: 0.64, b: 0.72 }, "NavLabel"));
  sidebar.appendChild(nav);
}

const kioskCard = auto("KioskStatus", "VERTICAL");
kioskCard.paddingTop = 14;
kioskCard.paddingBottom = 14;
kioskCard.paddingLeft = 14;
kioskCard.paddingRight = 14;
kioskCard.cornerRadius = 14;
kioskCard.fills = solid(colors.sidebarHover);
kioskCard.itemSpacing = 6;
kioskCard.appendChild(text("Kiosk Status", 11, "Medium", { r: 0.8, g: 0.84, b: 0.88 }, "KioskTitle"));
kioskCard.appendChild(text("Reception Online", 10, "Regular", { r: 0.4, g: 0.85, b: 0.55 }, "KioskValue"));
sidebar.appendChild(kioskCard);

const main = auto("Main", "VERTICAL");
main.layoutSizingHorizontal = "FILL";
main.layoutSizingVertical = "FILL";
main.itemSpacing = 0;
main.fills = solid(colors.bg);

const header = auto("Header", "HORIZONTAL");
header.layoutSizingHorizontal = "FILL";
header.counterAxisAlignItems = "CENTER";
header.primaryAxisAlignItems = "SPACE_BETWEEN";
header.paddingTop = 16;
header.paddingBottom = 16;
header.paddingLeft = 28;
header.paddingRight = 28;
header.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity: 0.9 }];
header.strokes = solid(colors.border);
header.strokeWeight = 1;
header.strokeAlign = "INSIDE";
const headerLeft = auto("HeaderLeft", "VERTICAL");
headerLeft.itemSpacing = 2;
headerLeft.appendChild(text("Dashboard", 14, "Semi Bold", colors.text, "PageTitle"));
headerLeft.appendChild(text("Primary Care Clinic", 10, "Regular", colors.muted, "PageSub"));
header.appendChild(headerLeft);
const avatar = figma.createEllipse();
avatar.resize(32, 32);
avatar.fills = solid(colors.primary);
header.appendChild(avatar);
main.appendChild(header);

const content = auto("Content", "VERTICAL");
content.layoutSizingHorizontal = "FILL";
content.paddingTop = 28;
content.paddingBottom = 28;
content.paddingLeft = 28;
content.paddingRight = 28;
content.itemSpacing = 24;

const heroRow = auto("HeroRow", "HORIZONTAL");
heroRow.layoutSizingHorizontal = "FILL";
heroRow.primaryAxisAlignItems = "SPACE_BETWEEN";
heroRow.counterAxisAlignItems = "CENTER";
const heroText = auto("HeroText", "VERTICAL");
heroText.itemSpacing = 4;
heroText.appendChild(text("Good evening", 28, "Bold", colors.text, "Greeting"));
heroText.appendChild(text("Sunday, 6 September 2026", 13, "Regular", colors.muted, "Date"));
heroRow.appendChild(heroText);
const cta = auto("CTA", "HORIZONTAL");
cta.counterAxisAlignItems = "CENTER";
cta.paddingTop = 12;
cta.paddingBottom = 12;
cta.paddingLeft = 18;
cta.paddingRight = 18;
cta.cornerRadius = 12;
cta.fills = solid(colors.primary);
cta.appendChild(text("New Patient", 13, "Semi Bold", { r: 1, g: 1, b: 1 }, "CTALabel"));
heroRow.appendChild(cta);
content.appendChild(heroRow);

const statsRow = auto("Stats", "HORIZONTAL");
statsRow.layoutSizingHorizontal = "FILL";
statsRow.itemSpacing = 16;
const statData = [
  { label: "Today's OPD", value: "12", sub: "Registrations today", accent: colors.primary },
  { label: "Total Patients", value: "248", sub: "In system", accent: colors.violet },
  { label: "Lab Pending", value: "7", sub: "Samples in queue", accent: colors.amber },
  { label: "Kiosk Vitals", value: "34", sub: "Readings today", accent: colors.rose },
];
for (const s of statData) {
  const card = auto(`Stat-${s.label}`, "VERTICAL");
  card.layoutSizingHorizontal = "FILL";
  card.paddingTop = 20;
  card.paddingBottom = 20;
  card.paddingLeft = 20;
  card.paddingRight = 20;
  card.cornerRadius = 16;
  card.fills = solid(colors.card);
  card.strokes = solid(colors.border);
  card.strokeWeight = 1;
  card.itemSpacing = 8;
  card.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.04 }, offset: { x: 0, y: 4 }, radius: 16, spread: 0, visible: true, blendMode: "NORMAL" }];
  card.appendChild(text(s.label, 12, "Medium", colors.muted, "StatLabel"));
  card.appendChild(text(s.value, 32, "Bold", colors.text, "StatValue"));
  card.appendChild(text(s.sub, 11, "Regular", colors.muted, "StatSub"));
  statsRow.appendChild(card);
}
content.appendChild(statsRow);

const grid = auto("Grid", "HORIZONTAL");
grid.layoutSizingHorizontal = "FILL";
grid.itemSpacing = 20;
for (const panel of ["Recent Registrations", "Today's OPD Queue"]) {
  const panelCard = auto(panel, "VERTICAL");
  panelCard.layoutSizingHorizontal = "FILL";
  panelCard.paddingTop = 20;
  panelCard.paddingBottom = 20;
  panelCard.paddingLeft = 20;
  panelCard.paddingRight = 20;
  panelCard.cornerRadius = 16;
  panelCard.fills = solid(colors.card);
  panelCard.strokes = solid(colors.border);
  panelCard.strokeWeight = 1;
  panelCard.itemSpacing = 14;
  panelCard.appendChild(text(panel, 16, "Semi Bold", colors.text, "PanelTitle"));
  panelCard.appendChild(text("Patient row with status badge", 12, "Regular", colors.muted, "PanelBody"));
  grid.appendChild(panelCard);
}
content.appendChild(grid);

const banner = auto("Banner", "HORIZONTAL");
banner.layoutSizingHorizontal = "FILL";
banner.paddingTop = 24;
banner.paddingBottom = 24;
banner.paddingLeft = 24;
banner.paddingRight = 24;
banner.cornerRadius = 16;
banner.fills = [{ type: "GRADIENT_LINEAR", gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: [
  { position: 0, color: { r: 0.02, g: 0.59, b: 0.55, a: 1 } },
  { position: 0.5, color: { r: 0.05, g: 0.45, b: 0.9, a: 1 } },
  { position: 1, color: { r: 0.49, g: 0.23, b: 0.93, a: 1 } },
]}];
const bannerText = auto("BannerText", "VERTICAL");
bannerText.itemSpacing = 4;
bannerText.appendChild(text("Cyber-Physical Healthcare System", 15, "Semi Bold", { r: 1, g: 1, b: 1 }, "BannerTitle"));
bannerText.appendChild(text("Register, Kiosk vitals, Digital Twin, AI radiology", 12, "Regular", { r: 1, g: 1, b: 1 }, "BannerSub"));
banner.appendChild(bannerText);
content.appendChild(banner);

main.appendChild(content);
screen.appendChild(sidebar);
screen.appendChild(main);
page.appendChild(screen);

return { success: true, screenId: screen.id, screenName: screen.name };
