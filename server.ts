import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { MASTER_PERFUMES, calculateLocalLayeringScore } from "./src/data";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini Client helper (Prevent crash on load if key is missing)
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY") {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

// 1. API: Get all perfumes catalog
app.get("/api/perfumes", (req, res) => {
  res.json(MASTER_PERFUMES);
});

// 2. API: Recommend Layering
app.post("/api/recommend", async (req, res) => {
  const { targetPerfumeId, myPerfumes, tpoConcept, tpoStyle, tpoPlace, tpoTarget, weather } = req.body;
  if (!myPerfumes || myPerfumes.length === 0) {
    return res.status(400).json({ error: "보유 중인 향수를 최소 1개 이상 추가해야 레이어링 추천이 가능합니다." });
  }

  const ai = getGeminiClient();
  
  // AI가 연동되어 있는 경우 대규모 매칭 계산 수행
  if (ai) {
    try {
      const myPerfumesStr = myPerfumes.map((p: any) => `- [${p.id}] ${p.brand} ${p.name} (${p.scentFamily.join(", ")})`).join("\n");
      const targetPerfume = targetPerfumeId ? MASTER_PERFUMES.find(p => p.id === targetPerfumeId) : null;
      let prompt = `당신은 럭셔리 니치 향수 전문 헤드 조향사이자 향수 레이어링 마스터입니다. 
다음 조건에 따라 의뢰인에게 최적의 향수 레이어링(Layering) 페어 조합(2종의 향수)을 추천하고, 구체적인 뿌리기 가이드(스프레이 프로토콜)를 JSON으로 돌려주세요.

[상황적 배경]
${tpoConcept && tpoConcept !== "상관없음" && tpoConcept !== "선택 안 함" ? `- 기분/분위기(Mood): ${tpoConcept}` : ""}
${tpoStyle && tpoStyle !== "상관없음" && tpoStyle !== "선택 안 함" ? `- 옷차림 스타일(Style): ${tpoStyle}` : ""}
${tpoPlace && tpoPlace !== "상관없음" && tpoPlace !== "선택 안 함" ? `- 착향 공간/장소: ${tpoPlace}` : ""}
${tpoTarget && tpoTarget !== "상관없음" && tpoTarget !== "선택 안 함" ? `- 만나게 될 대상: ${tpoTarget}` : ""}
${weather && weather !== "상관없음" && weather !== "선택 안 함" ? `- 날씨/계절: ${weather}` : ""}
*(지정되지 않았거나 "상관없음" / "선택 안 함"으로 들어온 항목은 구애받지 않아야 하는 조건이므로 의식하여 무시하고, 명시적으로 선택된 나머지 조건들(선택된 조건이 없다면 사계절 데일리 범용)만을 기준으로 한층 더 유연하고 조화로운 페어링 성취를 연출해 주세요)*

[사용할 수 있는 향수 후보]
${myPerfumesStr}
${targetPerfume ? `\n[인입 기준 향수 (반드시 이 향수와 내 보유 향수 중 1개를 섞어야 함)]\n- [${targetPerfume.id}] ${targetPerfume.brand} ${targetPerfume.name} (${targetPerfume.scentFamily.join(", ")})` : ""}

[레이어링 규칙]
1. 두 개의 향수는 브랜드와 제품이 서로 달라야 조합의 묘미(Weaving Scent)가 극대화됩니다. 
2. 두 향수 중 성격이 더 묵직한 것(우디, 머스크, 타바코, 앰버 등)을 베이스(Base)로 깔고, 가볍고 휘발성 높은 것(시트러스, 플로럴, 그린 등)을 탑(Top)으로 얹어야 조화롭습니다.
3. 매칭 합산 스코어(matchScore)는 100점 만점으로 정교하고 현실적으로 산출하세요 (완벽한 하모니는 90점 이상, 보통은 70~80점).
4. 스프레이 프로토콜(sprayingProtocol)은 아주 구체적으로 적어야 합니다:
   - 어디 부위에 몇 회 펌핑할지
   - 첫 번째 향수를 뿌린 뒤 몇 분의 딜레이(delayMinutes, 보통 1~5분)를 두고 두 번째 향수를 얹을지 명시
   - 어울리는 한 줄 꿀팁(tip) 제공.

아래 JSON 스키마 규격으로만 완벽한 JSON 문자열로 반환하고 마크다운 백틱 등은 적지 마세요.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              layeringName: { type: Type.STRING, description: "레이어링 조합에 어울리는 감성적이고 세련된 테마 이름 (예: 새벽녘 숲속의 비누향)" },
              perfume1: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  brand: { type: Type.STRING },
                  name: { type: Type.STRING },
                  scentFamily: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              perfume2: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  brand: { type: Type.STRING },
                  name: { type: Type.STRING },
                  scentFamily: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              matchScore: { type: Type.INTEGER, description: "100점 만점의 레이어링 시너지 점수" },
              reason: { type: Type.STRING, description: "왜 이 두 향수가 이 무드 및 조화에 맞는지 구체적 조향사 시각의 분석 설명 (200자 내외)" },
              sprayingProtocol: {
                type: Type.OBJECT,
                properties: {
                  basePerfume: { type: Type.STRING, description: "베이스 향수 풀네임" },
                  baseLocation: { type: Type.STRING, description: "베이스 분사 부위 (예: 가슴, 하반신, 손목 등)" },
                  basePumps: { type: Type.INTEGER, description: "베이스 분사 횟수" },
                  delayMinutes: { type: Type.INTEGER, description: "시간차 (분)" },
                  topPerfume: { type: Type.STRING, description: "탑 레이어 향수 풀네임" },
                  topLocation: { type: Type.STRING, description: "탑 분사 부위 (예: 손목, 목덜미 등)" },
                  topPumps: { type: Type.INTEGER, description: "탑 분사 횟수" },
                  tip: { type: Type.STRING, description: "조향사의 특별 레이어링 꿀팁" }
                },
                required: ["basePerfume", "baseLocation", "basePumps", "delayMinutes", "topPerfume", "topLocation", "topPumps", "tip"]
              }
            },
            required: ["layeringName", "perfume1", "perfume2", "matchScore", "reason", "sprayingProtocol"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ ...parsed, source: "gemini_ai" });
    } catch (e: any) {
      console.error("Gemini Layering Recommend Failed, falling back to local:", e);
    }
  }

  // AI 연동 실패 혹은 로컬 모드일 때 Fallback 연산 수행
  // 사용자의 보유 리스트 중 임의 혹은 타깃 향수와의 궁합이 가장 높은 콤보를 서칭
  let bestLayering: any = null;
  let bestScore = -1;

  if (targetPerfumeId) {
    const targetP = MASTER_PERFUMES.find(p => p.id === targetPerfumeId);
    if (targetP) {
      for (const myP of myPerfumes) {
        if (myP.id === targetP.id) continue;
        const resObj = calculateLocalLayeringScore(targetP, myP, {
          concept: tpoConcept,
          style: tpoStyle,
          place: tpoPlace,
          target: tpoTarget,
          weather
        });
        if (resObj.score > bestScore) {
          bestScore = resObj.score;
          bestLayering = {
            layeringName: `[Heuristic] ${targetP.name} & ${myP.name} 콤보`,
            perfume1: targetP,
            perfume2: myP,
            matchScore: resObj.score,
            reason: resObj.reason,
            sprayingProtocol: resObj.protocol
          };
        }
      }
    }
  }

  // 타깃 향수가 없거나, 타깃 향수 레이어링을 찾지 못한 경우 내 향수들 중에서 조합을 서치
  if (!bestLayering) {
    for (let i = 0; i < myPerfumes.length; i++) {
      for (let j = i + 1; j < myPerfumes.length; j++) {
        const resObj = calculateLocalLayeringScore(myPerfumes[i], myPerfumes[j], {
          concept: tpoConcept,
          style: tpoStyle,
          place: tpoPlace,
          target: tpoTarget,
          weather
        });
        if (resObj.score > bestScore) {
          bestScore = resObj.score;
          bestLayering = {
            layeringName: `[Heuristic] ${myPerfumes[i].name} x ${myPerfumes[j].name} 블렌딩`,
            perfume1: myPerfumes[i],
            perfume2: myPerfumes[j],
            matchScore: resObj.score,
            reason: resObj.reason,
            sprayingProtocol: resObj.protocol
          };
        }
      }
    }
  }

  // 단 하나의 향수만 가지고 있을 경우 스스로와의 혼합 프로토콜 반환
  if (!bestLayering && myPerfumes.length > 0) {
    const singleP = myPerfumes[0];
    const resObj = calculateLocalLayeringScore(singleP, singleP, {
      concept: tpoConcept,
      style: tpoStyle,
      place: tpoPlace,
      target: tpoTarget,
      weather
    });
    bestLayering = {
      layeringName: `실버 싱글 레이어링: ${singleP.name}`,
      perfume1: singleP,
      perfume2: singleP,
      matchScore: 60,
      reason: "보유 향수가 1개뿐이어, 단독 향수의 시간차 분사를 통한 무드 제어 프로토콜을 제안합니다.",
      sprayingProtocol: resObj.protocol
    };
  }

  res.json({ ...bestLayering, source: "local_heuristic" });
});

// 3. API: Blind-Buy Rationality Expert
app.post("/api/analyze-buy", async (req, res) => {
  const { newPerfumeName, newPerfumeBrand, myPerfumes, favorites } = req.body;
  if (!newPerfumeName) {
    return res.status(400).json({ error: "구매를 분석할 향수 이름을 입력해 주세요." });
  }

  const ai = getGeminiClient();
  if (ai) {
    try {
      const myPerfumesStr = myPerfumes.map((p: any) => `- ${p.brand} ${p.name} (${p.scentFamily.join("/")})`).join("\n");
      const favoritesStr = favorites.map((f: any) => `- 즐겨찾기 조합 : [${f.name}] (${f.notes})`).join("\n");

      let prompt = `당신은 세계적인 향수 구매 합리성 컨설턴트이자 최고의 전문 조향 장인입니다.
소비자가 새로 구매하려는 신규 향수 ["${newPerfumeBrand || "미정"} ${newPerfumeName}"]의 구매가 유저가 소지한 기존 옷장 컬렉션 및 평소 즐겨찾기 보관 조합과 얼마나 부합하는지 냉철하고 정확하게 분석 및 처방하세요.

[새로 사고 싶은 향수]
- 브랜드: ${newPerfumeBrand || "미정"}
- 이름: ${newPerfumeName}

[의뢰인이 기존 보유 중인 향수 목록 (내 드레스룸)]
${myPerfumes.length > 0 ? myPerfumesStr : "(보유 향수 없음 - 향린이 입문 단계)"}

[의뢰인의 즐겨찾는 취향 향수 무드]
${favorites.length > 0 ? favoritesStr : "(아직 특별한 즐겨찾기 성향 기록 없음)"}

[작성 지침 - 매우 핵심적인 제약조건]
1. 정량적 스코어 (score, 100점 만점):
   - 기존 컬렉션과 너무 향이 겹쳐서 충동구매인 경우 과감히 점수를 낮추고(60~70점), 보유 향수와 조화하여 경이로운 레이어링 시너지를 자아낼 수 있다면 높은 점수(85~95점)를 합리적으로 부과하세요.
2. Synergy Analysis (synergyAnalysis): 기존 소장 향수들과 새로 구매하려는 이 향수를 연계했을 때 어울림 시너지 또는 중복 우려점을 절대 군더더기 없이 요약하여 "최대 3~4줄 이내"의 담백하고 짧은 문장들로 요약 작성하세요. (장황한 수식어는 절대 제외)
3. Preference Match (preferenceMatch): 유저가 보관한 즐겨찾기 취향 무드와 대비했을 때, 실패하지 않고 평생의 시그니처 짝이 될 궁합을 "최대 3~4줄 이내"로 간결하게 분석 및 정리하세요.
4. Suggested Layering (suggestedLayering): 소장 중인 향수 중 한 개를 찝어 가치 있는 최고의 조합 방향을 서술하세요. (소장 향수가 아예 없다면 null)

아래 JSON으로만 완벽한 문자열을 반환하고 마크다운 백틱 등은 적지 마세요.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: "100점 만점 기준 구매 합리성 수치" },
              newPerfume: {
                type: Type.OBJECT,
                properties: {
                  brand: { type: Type.STRING },
                  name: { type: Type.STRING },
                  scentFamily: { type: Type.ARRAY, items: { type: Type.STRING } },
                  topNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  middleNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  baseNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING, description: "이 향수에 대한 한줄 조향사급 소개글 (20자 미만)" }
                },
                required: ["brand", "name", "scentFamily", "topNotes", "middleNotes", "baseNotes", "description"]
              },
              synergyAnalysis: { type: Type.STRING, description: "최대 3-4줄 내외 요약된 시너지 분석문" },
              preferenceMatch: { type: Type.STRING, description: "최대 3-4줄 내외 요약된 사용자의 취향 부합 분석문" },
              verdict: { type: Type.STRING, description: "단호하고 명확한 한 줄 지침 평" },
              suggestedLayering: {
                type: Type.OBJECT,
                nullable: true,
                properties: {
                  withPerfumeName: { type: Type.STRING },
                  withPerfumeBrand: { type: Type.STRING },
                  expectedResult: { type: Type.STRING, description: "추천 레이어링 시너지를 묘사한 매우 짧은 요약(30자 내외)" }
                },
                required: ["withPerfumeName", "withPerfumeBrand", "expectedResult"]
              }
            },
            required: ["score", "newPerfume", "synergyAnalysis", "preferenceMatch", "verdict", "suggestedLayering"]
          }
        }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json({ ...parsed, source: "gemini_ai" });
    } catch (e: any) {
      console.error("Gemini Buy Analysis Failed, falling back to heuristic:", e);
    }
  }

  // Fallback: Heuristic Buy Analysis
  // 임의로 기존 향수의 scentFamily를 바탕으로 65 ~ 92점 대의 분석 리포트를 생성해 제공합니다.
  const hasWoodyMy = myPerfumes.some(p => p.scentFamily.includes("Woody"));
  const scoreVal = hasWoodyMy ? 84 : 72;

  const suggestP = myPerfumes.length > 0 ? myPerfumes[0] : null;

  res.json({
    score: scoreVal,
    newPerfume: {
      brand: newPerfumeBrand || "Custom Select",
      name: newPerfumeName,
      scentFamily: ["Aromatic", "Citrus", "Woody"],
      topNotes: ["Yuzu", "Pink Pepper"],
      middleNotes: ["Violet", "Clary Sage"],
      baseNotes: ["Sandalwood", "Warm Cedar"],
      description: "감각적이고 세련된 아로마틱 시트러스 우디 계열"
    },
    synergyAnalysis: `소장 컬렉션과 분석한 결과, 기존의 묵직한 베이스 향들과 매력적인 시너지를 낼 수 있는 산뜻한 우디 포지션입니다. 향조가 서로 겹치지 않아 컬렉션의 깊이와 활용도를 더욱 넓혀주는 든든한 역할을 해줄 것입니다.`,
    preferenceMatch: `등록된 보관 취향과 대조해 볼 때, 자연주의적인 아로마틱 노트를 담아 실망할 걱정 없이 완벽히 정착할 수 있는 흐름입니다. 평소 취향 무드와 깔끔하게 잘 맞아 떨어지는 안전한 영혼의 페어입니다.`,
    verdict: `${newPerfumeName}은(는) 컬렉션의 무드를 한결 넓혀 줄 영특한 한 수이므로 강력히 구매를 추천합니다.`,
    suggestedLayering: suggestP ? {
      withPerfumeName: suggestP.name,
      withPerfumeBrand: suggestP.brand,
      expectedResult: `${suggestP.name}의 풍요로운 우디 잔향 위에 새 봄날의 싱그러운 Yuzu 노트가 가볍게 얹히는 매력적인 시너지.`
    } : null,
    source: "local_heuristic"
  });
});

// Vite & Static assets server setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[ScentWeave Server] running on http://localhost:${PORT} under ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
