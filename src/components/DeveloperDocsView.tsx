import React from "react";
import { BookOpen, Database, Cpu, Layout, FileJson } from "lucide-react";

export default function DeveloperDocsView() {
  return (
    <div className="space-y-8 bg-white border border-stone-200 text-stone-850 p-6 rounded-2xl shadow-xs max-w-5xl mx-auto break-keep" id="developer-docs-view">
      {/* Header */}
      <div className="border-b border-stone-150 pb-5">
        <h2 className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-[#2E5A36]" />
          ScentWeave™ 시스템 기획 및 아키텍처 명세서
        </h2>
        <p className="text-stone-600 text-xs md:text-sm mt-1 font-semibold font-sans">
          개인 맞춤형 향수 레이어링 조합 검색 및 AI 추천 플랫폼의 테크니컬 바인딩 사양
        </p>
      </div>

      {/* SECTION 1 */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#2E5A36] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#2E5A36]" />
          1. System Architecture & Tech Stack
        </h3>
        <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-semibold font-sans">
          ScentWeave는 사용자 중심의 빠른 인터랙션과 실시간 AI 조향 피드백을 제공하기 위해 **Full-Stack (Vite SPA + Express + Gemini AI)** 토폴로지를 채택했습니다. 
          클라우드 배포 및 확장에 유연하며 오프라인 최적화 룰셋을 병행 보증합니다.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 shadow-xs">
            <h4 className="text-xs font-bold text-stone-900 mb-1">Frontend Layer</h4>
            <p className="text-[10px] text-[#2E5A36] font-bold">React 19, TypeScript, Vite</p>
            <p className="text-[11px] text-stone-600 mt-2 font-medium">안정적인 컴포넌트 생명주기와 빠른 렌더링, SPA 최적 반응형</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 shadow-xs">
            <h4 className="text-xs font-bold text-stone-900 mb-1">Styling & Motion</h4>
            <p className="text-[10px] text-[#2E5A36] font-bold">Tailwind CSS v4, Motion</p>
            <p className="text-[11px] text-stone-600 mt-2 font-medium">럭셔리한 니치 부티크 브랜드 감성의 미니멀 그리드 및 물결 트랜지션 애니메이션</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 shadow-xs">
            <h4 className="text-xs font-bold text-stone-900 mb-1">Backend Controller</h4>
            <p className="text-[10px] text-[#2E5A36] font-bold font-sans">Express Server (NodeJS)</p>
            <p className="text-[11px] text-stone-600 mt-2 font-medium">API 라우팅, 로컬 가중치 가공 및 AI SDK 대리 미들웨어 프록시</p>
          </div>
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 shadow-xs">
            <h4 className="text-xs font-bold text-stone-900 mb-1">AI Cognitive Engine</h4>
            <p className="text-[10px] text-[#2E5A36] font-bold font-sans">@google/genai SDK</p>
            <p className="text-[11px] text-stone-600 mt-2 font-medium">Gemini 3.5 Flash 모델 기반 기하학적 향기 노트 융합 및 구매 유효 계산</p>
          </div>
        </div>
      </div>

      {/* SECTION 2 */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#2E5A36] flex items-center gap-2">
          <Database className="w-4 h-4 text-[#2E5A36]" />
          2. Data Modeling & Database Schema (RDB/NoSQL 설계)
        </h3>
        <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-semibold font-sans">
          프로덕션 전개 및 정합성을 극대화하기 위해 설계한 관계형 ERD 모델 구조입니다. Firestore NoSQL 구조로 마이그레이션 할 시에도 Collection - Sub-document 형태로 맵핑이 매끄럽도록 정규화 규격을 고수합니다.
        </p>

        <div className="bg-stone-900 text-stone-100 p-5 rounded-xl border border-stone-850 font-mono text-[11px] overflow-x-auto space-y-4 shadow-sm">
          <div>
            <span className="text-emerald-400 font-extrabold">1. Table [User] (회원 가입 마스터)</span>
            <pre className="text-stone-300 mt-1 whitespace-pre-wrap leading-relaxed">
{`{
  id: VARCHAR(64) [PK, NOT NULL],  // 사용자 고유 식별값
  name: VARCHAR(50),                // 사용자 실명 혹은 닉네임
  email: VARCHAR(100) [UNIQUE],     // 계정 이메일
  scentPreference: VARCHAR[]        // 선호 향조 키워드 집합 (ex. ['Woody', 'Musk'])
}`}
            </pre>
          </div>
          
          <div>
            <span className="text-emerald-400 font-extrabold">2. Table [Perfume] (향수 가이드 메타 테이블)</span>
            <pre className="text-stone-300 mt-1 whitespace-pre-wrap leading-relaxed">
{`{
  id: VARCHAR(64) [PK],             // 향수 마스터 일련번호
  brand: VARCHAR(50) [INDEX],       // 향수 하우스 브랜드 (ex. Chanel, Diptyque)
  name: VARCHAR(100),               // 제품 정식 명칭 (ex. 1957, Philosykos)
  scentFamily: VARCHAR[] [NOT NULL],// 지배적 향조 계열 (ex. ['Woody', 'Fig'])
  topNotes: VARCHAR[],              // 첫 인상 탑노트 리스트
  middleNotes: VARCHAR[],           // 중심 심장 미들노트 리스트
  baseNotes: VARCHAR[],             // 여운 잔향 베이스노트 리스트
  season: VARCHAR[],                // 추천 계절 배열 (ex. ['봄', '여름'])
  gender: ENUM('Unisex', 'Men', 'Women'),
  imageUrl: VARCHAR(255),
  description: TEXT                 // 향의 스토리 시놉시스
}`}
            </pre>
          </div>

          <div>
            <span className="text-emerald-400 font-extrabold">3. Table [User_Library] (내 옷장 / 보유 리스트)</span>
            <pre className="text-stone-300 mt-1 whitespace-pre-wrap leading-relaxed">
{`{
  id: VARCHAR(64) [PK],
  userId: VARCHAR(64) [FK -> User.id],
  perfumeId: VARCHAR(64) [FK -> Perfume.id],
  addedAt: TIMESTAMP [DEFAULT NOW],
  notes: VARCHAR(255)               // 개인의 보관 형태 및 착향 메모
}`}
            </pre>
          </div>

          <div>
            <span className="text-emerald-400 font-extrabold">4. Table [Favorites] (레이어링 조합 즐겨찾기)</span>
            <pre className="text-stone-300 mt-1 whitespace-pre-wrap leading-relaxed">
{`{
  id: VARCHAR(64) [PK],
  userId: VARCHAR(64) [FK -> User.id],
  perfumeId1: VARCHAR(64) [FK -> Perfume.id],  // 조합 축 1
  perfumeId2: VARCHAR(64) [FK -> Perfume.id],  // 조합 축 2
  name: VARCHAR(100),              // 사용작 직접 이름 지은 콤보 애칭 (ex. 여름 숲 산책)
  notes: TEXT,                     // 본인의 경험적 후기 메모
  addedAt: TIMESTAMP
}`}
            </pre>
          </div>

          <div>
            <span className="text-emerald-400 font-extrabold">5. Table [Layering_Log] (실제 분사 히스토리 레코드)</span>
            <pre className="text-stone-300 mt-1 whitespace-pre-wrap leading-relaxed">
{`{
  id: VARCHAR(64) [PK],
  userId: VARCHAR(64) [FK -> User.id],
  perfumeId1: VARCHAR(64),
  perfumeId2: VARCHAR(64),
  tpoConcept: VARCHAR(50),         // 컨셉 (미니멀, 캐주얼, 포멀)
  tpoPlace: VARCHAR(50),           // 장소 (오피스, 야외 등)
  tpoTarget: VARCHAR(50),          // 비즈니스 파트너 등 대상
  weather: VARCHAR(30),            // 착향 당일의 계절환경
  sprayedAt: TIMESTAMP,
  rating: INTEGER                  // 착향 종합 만족도 평점 (1 to 5)
}`}
            </pre>
          </div>
        </div>
      </div>

      {/* SECTION 3 */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#2E5A36] flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#2E5A36]" />
          3. AI Recommendation Logic & Prompt Strategy
        </h3>
        <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-semibold font-sans">
          보유 장비 및 대상 결합은 복잡계 가중치 조율이 요구됨에 따라, ScentWeave는 **휴리스틱 가중치 전처리**와 **LLM 디테일 프로토콜 제너레이션**의 투트랙 하이브리드 엔진을 갖추고 있습니다.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-stone-900 border border-stone-850 rounded-xl shadow-sm">
            <h4 className="text-[10px] font-bold text-stone-300 tracking-wider uppercase mb-2 font-mono">
              [의사코드 / Pseudocode] 보유 목록 기준 레이어링 매칭 알고리즘
            </h4>
            <pre className="text-[11px] font-mono text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre">
{`function calculateLayeringSynergy(PerfumeA, PerfumeB, TPO_Filters):
    if PerfumeA.id == PerfumeB.id:
        return { Score: 30, Reason: "동일 향수 혼합 지양" }

    // 기본 조향 조화 지수 연산
    scent_families = MergeAndCountUnique([PerfumeA.scentFamily, PerfumeB.scentFamily])
    base_score = 75 // 디폴트 지점

    // 1단계: 향조 무드 상호 보완 가중치(Synergy Map Matrix) 계산
    if 'Musk' in scent_families and 'Woody' in scent_families:
        base_score += 15 // 온화하고 은은한 나무향 시너지 극대화
    if 'Citrus' in scent_families and 'Woody' in scent_families:
        base_score += 12 // 싱그럽고 정중한 고지식 탑-잔향 분진 조화
    if 'Floral' in scent_families and 'Musk' in scent_families:
        base_score += 10 // 벨벳처럼 부드러운 화이트 린넨 무드

    // 2단계: 크로스오버 디버깅 (과도한 겹침 현상 방지)
    common_scent_categories = Intersection(PerfumeA.scentFamily, PerfumeB.scentFamily)
    if common_scent_categories.length >= 2:
        base_score -= 8  // 향이 뭉치고 지루해짐을 패널티 부과

    // 3단계: 환경 수용 적합도 가중치 산출 (TPO & Season Matcher)
    tpo_premium = 0
    if TPO_Filters.Weather in PerfumeA.season and TPO_Filters.Weather in PerfumeB.season:
        tpo_premium += 6
    if TPO_Filters.Concept == "포멀" and ('Woody' in scent_families or 'Amber' in scent_families):
        tpo_premium += 4

    finalMatchScore = Clamp(base_score + tpo_premium, 0, 99)
    return {
        Score: finalMatchScore,
        BasePerfume: WeightCheck(PerfumeA, PerfumeB) ? PerfumeA : PerfumeB,
        TopPerfume: WeightCheck(PerfumeA, PerfumeB) ? PerfumeB : PerfumeA
    }`}
            </pre>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-stone-800">
            <h4 className="text-xs font-bold text-stone-900 tracking-wider uppercase mb-2 font-sans">
              [Prompt Engineering Specification] 새 향수 구매 합리성 리스폰스 룰셋
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed mb-2 font-semibold">
              Gemini 3.5 Flash 모델에 정형화된 JSON 반환 및 고도의 향 분석을 지시하기 위해 설계한 코어 템플릿:
            </p>
            <div className="font-mono text-xs text-stone-800 bg-white p-3.5 rounded-lg border border-stone-200 whitespace-pre-wrap leading-relaxed shadow-xs font-medium">
{`"당신은 세계적인 니치 퍼퓸 평론가이자 AI 조향 분석가입니다.
입력받은 [신규 향수 제품 명세]를 사용자의 [보유 향수 컬렉션] 및 [선호 취향 저널]과 교차 대조하여, 구매가 타당하고 합리적인지 정교하게 정량 분석(0-100점)하여 JSON으로만 답변해 주세요."`}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4 */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-[#2E5A36] flex items-center gap-2">
          <Layout className="w-4 h-4 text-[#2E5A36]" />
          4. UI/UX Core Interaction System Guide
        </h3>
        <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-semibold font-sans">
          사용성 지침에 따른 각 모듈별 상호작용 및 기획 설계 사양입니다.
        </p>
        <ul className="space-y-3.5 text-stone-700 text-xs font-medium pl-1">
          <li className="p-3 bg-stone-50 rounded-xl border border-stone-200 shadow-xs">
            <strong className="text-stone-900 block mb-1">향수 도서관 (Wardrobe & Library)</strong>
            향수 전체 목록(Scent Library)에서 클릭 한 번으로 사용자의 퍼스널 드레스룸(My Wardrobe)에 실시간 적치하고 즉각적으로 반영됩니다.
          </li>
          <li className="p-3 bg-stone-50 rounded-xl border border-stone-200 shadow-xs">
            <strong className="text-stone-900 block mb-1">레이어링 검색대 (TPO Synergy Matcher)</strong>
            동석할 핵심 인물, 장소 성격(오피스, 야외 등), 당일의 온기/습도를 카드 타일 셀렉터 형태로 수용하여, 소지 품목 최상의 시너지를 연산 가판에 실시간 노출합니다.
          </li>
          <li className="p-3 bg-stone-50 rounded-xl border border-stone-200 shadow-xs">
            <strong className="text-stone-900 block mb-1">블라인드 바잉 랩 (Blind-Buy Rationality Expert)</strong>
            구입에 임하기 전, 제품명 및 브랜드를 타이핑하면 수집되어 있던 기존 최애 컬렉션들과의 무드 중첩 지수 및 호환 조화도를 가혹하게 대조 및 채점하여 지성적 결정을 돕습니다.
          </li>
        </ul>
      </div>

      {/* SECTION 5 */}
      <div className="bg-emerald-50/30 p-5 rounded-2xl border border-emerald-150">
        <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-2">
          <FileJson className="w-4 h-4 text-[#2E5A36]" />
          5. Next Step: Production Seed Mock Data (JSON)
        </h3>
        <p className="text-stone-700 text-xs md:text-sm leading-relaxed mb-3 font-semibold font-sans">
          아래의 데이터 셋은 이미 본 어플리케이션 시스템 기저 데이터베이스 모형에 직접 맵핑되어 즉시 파이프라인 처리를 지원합니다.
        </p>
        
        <div className="bg-stone-900 p-4 rounded-xl font-mono text-[11px] text-emerald-300 max-h-48 overflow-y-auto shadow-inner leading-relaxed">
{`[
  {
    "id": "perfume_01",
    "brand": "Chanel",
    "name": "1957",
    "scentFamily": ["Musk", "Powdery"],
    "topNotes": ["White Musk", "Aldehydes"],
    "middleNotes": ["White Musk", "Orange Blossom"],
    "baseNotes": ["White Musk", "Orris", "Honey"],
    "season": ["봄", "가을", "겨울"],
    "gender": "Unisex",
    "description": "관능적이면서도 섬세한 화이트 머스크의 순수한 반짝임을 담은 우아한 수작."
  },
  {
    "id": "perfume_03",
    "brand": "Diptyque",
    "name": "Tam Dao",
    "scentFamily": ["Woody", "Warm Spicy"],
    "topNotes": ["Rosewood", "Italian Cypress"],
    "middleNotes": ["Sandalwood", "Cedarwood"],
    "baseNotes": ["Amber", "White Musk"],
    "season": ["가을", "겨울"],
    "gender": "Unisex",
    "description": "성스러운 사원 깊은 곳에서 울려 퍼지는 듯한 샌달우드의 묵직한 사색적 목조 센트."
  }
]`}
        </div>
      </div>
    </div>
  );
}
