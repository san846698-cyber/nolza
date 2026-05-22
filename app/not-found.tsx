import Link from "next/link";

export default function NotFound() {
  return (
    <main className="trust-page">
      <div className="trust-shell">
        <div className="trust-topbar">
          <Link className="trust-back" href="/">
            ← Back to nolza.fun
          </Link>
        </div>
        <header className="trust-hero">
          <p>404</p>
          <h1>페이지를 찾을 수 없어요</h1>
          <span>
            요청한 주소가 바뀌었거나 더 이상 제공되지 않는 페이지일 수 있습니다.
            놀자.fun의 테스트와 미니게임은 아래 링크에서 다시 찾아볼 수 있습니다.
          </span>
        </header>

        <div className="trust-card">
          <section className="trust-section">
            <h2>다음으로 이동해보세요</h2>
            <ul>
              <li>
                <Link href="/">홈에서 인기 테스트 보기</Link>
              </li>
              <li>
                <Link href="/about">놀자.fun 소개 읽기</Link>
              </li>
              <li>
                <Link href="/contact">오류나 깨진 링크 제보하기</Link>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
