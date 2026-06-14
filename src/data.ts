import { Perfume } from "./types";

// 1. 디폴트 마스터 향수 리스트 (15종 명품 및 니치 향수)
export const MASTER_PERFUMES: Perfume[] = [
  {
    id: "perfume_01",
    brand: "Chanel",
    name: "1957",
    scentFamily: ["Musk", "Powdery", "Floral", "Clean"],
    topNotes: ["White Musk", "Aldehydes", "Bergamot", "Pink Pepper"],
    middleNotes: ["White Musk", "Orange Blossom", "Jasmine"],
    baseNotes: ["White Musk", "Orris", "Honey", "Cedarwood"],
    season: ["봄", "가을", "겨울"],
    gender: "Unisex",
    description: "관능적이면서도 섬세한 화이트 머스크의 순수한 반짝임과 파우더리한 세련미를 담아낸 향."
  },
  {
    id: "perfume_02",
    brand: "Diptyque",
    name: "Philosophykos (필로시코스)",
    scentFamily: ["Green", "Fruity", "Woody", "Fig"],
    topNotes: ["Fig Leaf", "Fig ripe"],
    middleNotes: ["Coconut", "Green Accord"],
    baseNotes: ["Fig Tree", "Cedarwood"],
    season: ["봄", "여름"],
    gender: "Unisex",
    description: "무화과 잎과 나무의 싱그러움, 열매의 부드러운 단맛과 흙 내음이 어우러진 시그니처 그리너리 향."
  },
  {
    id: "perfume_03",
    brand: "Diptyque",
    name: "Tam Dao (탐다오)",
    scentFamily: ["Woody", "Warm Spicy", "Sandalwood"],
    topNotes: ["Rosewood", "Myrtle", "Italian Cypress"],
    middleNotes: ["Sandalwood", "Cedarwood"],
    baseNotes: ["Spices", "Amber", "White Musk"],
    season: ["가을", "겨울"],
    gender: "Unisex",
    description: "인도차이나 반도의 성스러운 숲, 사원 깊은 곳에서 울려 퍼지는 듯한 샌달우드의 묵직하고 따스한 사원 향."
  },
  {
    id: "perfume_04",
    brand: "Jo Malone",
    name: "Wood Sage & Sea Salt",
    scentFamily: ["Aromatic", "Citrus", "Marine", "Woody"],
    topNotes: ["Ambrette Seeds", "Grapefruit"],
    middleNotes: ["Sea Salt", "Sage"],
    baseNotes: ["Red Algae", "Patchouli"],
    season: ["봄", "여름", "가을"],
    gender: "Unisex",
    description: "바람 부는 절벽의 짠 공기와 흙 내음, 세이지의 우디하고 허브향이 스며든 자유롭고 활기찬 분위기."
  },
  {
    id: "perfume_05",
    brand: "Jo Malone",
    name: "English Pear & Freesia",
    scentFamily: ["Floral", "Fruity", "Fresh"],
    topNotes: ["King William Pear", "Melon"],
    middleNotes: ["Freesia", "Rose"],
    baseNotes: ["Patchouli", "Amber", "Musk"],
    season: ["봄", "가을"],
    gender: "Women",
    description: "감미롭게 익은 배의 신선함과 화이트 프리지어 부케의 우아하고 감미로운 플로럴 시너지."
  },
  {
    id: "perfume_06",
    brand: "Byredo",
    name: "Blanche (블랑쉬)",
    scentFamily: ["Musk", "Aldehydic", "Powdery", "Floral"],
    topNotes: ["Aldehydes", "Rose", "Pink Pepper"],
    middleNotes: ["Peony", "Violet", "African Orange Flower"],
    baseNotes: ["Musk", "Woody Notes", "Sandalwood"],
    season: ["봄", "여름", "가을"],
    gender: "Unisex",
    description: "하얀 면 천과 비누, 갓 빨래해 햇볕에 말린 깨끗한 시트에서 영감을 받은 극강의 화이트 클린 머스크."
  },
  {
    id: "perfume_07",
    brand: "Byredo",
    name: "Gypsy Water (집시 워터)",
    scentFamily: ["Woody", "Aromatic", "Citrus", "Amber"],
    topNotes: ["Juniper", "Lemon", "Bergamot", "Pepper"],
    middleNotes: ["Pine Needles", "Incense", "Orris Root"],
    baseNotes: ["Sandalwood", "Vanilla", "Amber"],
    season: ["봄", "가을", "겨울"],
    gender: "Unisex",
    description: "신비롭고 이국적인 흙내음, 집시 문화의 자유정신을 연상시키는 신선한 레몬과 스모키한 우디 바닐라."
  },
  {
    id: "perfume_08",
    brand: "Le Labo",
    name: "Santal 33 (상탈 33)",
    scentFamily: ["Woody", "Powdery", "Leather", "Spicy"],
    topNotes: ["Sandalwood", "Virginia Cedar"],
    middleNotes: ["Cardamom", "Violet", "Papyrus"],
    baseNotes: ["Leather", "Amber", "Iris"],
    season: ["가을", "겨울"],
    gender: "Unisex",
    description: "말보로 맨에서 영감을 받은 퇴폐적이면서도 우디한 카드맘과 아이리스의 묵직함을 자랑하는 아이코닉 센트."
  },
  {
    id: "perfume_09",
    brand: "Le Labo",
    name: "Another 13 (어나더 13)",
    scentFamily: ["Musk", "Amber", "Animalic", "Ambroxan"],
    topNotes: ["Ambroxan", "Amyl Salicylate"],
    middleNotes: ["Pear", "Jasmine"],
    baseNotes: ["Musk", "Moss"],
    season: ["봄", "가을", "겨울"],
    gender: "Unisex",
    description: "살결 냄새에 가깝게 작용하는 신비로운 암브록산과 이끼의 매혹 성분들의 우아하고 정제된 화학 반응."
  },
  {
    id: "perfume_10",
    brand: "Maison Margiela",
    name: "Lazy Sunday Morning",
    scentFamily: ["Floral", "Musk", "Clean"],
    topNotes: ["Aldehydes", "Pear", "Lily-of-the-Valley"],
    middleNotes: ["Iris", "Rose", "Orange Blossom"],
    baseNotes: ["White Musk", "Ambrette Seeds", "Patchouli"],
    season: ["봄", "여름"],
    gender: "Unisex",
    description: "피렌체의 일요일 아침, 린넨 시트 위에 쏟아지는 따스한 햇살과 부드럽고 포근한 살결 머스크의 조화."
  },
  {
    id: "perfume_11",
    brand: "Maison Margiela",
    name: "Jazz Club (재즈 클럽)",
    scentFamily: ["Amber", "Tobacco", "Woody", "Sweet"],
    topNotes: ["Pink Pepper", "Neroli", "Lemon"],
    middleNotes: ["Rum", "Java Vetiver Oil", "Clary Sage"],
    baseNotes: ["Tobacco Leaf", "Vanilla Bean", "Styrax"],
    season: ["가을", "겨울"],
    gender: "Men",
    description: "브루클린의 올드 재즈바를 연상시키는 가죽 소파의 묵직함, 달달한 바닐라와 독특한 럼주, 깊은 타바코 아로마."
  },
  {
    id: "perfume_12",
    brand: "Creed",
    name: "Aventus (어벤투스)",
    scentFamily: ["Fruity", "Woody", "Leather", "Smoky"],
    topNotes: ["Pineapple", "Bergamot", "Black Currant", "Apple"],
    middleNotes: ["Birch", "Patchouli", "Moroccan Jasmine", "Rose"],
    baseNotes: ["Musk", "Oakmoss", "Ambergris", "Vanilla"],
    season: ["봄", "여름", "가을"],
    gender: "Men",
    description: "강인한 남성성의 미학과 정복욕을 불러 일으키는 파인애플의 상큼함과 가죽, 자작나무의 스모키한 깊이감."
  },
  {
    id: "perfume_13",
    brand: "Aesop",
    name: "Tacit (테싯)",
    scentFamily: ["Citrus", "Green", "Fresh Spicy", "Herbal"],
    topNotes: ["Yuzu", "Citrus Notes"],
    middleNotes: ["Basil"],
    baseNotes: ["Vetiver", "Cloves"],
    season: ["봄", "여름"],
    gender: "Unisex",
    description: "현대적인 신선함과 상큼함. 유자 향이 가득 터진 뒤 쌉싸름한 바질과 시원한 베티버로 마무리되는 명상적 그리너리."
  },
  {
    id: "perfume_14",
    brand: "Diptyque",
    name: "Orpheon (오르페온)",
    scentFamily: ["Woody", "Powdery", "Fresh", "Chypre"],
    topNotes: ["Juniper Berries"],
    middleNotes: ["Jasmine"],
    baseNotes: ["Powdery Notes", "Cedar", "Tonka Bean"],
    season: ["가을", "겨울", "봄"],
    gender: "Unisex",
    description: "디퓨티크 창립자들의 아지트였던 60년대 생제르망 바의 스모키한 목조 인테리어, 파우더리한 매력과 가벼운 주니퍼 베리."
  },
  {
    id: "perfume_15",
    brand: "Chanel",
    name: "Bleu de Chanel",
    scentFamily: ["Citrus", "Woody", "Fresh Spicy", "Amber"],
    topNotes: ["Grapefruit", "Lemon", "Mint", "Pink Pepper"],
    middleNotes: ["Ginger", "Nutmeg", "Jasmine", "Iso E Super"],
    baseNotes: ["Incense", "Vetiver", "Cedar", "Sandalwood", "Patchouli", "Labdanum"],
    season: ["봄", "여름", "가을", "겨울"],
    gender: "Men",
    description: "자유로우면서도 타협하지 않는 남성을 기리는 매혹적인 아로마틱 우디 센트. 프레시한 유자와 스모키한 나무 향."
  }
];

// 2. 초기 드레스룸에 등록된 유저 보유 향수들 (데모 편의상 4종 선탑재)
export const INITIAL_USER_LIBRARY = [
  { id: "lib_01", userId: "user_01", perfumeId: "perfume_01", addedAt: "2026-01-10T12:00:00Z", notes: "사계절 전천후 데일리 만능 레이어링 베이스" },
  { id: "lib_02", userId: "user_01", perfumeId: "perfume_03", addedAt: "2026-02-15T12:00:00Z", notes: "비 오는 가을날 가죽 자켓과 극강 조화" },
  { id: "lib_03", userId: "user_01", perfumeId: "perfume_04", addedAt: "2026-03-20T12:00:00Z", notes: "여름 캐주얼 스타일 완성템" },
  { id: "lib_04", userId: "user_01", perfumeId: "perfume_06", addedAt: "2026-04-05T12:00:00Z", notes: "깔끔한 화이트 셔츠 입은 날 필살기" }
];

// 3. 초기 레이어링 조합 즐겨찾기 목록
export const INITIAL_FAVORITES = [
  {
    id: "fav_01",
    userId: "user_01",
    perfumeId1: "perfume_01", // Chanel 1957 (Musk)
    perfumeId2: "perfume_03", // Diptyque Tam Dao (Woody)
    name: "우드와 화이트 머스크의 성스러운 사원",
    notes: "탐다오의 마른 정취 위에 샤넬 1957의 화이트 머스크가 얹어져 마치 럭셔리 스파 같은 무드가 됨.",
    addedAt: "2026-05-01T15:00:00Z"
  },
  {
    id: "fav_02",
    userId: "user_01",
    perfumeId1: "perfume_04", // Jo Malone Wood Sage (Marine)
    perfumeId2: "perfume_06", // Byredo Blanche (Clean Soap)
    name: "바람막이 안의 깨끗한 살결",
    notes: "조말론 우세가 주는 짠 소금 아로마 위에 블랑쉬의 갓 빨래한 비누 기운이 극적으로 융합됨.",
    addedAt: "2026-05-20T10:30:00Z"
  }
];

// 4. 로컬 오프라인 휴리스틱 레이어링 엔진 (AI가 연결 안될 때, 혹은 연산 시너지를 채굴하기 위한 가이드 공식)
export function calculateLocalLayeringScore(
  p1: Perfume,
  p2: Perfume,
  filters: { concept: string; style?: string; place: string; target: string; weather: string }
): {
  score: number;
  reason: string;
  protocol: any;
} {
  if (p1.id === p2.id) {
    return {
      score: 30,
      reason: "동일한 향수를 겹쳐 뿌리는 레이어링은 지속력 강화에 도움은 되나, 다채로운 향의 변조 시너지는 기대하기 어렵습니다.",
      protocol: {
        basePerfume: p1.name,
        baseLocation: "손목",
        basePumps: 2,
        delayMinutes: 0,
        topPerfume: p2.name,
        topLocation: "목덜미",
        topPumps: 1,
        tip: "단순히 지향성을 높이거나 향을 연장할 목적에 그칩니다."
      }
    };
  }

  // 1. 향조 시너지 맵
  // Musk + Woody = 98점
  // Citrus + Woody = 94점
  // Marine + Musk = 90점
  // Fig + Woody = 92점
  // Floral + Musk = 95점
  // Leather + Sweet/Vanilla = 88점
  // 중복되는 향조가 있을 시 약간 감점, 상호 보완 시 고점

  const p1Families = p1.scentFamily;
  const p2Families = p2.scentFamily;

  let baseScore = 75; // 디폴트 평점

  // 시너지 탐색
  const hasMusk = p1Families.includes("Musk") || p2Families.includes("Musk");
  const hasWoody = p1Families.includes("Woody") || p2Families.includes("Woody");
  const hasCitrus = p1Families.includes("Citrus") || p2Families.includes("Citrus");
  const hasFloral = p1Families.includes("Floral") || p2Families.includes("Floral");
  const hasFruity = p1Families.includes("Fruity") || p2Families.includes("Fruity");
  const hasClean = p1Families.includes("Clean") || p2Families.includes("Clean") || p1Families.includes("Aldehydic") || p2Families.includes("Aldehydic");

  // 시너지 가산점
  if (hasMusk && hasWoody) baseScore += 18;
  else if (hasCitrus && hasWoody) baseScore += 16;
  else if (hasFloral && hasMusk) baseScore += 14;
  else if (hasFruity && hasWoody) baseScore += 12;
  else if (hasClean && hasWoody) baseScore += 15;
  else if (hasCitrus && hasMusk) baseScore += 11;

  // 두 향수가 너무 똑같은 계열일 경우 패널티 (지루함)
  const commonFamilies = p1Families.filter(f => p2Families.includes(f));
  if (commonFamilies.length >= 2) {
    baseScore -= 10;
  }

  // 계절 및 TPO 부합도 계산
  let tpoMatch = 5;
  // 날씨 부합
  const weatherVal = filters.weather;
  if (!weatherVal || weatherVal === "상관없음" || weatherVal === "선택 안 함") {
    tpoMatch += 4;
  } else {
    const p1SeasonMatch = p1.season.some(s => weatherVal.includes(s) || s === weatherVal);
    const p2SeasonMatch = p2.season.some(s => weatherVal.includes(s) || s === weatherVal);
    if (p1SeasonMatch && p2SeasonMatch) tpoMatch += 5;
    else if (p1SeasonMatch || p2SeasonMatch) tpoMatch += 2;
  }

  // 2. 기분/분위기 (Mood) 매칭
  const concept = filters.concept;
  if (!concept || concept === "상관없음" || concept === "선택 안 함") {
    tpoMatch += 2;
  } else if (concept.includes("차분함") && (p1Families.includes("Woody") || p2Families.includes("Woody") || p1Families.includes("Green") || p2Families.includes("Green"))) {
    tpoMatch += 4;
  } else if (concept.includes("생기") && (p1Families.includes("Citrus") || p2Families.includes("Citrus") || p1Families.includes("Fruity") || p2Families.includes("Fruity") || p1Families.includes("Fresh") || p2Families.includes("Fresh"))) {
    tpoMatch += 4;
  } else if (concept.includes("성숙") && (p1Families.includes("Amber") || p2Families.includes("Amber") || p1Families.includes("Vanillic") || p2Families.includes("Vanillic"))) {
    tpoMatch += 4;
  } else if (concept.includes("포근") && (p1Families.includes("Musk") || p2Families.includes("Musk") || p1Families.includes("Powdery") || p2Families.includes("Powdery"))) {
    tpoMatch += 4;
  } else if (concept.includes("시크") && (p1Families.includes("Aldehydic") || p2Families.includes("Aldehydic") || p1Families.includes("Marine") || p2Families.includes("Marine"))) {
    tpoMatch += 4;
  } else if (concept.includes("몽환") && (p1Families.includes("Woody") || p2Families.includes("Woody") || p1Families.includes("Spicy") || p2Families.includes("Spicy"))) {
    tpoMatch += 4;
  } else {
    tpoMatch += 2;
  }

  // 3. 옷차림 분위기 (Style) 매칭
  const styleVal = filters.style;
  if (!styleVal || styleVal === "상관없음" || styleVal === "선택 안 함") {
    tpoMatch += 2;
  } else if (styleVal.includes("미니멀") && (hasMusk || hasClean)) {
    tpoMatch += 4;
  } else if (styleVal.includes("포멀") && hasWoody) {
    tpoMatch += 4;
  } else if (styleVal.includes("클래식") && (hasWoody || p1Families.includes("Amber") || p2Families.includes("Amber"))) {
    tpoMatch += 4;
  } else if (styleVal.includes("캐주얼") && (hasCitrus || hasFruity)) {
    tpoMatch += 4;
  } else if (styleVal.includes("스트릿") && (hasWoody || p1Families.includes("Spicy") || p2Families.includes("Spicy"))) {
    tpoMatch += 4;
  } else if (styleVal.includes("페미닌") && hasFloral) {
    tpoMatch += 4;
  } else if (styleVal.includes("아메카지") && (hasWoody || p1Families.includes("Leather") || p2Families.includes("Leather"))) {
    tpoMatch += 4;
  } else {
    tpoMatch += 2;
  }

  const finalScore = Math.min(99, baseScore + tpoMatch);

  // 분사법 스프레잉 프로토콜 가이드 추출
  // 룰: 더 묵직한(Woody, Amber, Tobacco) 것을 베이스로 스프레이 하고, 가볍고 휘발성 높은(Citrus, Green, Floral, Fresh) 것을 탑으로 레이어로 얹음.
  const p1Weight = (p1Families.includes("Woody") ? 4 : 0) + (p1Families.includes("Amber") ? 5 : 0) + (p1Families.includes("Musk") ? 2 : 0);
  const p2Weight = (p2Families.includes("Woody") ? 4 : 0) + (p2Families.includes("Amber") ? 5 : 0) + (p2Families.includes("Musk") ? 2 : 0);

  const isP1Base = p1Weight >= p2Weight;
  const basePerfume = isP1Base ? p1 : p2;
  const topPerfume = isP1Base ? p2 : p1;

  // 분사 프로토콜 정의
  const protocol = {
    basePerfume: `${basePerfume.brand} ${basePerfume.name}`,
    baseLocation: basePerfume.scentFamily.includes("Woody") ? "셔츠 안쪽이나 하반신(무릎 뒤)" : "목덜미 및 속목",
    basePumps: basePerfume.scentFamily.includes("Woody") || basePerfume.scentFamily.includes("Amber") ? 1 : 2,
    delayMinutes: basePerfume.scentFamily.includes("Woody") ? 3 : 2,
    topPerfume: `${topPerfume.brand} ${topPerfume.name}`,
    topLocation: "양 손목 & 귀 뒷쪽 맥박 부위",
    topPumps: topPerfume.scentFamily.includes("Citrus") || topPerfume.scentFamily.includes("Fresh") ? 2 : 1,
    tip: `${basePerfume.name}의 안정적인 우디/머스크 기반 위에 ${topPerfume.name}의 프레시한 활성이 만나면서, 과하지 않고 풍부하게 진화하는 살결 냄새를 자아냅니다.`
  };

  let situationText = "";
  const activeFilters = [];
  if (concept && concept !== "상관없음" && concept !== "선택 안 함") activeFilters.push(`${concept} 무드`);
  if (styleVal && styleVal !== "상관없음" && styleVal !== "선택 안 함") activeFilters.push(`${styleVal} 스타일`);
  if (filters.place && filters.place !== "상관없음" && filters.place !== "선택 안 함") activeFilters.push(`${filters.place} 공간`);
  if (filters.target && filters.target !== "상관없음" && filters.target !== "선택 안 함") activeFilters.push(`${filters.target} 대상`);
  if (filters.weather && filters.weather !== "상관없음" && filters.weather !== "선택 안 함") activeFilters.push(`${filters.weather} 날씨`);

  if (activeFilters.length > 0) {
    situationText = `특히 ${activeFilters.join(", ")}에 한껏 어울려 자연스럽게 부합되는 최상의 어코드입니다.`;
  } else {
    situationText = `특정 조건과 상황에 속박되지 않고 하루 종일 은은하게 연출 가능한 전천후 사계절 융합 코디네이션입니다.`;
  }

  const reason = `${basePerfume.brand} ${basePerfume.name}의 풍족하고 안락한 ${basePerfume.scentFamily.join("/")} 노트를 기초 도화지로 삼아, ${topPerfume.brand} ${topPerfume.name}의 ${topPerfume.scentFamily[0]} 탑노트가 맑고 반짝이는 파사드로 안착합니다. ${situationText}`;

  return {
    score: finalScore,
    reason,
    protocol
  };
}
