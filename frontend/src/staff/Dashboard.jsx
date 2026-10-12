import InquiryRow from "./InquiryRow";
import { seoulDate, summarize, todayLabel, todaySeoul, dateTime } from "./common";

export default function Dashboard({ items, loading, onOpen, onReload, onPhone }) {
  const today = todaySeoul();
  // 미처리는 completed·waiting_student 를 제외한 전체.
  const pending = items
    .filter((i) => i.status !== "completed" && i.status !== "waiting_student")
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  const waiting = items.filter((i) => i.status === "waiting_student");
  const doneToday = items.filter(
    (i) => i.status === "completed" && seoulDate(i.completed_at) === today,
  );
  const newToday = items.filter((i) => seoulDate(i.created_at) === today);
  const recent = items
    .filter((i) => i.status === "completed" && i.completed_at)
    .sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at))
    .slice(0, 5);

  const counts = [
    ["미처리", pending.length],
    ["학생 보완 대기", waiting.length],
    ["오늘 답변 완료", doneToday.length],
    ["오늘 접수", newToday.length],
  ];

  return (
    <>
      <div className="staff-page-top">
        <div>
          <h1 className="staff-title">대시보드</h1>
          <p className="staff-today">{todayLabel()}</p>
        </div>
        <button type="button" className="staff-action" onClick={onPhone}>
          전화 문의 접수
        </button>
      </div>

      <dl className="staff-summary">
        {counts.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd className={value === 0 ? "zero" : ""}>{value}</dd>
          </div>
        ))}
      </dl>

      <div className="staff-split">
        <section className="staff-panel">
          <div className="staff-panel-head">
            <h2>답변을 기다리는 문의</h2>
            <span className="staff-count">{pending.length}건</span>
            <button type="button" className="staff-text-button" onClick={onReload}>
              새로고침
            </button>
          </div>
          {loading && !items.length ? (
            <p className="staff-loading" style={{ padding: "20px 18px" }}>
              불러오는 중입니다.
            </p>
          ) : pending.length ? (
            <ul className="staff-rows">
              {pending.map((item) => (
                <InquiryRow key={item.inquiry_id} item={item} onOpen={onOpen} />
              ))}
            </ul>
          ) : (
            <p className="staff-empty">답변을 기다리는 문의가 없습니다.</p>
          )}
        </section>

        <section className="staff-panel">
          <div className="staff-panel-head">
            <h2>최근 등록한 답변</h2>
          </div>
          {recent.length ? (
            <ul className="staff-recent">
              {recent.map((item) => (
                <li key={item.inquiry_id}>
                  <div className="staff-recent-time">
                    {dateTime(item.completed_at)}
                  </div>
                  <p className="staff-recent-q">{summarize(item.question, 48)}</p>
                  <p className="staff-recent-a">
                    {summarize(item.final_answer, 110)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="staff-empty">등록한 답변이 아직 없습니다.</p>
          )}
        </section>
      </div>
    </>
  );
}
