import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { Globe } from "lucide-react";

export default function LanguageToggle() {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-light-grey hover:text-bright-blue"
      title={t('language.toggle', 'Toggle Language')}
    >
      <Globe size={16} />
      <span className="font-mono text-xs uppercase">{i18n.language}</span>
    </Button>
  );
}
