import { useState } from "react";
import { post } from "../shared/api";
import { FIELD_LABEL } from "./common";

// request-info 는 Swagger 에 노출되지 않는 보조 API 입니다.
const FIELDS = [
  "department",
  "admission_year",
  "student_status",
  "major_track",
  "target_term",
  "as_of",
];

export default function SupplementRequest({ inquiryId, missing, onDone }) {
  const [fields, setFields] = useState(() =>
    FIELDS.filter((f) => missing.includes(f)),
  );
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const toggle = (f) =>
    setFields((list) =>
      list.includes(f) ? list.filter((v) => v !== f) : [...list, f],
    );

  async function send() {
    if (busy) return;
    if (!message.trim()) {
      setError("학생에게 보낼 요청 문구를 입력해 주세요.");
      return;
    }
    if (!fields.length) {
      setError("보완받을 항목을 하나 이상 선택해 주세요.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      onDone(
        await post(`/inquiries/${inquiryId}/request-info`, {
          message: message.trim(),
          fields,
        }),
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="staff-note"
      style={{ marginTop: 12, background: "var(--surface)" }}
    >
      <strong>정보 보완 요청</strong>
      {error && (
        <p className="staff-error" style={{ margin: "8px 0 0" }}>
          {error}
        </p>
      )}
      <div className="staff-choices" style={{ marginTop: 10 }}>
        {FIELDS.map((f) => (
          <button
            key={f}
            type="button"
            className="staff-choice"
            aria-pressed={fields.includes(f)}
            onClick={() => toggle(f)}
          >
            {FIELD_LABEL[f] || f}
          </button>
        ))}
      </div>
      <label className="staff-field">
        <span>요청 문구</span>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="예: 입학연도와 전공 구분을 알려 주세요."
        />
      </label>
      <div className="staff-button-row" style={{ marginTop: 12 }}>
        <button type="button" className="staff-action" disabled={busy} onClick={send}>
          {busy ? "보내는 중" : "보완 요청 보내기"}
        </button>
      </div>
      <p className="staff-hint">
        학생 화면에 요청이 표시됩니다. 메일이나 문자는 발송되지 않습니다.
      </p>
    </div>
  );
}
