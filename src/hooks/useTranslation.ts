import { useLanguageVoice, type SupportedLanguage } from "../context/LanguageVoiceContext";
import { UI_CONTENT, type PageContent } from "../data/uiContent";

export function useTranslation(): { t: PageContent; language: SupportedLanguage } {
  const { language } = useLanguageVoice();
  const t = UI_CONTENT[language] || UI_CONTENT.en;
  return { t, language };
}
