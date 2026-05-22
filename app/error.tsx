"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  reset: () => void;
}) {
  return (
    <main className="trust-page">
      <div className="trust-shell">
        <div className="trust-topbar">
          <Link className="trust-back" href="/">
            ← Back to nolza.fun
          </Link>
        </div>
        <header className="trust-hero">
          <p>Error</p>
          <h1>페이지를 불러오지 못했어요</h1>
          <span>
            일시적인 문제로 테스트 화면을 표시하지 못했습니다. 새로 시도하거나 홈에서 다른 콘텐츠를
            선택해보세요.
          </span>
        </header>

        <div className="trust-card">
          <section className="trust-section">
            <h2>다시 시도하기</h2>
            <p>문제가 반복되면 문의 페이지로 알려주시면 깨진 화면을 확인하겠습니다.</p>
            <div className="trust-actions">
              <button type="button" onClick={reset}>
                다시 시도
              </button>
              <Link href="/">홈으로 이동</Link>
              <Link href="/contact">문의하기</Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
