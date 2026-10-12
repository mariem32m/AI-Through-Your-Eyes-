import { useEffect, useState } from "react";
import { Shell, ModeNotice } from "../components/Layout";
import { useLang } from "../lib/i18n";
import { resolveSession, store } from "../lib/store";

interface Survey {
  id: string;
  created_at: string;
  nickname: string;
  question_1_answer: string;
  question_2_answer: string;
  question_3_answer: string;
  question_4_answer: string;
  question_5_answer: string;
  ai_track_expectations: string;
}

export function Dashboard() {
  const { t, dir } = useLang();
  const [items, setItems] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let c = false;
    (async () => {
      try {
        const info = await resolveSession();
        const data = await store.listSurveys(info.session.id);
        if (!c) setItems(data as any);
      } catch (e) {
        if (!c) setErr("Failed to load responses");
      } finally {
        if (!c) setLoading(false);
      }
    })();
    return () => { c = true; };
  }, []);

  const total = items.length;
  // aggregates kept for future UI use if needed; removed unused vars to satisfy build

  const exportCSV = () => {
    const header = ["id","created_at","nickname","q1","q2","q3","q4","q5","expectations"];
    const rows = items.map(i => [i.id, i.created_at, i.nickname, i.question_1_answer, i.question_2_answer, i.question_3_answer, i.question_4_answer, i.question_5_answer, i.ai_track_expectations.replace(/\n/g,' ')]);
    const csv = [header.join(','), ...rows.map(r=>r.map(x=>`"${(x||'').toString().replace(/"/g,'""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'ai-through-your-eyes.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <Shell>
      <ModeNotice />
      <section className="mx-auto max-w-6xl" dir={dir}>
        <div className="flex flex-wrap items-center justify-between">
          <h1 className="text-3xl font-extrabold">{t("host.title")} — {t("app.title")}</h1>
          <button className="btn-base btn-secondary" onClick={exportCSV} disabled={items.length===0}>Export CSV</button>
        </div>
        {loading && <p className="mt-6">Loading...</p>}
        {err && <p className="mt-6 text-rose-600">{err}</p>}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="glass-card p-5"><div className="text-sm font-bold text-slate-500">Total Submissions</div><div className="mt-1 text-4xl font-extrabold">{total}</div></div>
        </div>
        <div className="mt-8 space-y-6">
          {items.map((i) => (
            <div key={i.id} className="glass-card rounded-2xl p-5">
              <div className="text-xs text-slate-400">{new Date(i.created_at).toLocaleString()}</div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div><strong>Q1:</strong> {i.question_1_answer}</div>
                <div><strong>Q2:</strong> {i.question_2_answer}</div>
                <div><strong>Q3:</strong> {i.question_3_answer}</div>
                <div><strong>Q4:</strong> {i.question_4_answer}</div>
                <div><strong>Q5:</strong> {i.question_5_answer}</div>
              </div>
              <div className="mt-3 rounded-xl bg-violet-50 p-3"><strong>Expectations:</strong><div dir={dir} className="whitespace-pre-wrap">{i.ai_track_expectations}</div></div>
            </div>
          ))}
          {items.length===0 && !loading && <p className="text-slate-500">No responses yet.</p>}
        </div>
      </section>
    </Shell>
  );
}