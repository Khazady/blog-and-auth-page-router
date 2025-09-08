import Link from "next/link";
import { useRouter } from "next/router";

export default function LanguageSwitcher() {
  const { locale = "en", asPath } = useRouter();
  const nextLocale = locale === "en" ? "ru" : "en";

  return (
    <Link href={asPath} locale={nextLocale}>
      {locale.toUpperCase()}
    </Link>
  );
}
