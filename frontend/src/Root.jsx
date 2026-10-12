import { useEffect, useState } from "react";
import { request } from "./shared/api";
import StaffApp from "./staff/StaffApp";
import StudentApp from "./student/StudentApp";

// /auth/me 의 role 로 화면을 고른다. 역할을 임의로 선택하지 않는다.
export default function Root() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    request("/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setReady(true));
  }, []);

  if (!ready) return null;
  if (user?.role === "staff")
    return <StaffApp user={user} onSignOut={() => setUser(null)} />;
  return <StudentApp onAuthChange={setUser} />;
}
