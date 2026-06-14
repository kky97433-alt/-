/**
 * ScentWeave - Type Definitions
 */

// 1. Perfume (향수 마스터 데이터)
export interface Perfume {
  id: string; // ex) "perfume_01"
  brand: string; // 브랜드 명 (샤넬, 딥티크 등)
  brandKor?: string; // 한글 브랜드명
  name: string; // 향수 이름 (1957, 탐다오 등)
  nameKor?: string; // 한글 제품명
  scentFamily: string[]; // 향조 (Woody, Floral, Citrus, Musk, Powdery, Amber 등)
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  season: string[]; // 봄, 여름, 가을, 겨울
  gender: 'Unisex' | 'Men' | 'Women';
  imageUrl?: string;
  description: string;
}

// 2. User_Library (보유 향수 - 드레스룸)
export interface UserLibrary {
  id: string;
  userId: string;
  perfumeId: string;
  addedAt: string;
  notes?: string; // 개인 메모 (ex. 선물 받은 것, 가을 전용 등)
}

// 3. User (사용자 정보)
export interface User {
  id: string;
  name: string;
  email: string;
  scentPreference?: string[]; // 선호 향조
}

// 4. Favorites (보유 목록 기반 레이어링 즐겨찾기)
export interface FavoriteLayering {
  id: string;
  userId: string;
  perfumeId1: string;
  perfumeId2: string;
  name?: string; // 조합에 붙인 애칭
  notes?: string; // 착향 느낌 메모
  addedAt: string;
}

// 5. Layering_Log (레이어링 매칭 및 착향 시도 로그)
export interface LayeringLog {
  id: string;
  userId: string;
  perfumeId1: string;
  perfumeId2: string;
  tpoConcept: string; // 기분/분위기 (Mood)
  tpoStyle?: string;  // 옷차림 분위기 (Style)
  tpoPlace: string; // 장소
  tpoTarget: string; // 만나는 대상
  weather: string; // 날씨 및 계절
  sprayedAt: string;
  rating: number; // 별점 (1~5)
}

// Request & Response 인터페이스
export interface RecommendRequest {
  targetPerfumeId?: string; // 검색 기준 향수 (선택)
  myPerfumes: Perfume[]; // 보유 향수 리스트
  tpoConcept: string; // 기분/분위기 (Mood)
  tpoStyle?: string;  // 옷차림 분위기 (Style)
  tpoPlace: string;
  tpoTarget: string;
  weather: string;
}

export interface RecommendResponse {
  layeringName: string;
  perfume1: Perfume;
  perfume2: Perfume;
  matchScore: number;
  reason: string;
  sprayingProtocol: {
    basePerfume: string;
    baseLocation: string;
    basePumps: number;
    delayMinutes: number;
    topPerfume: string;
    topLocation: string;
    topPumps: number;
    tip: string;
  };
}

export interface AnalyzeBuyRequest {
  newPerfumeName: string;
  newPerfumeBrand: string;
  myPerfumes: Perfume[];
  favorites: FavoriteLayering[];
}

export interface AnalyzeBuyResponse {
  score: number;
  newPerfume: {
    brand: string;
    name: string;
    scentFamily: string[];
    topNotes: string[];
    middleNotes: string[];
    baseNotes: string[];
    description: string;
  };
  synergyAnalysis: string; // 기존 향수와의 레이어링 시너지 분석
  preferenceMatch: string; // 유저 기존 취향과의 일치도 분석
  verdict: string; // 종합 구매 권장 여부 한줄평
  suggestedLayering: {
    withPerfumeName: string;
    withPerfumeBrand: string;
    expectedResult: string;
  } | null;
}
