import { useRouter } from "next/router";

export default function LanguageSwitcher() {
  const router = useRouter();
  const { locale, asPath } = router;

  function toggleLanguage() {
    const nextLocale = locale === "en" ? "ru" : "en";
    router.push(asPath, asPath, { locale: nextLocale });
  }

  return (
    <button onClick={toggleLanguage}>
      {locale === "en" ? "RU" : "EN"}
    </button>
  );
}
