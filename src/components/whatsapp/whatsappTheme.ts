export interface WAThemeTokens {
  mode: "light" | "dark";
  appBarBg: string;
  appBarText: string;
  appBarSubtext: string;
  chatBg: string;
  doodlePattern: string;
  userBubbleBg: string;
  userBubbleText: string;
  botBubbleBg: string;
  botBubbleText: string;
  timestampText: string;
  readTickColor: string;
  voiceAccent: string;
  voiceUnplayed: string;
  inputBarBg: string;
  inputFieldBg: string;
  inputFieldText: string;
  inputPlaceholder: string;
  inputIconColor: string;
  quickChipBg: string;
  quickChipBorder: string;
  quickChipText: string;
  cardBorder: string;
  cardDivider: string;
  cardBtnText: string;
}

export const WA_LIGHT_THEME: WAThemeTokens = {
  mode: "light",
  appBarBg: "#008069",
  appBarText: "#FFFFFF",
  appBarSubtext: "#D1EBE5",
  chatBg: "#EFEAE2",
  doodlePattern: "radial-gradient(#C4B5A5 0.75px, transparent 0.75px)",
  userBubbleBg: "#D9FDD3",
  userBubbleText: "#111B21",
  botBubbleBg: "#FFFFFF",
  botBubbleText: "#111B21",
  timestampText: "#667781",
  readTickColor: "#53BDEB",
  voiceAccent: "#00A884",
  voiceUnplayed: "#8696A0",
  inputBarBg: "#F0F2F5",
  inputFieldBg: "#FFFFFF",
  inputFieldText: "#111B21",
  inputPlaceholder: "#8696A0",
  inputIconColor: "#54656F",
  quickChipBg: "#FFFFFF",
  quickChipBorder: "#D1D7DB",
  quickChipText: "#008069",
  cardBorder: "#E9EDEF",
  cardDivider: "#F0F2F5",
  cardBtnText: "#00A884",
};

export const WA_DARK_THEME: WAThemeTokens = {
  mode: "dark",
  appBarBg: "#1F2C34",
  appBarText: "#E9EDEF",
  appBarSubtext: "#8696A0",
  chatBg: "#0B141A",
  doodlePattern: "radial-gradient(#1F2C34 0.75px, transparent 0.75px)",
  userBubbleBg: "#005C4B",
  userBubbleText: "#E9EDEF",
  botBubbleBg: "#202C33",
  botBubbleText: "#E9EDEF",
  timestampText: "#8696A0",
  readTickColor: "#53BDEB",
  voiceAccent: "#00A884",
  voiceUnplayed: "#667781",
  inputBarBg: "#1F2C34",
  inputFieldBg: "#2A3942",
  inputFieldText: "#E9EDEF",
  inputPlaceholder: "#8696A0",
  inputIconColor: "#8696A0",
  quickChipBg: "#202C33",
  quickChipBorder: "#2A3942",
  quickChipText: "#25D366",
  cardBorder: "#2A3942",
  cardDivider: "#2A3942",
  cardBtnText: "#25D366",
};

/**
 * Returns an authentic SVG doodle background pattern tailored for WhatsApp chat backgrounds.
 */
export function getWhatsAppDoodlePattern(isDark: boolean): string {
  const strokeColor = isDark ? "%23FFFFFF" : "%23000000";
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240' viewBox='0 0 240 240'%3E%3Cg fill='none' stroke='${strokeColor}' stroke-width='1.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M30 40c15-15 30 15 45 0s30 15 45 0M170 70c0-12 20-12 20 0s-20 12-20 0zm-120 70 12-16 12 16-12 16zM95 110h22m-11-11v22M30 160c12 0 12 18 0 18s-12-18 0-18zM180 30c-12 6-14 20-3 26 8 5 18 0 18-8M140 180a15 15 0 1 0 30 0 15 15 0 1 0-30 0zm60-40h15v15h-15zM70 210c8-8 16 0 24-8s16 0 24-8'/%3E%3Cpath d='M130 35l10 10-10 10M20 90h15M210 170c0 10-15 15-20 5'/%3E%3Ccircle cx='60' cy='95' r='5'/%3E%3Ccircle cx='180' cy='205' r='6'/%3E%3C/g%3E%3C/svg%3E")`;
}
