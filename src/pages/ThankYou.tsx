import { Link } from "react-router-dom";
import { Shell, ModeNotice } from "../components/Layout";
import { Robot } from "../components/Robot";
import { useLang } from "../lib/i18n";
import { celebrateConfetti } from "../lib/confetti";
import { useEffect } from "react";

export function ThankYou() {
  const { t, dir } = useLang();
  useEffect(() => {
    celebrateConfetti();
  }, []);
  return (
    <Shell>
      <ModeNotice />
      <section className="mx-auto max-w-2xl text-center animate-fade-up" dir={dir}>
        <div className="flex justify-center"><Robot mood="happy" size={140} /></div>
        <h1 className="mt-6 text-3xl font-extrabold text-gradient sm:text-4xl">{t("thankyou.title")}</h1>
        <p className="mt-4 text-lg font-semibold text-slate-600">{t("thankyou.body")}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-base btn-spin">{t("back.home")}</Link>
          <Link to="/dashboard" className="btn-base btn-secondary">📊 {t("host.title")}</Link>
        </div>
      </section>
    </Shell>
  );
}