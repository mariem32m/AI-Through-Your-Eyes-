import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shell, ModeNotice } from "../components/Layout";
import { Robot } from "../components/Robot";
import { useLang } from "../lib/i18n";
import { SURVEY_QUESTIONS, getQuestionByIndex } from "../lib/survey";
import { resolveSession, store } from "../lib/store";

const DRAFT_KEY = "ai-eyes:survey:draft:v1";

interface Draft {
  idx: number;
  answers: Record<string, string[]>;
  expectations: string;
}

function loadDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<Draft>;
      return { idx: p.idx ?? 0, answers: p.answers ?? {}, expectations: p.expectations ?? "" };
    }
  } catch {}
  return { idx: 0, answers: {}, expectations: "" };
}

function saveDraft(d: Draft) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(d)); } catch {}
}

function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
}

export function Questionnaire() {
  const { t, dir, pick } = useLang();
  const nav = useNavigate();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [expectations, setExpectations] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const d = loadDraft();
    setIdx(d.idx);
    setAnswers(d.answers);
    setExpectations(d.expectations);
  }, []);

  const q = useMemo(() => getQuestionByIndex(idx), [idx]);
  const total = SURVEY_QUESTIONS.length;
  const isLast = idx === total - 1;
  const pct = Math.round(((idx + 1) / (total + 1)) * 100);

  const persist = useCallback((next: Partial<Draft>) => {
    const d = { idx, answers, expectations, ...next };
    saveDraft(d);
    if (next.idx !== undefined) setIdx(next.idx);
    if (next.answers !== undefined) setAnswers(next.answers);
    if (next.expectations !== undefined) setExpectations(next.expectations);
  }, [idx, answers, expectations]);

  const toggle = useCallback((val: string) => {
    if (!q) return;
    setAnswers((prev) => {
      const key = q.key;
      const cur = prev[key] ?? [];
      let nextArr: string[];
      if (q.type === "single") nextArr = [val];
      else {
        nextArr = cur.includes(val) ? cur.filter((x) => x !== val) : [...cur, val];
      }
      const full = { ...prev, [key]: nextArr };
      saveDraft({ idx, answers: full, expectations });
      return full;
    });
  }, [q, idx, expectations]);

  const next = useCallback(() => {
    if (!isLast) persist({ idx: idx + 1 });
  }, [isLast, idx, persist]);

  const back = useCallback(() => {
    if (idx > 0) persist({ idx: idx - 1 });
  }, [idx, persist]);

  const submit = useCallback(async () => {
    if (submitting) return;
    setError(null);
    for (const qq of SURVEY_QUESTIONS) {
      if (!answers[qq.key] || answers[qq.key].length === 0) {
        setError("Please answer all questions before submitting.");
        return;
      }
    }
    if (expectations.trim().length === 0) {
      setError("Please tell us what you want to learn from the AI Track.");
      return;
    }
    if (expectations.trim().length > 500) {
      setError("Answer must be 500 characters or fewer.");
      return;
    }
    setSubmitting(true);
    try {
      const info = await resolveSession();
      await store.submitSurvey({
        session_id: info.session.id,
        nickname: "",
        question_1_answer: answers[SURVEY_QUESTIONS[0].key].join(","),
        question_2_answer: answers[SURVEY_QUESTIONS[1].key].join(","),
        question_3_answer: answers[SURVEY_QUESTIONS[2].key].join(","),
        question_4_answer: answers[SURVEY_QUESTIONS[3].key].join(","),
        question_5_answer: answers[SURVEY_QUESTIONS[4].key].join(","),
        ai_track_expectations: expectations.trim(),
      });
      clearDraft();
      nav("/thankyou");
    } catch (e) {
      setError("Something went wrong while saving. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [answers, expectations, submitting, nav]);

  return (
    <Shell showHome={true}>
      <ModeNotice />
      <section className="mx-auto max-w-3xl" dir={dir}>
        <div className="glass-card rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-extrabold tracking-wide text-violet-500">{t("community.name")}</div>
              <h1 className="mt-1 text-2xl font-extrabold text-slate-800 sm:text-3xl">{t("app.title")}</h1>
            </div>
            <Robot mood="idle" size={90} />
          </div>
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>{t("survey.progress")} {idx + 1} {t("survey.of")} {total}</span>
              <span>{pct}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-violet-50">
              <div className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
          {q && (
            <div className="mt-8 animate-fade-up">
              <div className="text-xs font-extrabold tracking-wide text-slate-400">{pick(q.title)}</div>
              <h2 className="mt-2 text-xl font-extrabold text-slate-800 sm:text-2xl">{pick(q.question)}</h2>
              <div className="mt-6 flex flex-col gap-3">
                {q.options.map((opt) => {
                  const key = q.key;
                  const selected = (answers[key] ?? []).includes(opt.value);
                  return (
                    <button key={opt.value} type="button" onClick={() => toggle(opt.value)} className={`text-left rounded-2xl border-2 p-4 font-bold transition ${selected ? "border-violet-500 bg-violet-50 text-violet-800 shadow" : "border-slate-200 bg-white text-slate-700 hover:border-violet-300"}`}>
                      {pick(opt.label)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {!isLast && (
            <div className="mt-10">
              <h2 className="text-xl font-extrabold text-slate-800">{t("survey.expectations.title")}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-600">{t("survey.expectations.desc")}</p>
              <textarea className="field min-h-28 mt-4" placeholder={t("survey.expectations.ph")} maxLength={500} value={expectations} onChange={(e) => persist({ expectations: e.target.value })} dir={dir} />
              <div className="mt-1 text-right text-xs font-bold text-slate-400">{expectations.length}/500</div>
            </div>
          )}
          {isLast && (
            <div className="mt-10">
              <h2 className="text-xl font-extrabold text-slate-800">{t("survey.expectations.title")}</h2>
              <p className="mt-2 text-sm font-semibold text-slate-600">{t("survey.expectations.q")}</p>
              <textarea className="field min-h-32 mt-4" placeholder={t("survey.expectations.ph")} maxLength={500} value={expectations} onChange={(e) => setExpectations(e.target.value)} dir={dir} />
              <div className="mt-1 text-right text-xs font-bold text-slate-400">{expectations.length}/500</div>
            </div>
          )}
          {error && <p className="toast-invalid mt-4 rounded-xl bg-rose-50 px-4 py-2 text-center text-sm font-bold text-rose-600">{error}</p>}
          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <button type="button" onClick={back} disabled={idx === 0} className="btn-base btn-secondary disabled:opacity-50">{t("survey.back")}</button>
            {!isLast ? (
              <button type="button" onClick={next} className="btn-base btn-spin">{t("survey.next")}</button>
            ) : (
              <button type="button" onClick={submit} disabled={submitting} className="btn-base btn-spin">{submitting ? "..." : t("survey.submit")}</button>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}