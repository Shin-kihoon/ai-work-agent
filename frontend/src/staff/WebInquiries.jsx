import { useState } from "react";
import InquiryRow from "./InquiryRow";

const TABS = [
  { id: "open", name: "답변 대기" },
  { id: "waiting", name: "학생 보완 대기" },
  { id: "done", name: "답변 완료" },
];
// 완료한 문의는 삭제하지 않고 완료 탭으로 옮긴다.
const bucket = (status) =>
  status === "completed"
    ? "done"
    : status === "waiting_student"
      ? "waiting"
      : "open";

export default function WebInquiries({ items, loading, onOpen, onReload }) {
  const [tab, setTab] = useState("open");
  const web = items.filter((i) => i.channel === "web");
  const grouped = { open: [], waiting: [], done: [] };
  web.forEach((i) => grouped[bucket(i.status)].push(i));
  grouped.open.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  grouped.waiting.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  grouped.done.sort(
    (a, b) => new Date(b.completed_at || b.updated_at) - new Date(a.completed_at || a.updated_at),
  );
  const rows = grouped[tab];

  return (
    <>
      <div className="staff-page-top">
        <div>
          <h1 className="staff-title">웹 문의</h1>
          <p className="staff-today">학생이 직접 접수한 문의입니다.</p>
        </div>
        <button type="button" className="staff-action ghost" onClick={onReload}>
          새로고침
        </button>
      </div>

      <div className="staff-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.name}
            <span className="staff-count">{grouped[t.id].length}</span>
          </button>
        ))}
      </div>

      <section className="staff-panel" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        {loading && !items.length ? (
          <p className="staff-loading" style={{ padding: "20px 18px" }}>
            불러오는 중입니다.
          </p>
        ) : rows.length ? (
          <ul className="staff-rows">
            {rows.map((item) => (
              <InquiryRow key={item.inquiry_id} item={item} onOpen={onOpen} />
            ))}
          </ul>
        ) : (
          <p className="staff-empty">해당하는 문의가 없습니다.</p>
        )}
      </section>
    </>
  );
}
