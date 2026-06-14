import fs from "fs";
import path from "path";
import { Perfume } from "../types";
import { GoogleGenAI, Type } from "@google/genai";

const DB_PATH = path.join(process.cwd(), "src", "data", "perfume_db.json");

// Memory Cache
let perfumeCache: Perfume[] = [];

// Load perfumes from JSON database
export function loadPerfumes(): Perfume[] {
  try {
    if (fs.existsSync(DB_PATH)) {
      const data = fs.readFileSync(DB_PATH, "utf-8");
      perfumeCache = JSON.parse(data);
    } else {
      console.warn(`[perfumeDb] DB file not found at ${DB_PATH}. Empty cache initialized.`);
      perfumeCache = [];
    }
  } catch (error) {
    console.error("[perfumeDb] Failed to read perfume database file:", error);
    perfumeCache = [];
  }
  return perfumeCache;
}

// Write perfumes back to JSON database
export function savePerfumes(perfumes: Perfume[]): boolean {
  try {
    // Ensure parent directories exist
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(perfumes, null, 2), "utf-8");
    perfumeCache = [...perfumes];
    return true;
  } catch (error) {
    console.error("[perfumeDb] Failed to save perfume database file:", error);
    return false;
  }
}

// Retrieve from cache or load on demand
export function getPerfumesList(): Perfume[] {
  if (perfumeCache.length === 0) {
    return loadPerfumes();
  }
  return perfumeCache;
}

// Single insertion
export function addPerfumeToDb(newPerfume: Perfume): boolean {
  const list = getPerfumesList();
  // Check if ID or name+brand combo already exists to avoid duplicate entries
  const exists = list.some(
    (p) =>
      p.id === newPerfume.id ||
      (p.brand.toLowerCase() === newPerfume.brand.toLowerCase() &&
        p.name.toLowerCase() === newPerfume.name.toLowerCase())
  );
  if (exists) {
    return false;
  }
  list.push(newPerfume);
  return savePerfumes(list);
}

// AI-based real-time auto-expansion system using Gemini API
export async function autoExpandPerfumeWithAI(
  ai: GoogleGenAI,
  brandInput: string,
  nameInput: string
): Promise<Perfume | null> {
  const query = `${brandInput} ${nameInput}`.trim();
  console.log(`[perfumeDb] Running AI Auto-Expansion Search for: "${query}"`);

  // Prompt requesting Gemini to perform a precise research on the missing perfume
  const prompt = `당신은 전 세계의 고급 니치 향수와 브랜드 신상품을 면밀히 분석하는 전문 어시스턴트 조향사입니다.
진행 상황 및 지침:
사용자가 마스터 데이터베이스에서 찾을 수 없는 [${query}] 향수를 등록해 달라고 요청했습니다.
웹 상의 공식 자료 및 최신 Fragrantica, Parfumo 아카이브 정보를 실시간 검색을 통해 수집하고 분석하여, 이 향수의 정확한 브랜드명과 제품 정보를 정밀한 JSON 구조로 돌려주세요.

반드시 다음 조건에 맞게 JSON을 구성하세요:
1. brand: 공식 영어 브랜드 이름 (예: "Le Labo", "Chanel")
2. brandKor: 공식 한글 브랜드 이름 (예: "르라보", "샤넬")
3. name: 공식 영어 향수 이름 (예: "Santal 33", "No.5")
4. nameKor: 공식 한글 향수 이름 (예: "상탈 33", "넘버 5")
5. scentFamily: 향수 대표 어코드/향조 목록 (예: ["Woody", "Powdery", "Leather", "Spicy"] 혹은 ["Citrus", "Floral"]) - 1개에서 최대 4개까지 영어 단어로 입력
6. topNotes: 실제 탑노트 성분들 (예: ["Sandalwood", "Cedarwood"]) - 영어 단어로 영작해 리스트 입력
7. middleNotes: 실제 미들노트 성분들 - 영어 단어로 영작해 리스트 입력
8. baseNotes: 실제 베이스노트 성분들 - 영어 단어로 영작해 리스트 입력
9. season: 이 향수와 잘 어울리는 계절 목록 (예: ["가을", "겨울"] 혹은 ["봄", "여름"]) - ["봄", "여름", "가을", "겨울"] 중 1개 이상 골라 리스트 입력
10. gender: 이 향수의 지향 성별. "Unisex", "Men", "Women" 중 반드시 하나만 직접 기재
11. description: 이 향수만의 무드, 조향사의 분석이 담긴 아름답고 관능적인 국문 설명글 (한 문장, 약 50자 내외로 매우 우아하고 명쾌하게)

웹 검색결과를 바탕으로 완벽히 정확한 실제 향수 성분(Notes) 정보를 제공하며, 어물쩍 가짜 값을 꾸며내지 마세요. 만일 완전히 미지의 정체불명 향수라면 가장 유사한 네이밍의 실제 존재하는 브랜드 제품으로 스마트하게 보정하여 완성해 주세요.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }], // Enable web search grounding
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            brand: { type: Type.STRING },
            brandKor: { type: Type.STRING },
            name: { type: Type.STRING },
            nameKor: { type: Type.STRING },
            scentFamily: { type: Type.ARRAY, items: { type: Type.STRING } },
            topNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
            middleNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
            baseNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
            season: { type: Type.ARRAY, items: { type: Type.STRING } },
            gender: { type: Type.STRING, description: "Unisex, Men, or Women" },
            description: { type: Type.STRING }
          },
          required: [
            "brand",
            "brandKor",
            "name",
            "nameKor",
            "scentFamily",
            "topNotes",
            "middleNotes",
            "baseNotes",
            "season",
            "gender",
            "description"
          ]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response string returned from Gemini");
    }

    const cleanJson = JSON.parse(text);

    // Formulate a proper Perfume object
    const newPerfumeId = `perfume_${Date.now()}`;
    const newPerfume: Perfume = {
      id: newPerfumeId,
      brand: cleanJson.brand || brandInput,
      brandKor: cleanJson.brandKor || "미상 코스메틱",
      name: cleanJson.name || nameInput,
      nameKor: cleanJson.nameKor || nameInput,
      scentFamily: cleanJson.scentFamily && cleanJson.scentFamily.length > 0 ? cleanJson.scentFamily : ["Fresh"],
      topNotes: cleanJson.topNotes || ["Unknown Top"],
      middleNotes: cleanJson.middleNotes || ["Unknown Middle"],
      baseNotes: cleanJson.baseNotes || ["Unknown Base"],
      season: cleanJson.season || ["봄", "여름", "가을", "겨울"],
      gender: cleanJson.gender || "Unisex",
      description: cleanJson.description || "실시간 분석으로 추가된 감각적인 조향 컬렉션 품목."
    };

    // Save back to DB
    const added = addPerfumeToDb(newPerfume);
    if (added) {
      console.log(`[perfumeDb] Successfully registered new perfume: [${newPerfume.id}] ${newPerfume.brand} - ${newPerfume.name}`);
      return newPerfume;
    } else {
      // It might already exist in memory under different casing or ID, retrieve and return it
      const existing = getPerfumesList().find(
        (p) =>
          (p.brand.toLowerCase() === newPerfume.brand.toLowerCase() &&
            p.name.toLowerCase() === newPerfume.name.toLowerCase())
      );
      if (existing) {
        return existing;
      }
    }
    return newPerfume;
  } catch (error) {
    console.error("[perfumeDb] Error generating or inserting unregistered perfume:", error);
    return null;
  }
}
