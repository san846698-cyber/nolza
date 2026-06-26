// LazyMotion 비동기 feature 번들 — domAnimation 을 별도 청크로 분리해 초기 JS 를 가볍게 유지.
// (전역 Provider 라도 이 ~17KB 청크는 비차단 async 로 로드된다.)
import { domAnimation } from "framer-motion";

export default domAnimation;
