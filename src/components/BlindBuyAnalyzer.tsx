import React, { useState } from "react";
import { Search, Sparkles, TrendingUp, AlertTriangle, CheckCircle2, RefreshCw, Layers } from "lucide-react";
import { Perfume, FavoriteLayering, AnalyzeBuyResponse } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface BlindBuyAnalyzerProps {
  myPerfumes: Perfume[];
  favorites: FavoriteLayering[];
}

export default function BlindBuyAnalyzer({ myPerfumes, favorites }: BlindBuyAnalyzerProps) {
  const [newPerfumeName, setNewPerfumeName] = useState("");
  const [newPerfumeBrand, setNewPerfumeBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeBuyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerfumeName.trim()) {
      setError("향수 이름을 입력해 주세요.");
      return;
    }
    setError(null);
    setLoading(true);
    setAnalysisResult(null);

    try {
      const response = await fetch("/api/analyze-buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPerfumeName,
          newPerfumeBrand: newPerfumeBrand || "Unspecified",
          myPerfumes,
          favorites
        })
      });

      if (!response.ok) {
        throw new Error("서버와의 통신이 원활하지 않습니다.");
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message || "분석 결과를 가져오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const resetAnalyzer = () => {
    setNewPerfumeName("");
    setNewPerfumeBrand("");
    setAnalysisResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-stone-850 break-keep animate-fade-in" id="blind-buy-analyzer">
      {/* Introduction Card */}
      <div className="bg-white border border-stone-200 p-5 rounded-2xl shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 bg-stone-100 text-[#2D4A3E] rounded border border-stone-200">
            BLIND-BUY ADVISER
          </span>
          <h2 className="text-xl font-bold text-stone-950 tracking-tight">신상 향수 구매 만족도 예측기</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form Panel */}
        <div className="lg:col-span-12 xl:col-span-5 bg-white border border-stone-200 p-5 rounded-2xl h-fit space-y-4 shadow-xs">
          <h3 className="text-xs font-bold tracking-wider uppercase text-stone-500">살까 고민 중인 향수 정보</h3>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs text-stone-700 mb-1.5 font-bold">브랜드 이름 (선택)</label>
              <input
                type="text"
                value={newPerfumeBrand}
                onChange={(e) => setNewPerfumeBrand(e.target.value)}
                placeholder="예: 르라보, 바이레도, 크리드 등"
                className="w-full bg-stone-55 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-800 text-xs focus:outline-none focus:border-[#2E5A36] transition-all font-sans font-medium"
              />
            </div>
            
            <div>
              <label className="block text-xs text-stone-700 mb-1.5 font-bold">향수 이름 (필수)</label>
              <input
                type="text"
                required
                value={newPerfumeName}
                onChange={(e) => setNewPerfumeName(e.target.value)}
                placeholder="예: 발다프리크, 떼누아 29 등"
                className="w-full bg-stone-55 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-800 text-xs focus:outline-none focus:border-[#2E5A36] transition-all font-sans font-medium"
              />
            </div>

            {error && (
              <p className="text-xs text-red-650 flex items-center gap-1 bg-red-50 p-2.5 rounded-lg border border-red-200 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-550" />
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !newPerfumeName.trim()}
              className="w-full bg-[#2D4A3E] hover:bg-[#1E352F] text-white disabled:bg-stone-100 disabled:text-stone-400 font-bold text-sm py-3 px-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs active:translate-y-px border border-transparent"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  AI가 향수 성분을 꼼꼼히 분석하는 중...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#A3E635]" />
                  구매 만족도 예측 시작하기
                </>
              )}
            </button>
          </form>

          {/* Scent wardrobe state hint */}
          <div className="pt-3.5 border-t border-stone-100 text-[11px] text-stone-500 space-y-1 font-sans font-medium">
            <p className="font-semibold">• 내 옷장에 담긴 나의 실제 향수 개수: <span className="text-[#2D4A3E] font-bold font-mono">{myPerfumes.length}개</span></p>
            <p className="font-semibold">• 내가 보관해 둔 나만의 단골 취향 개수: <span className="text-[#2D4A3E] font-bold font-mono">{favorites.length}개</span></p>
          </div>
        </div>

        {/* Right Result Panel with motion transitions */}
        <div className="lg:col-span-12 xl:col-span-7">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                key="loading-panel"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white border border-stone-200 p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 h-full shadow-xs break-keep"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-stone-100 border-t-[#2E5A36] animate-spin" />
                  <Sparkles className="w-4 h-4 text-[#2E5A36] absolute top-4 left-4 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-stone-900 text-sm font-bold">고민 중인 향수의 성분 분석 중...</h4>
                  <p className="text-stone-500 text-xs max-w-sm leading-relaxed font-semibold">
                    새롭게 입력하신 향수의 첫인상과 잔향 노트를 파악하고, 내 옷장 속 향수들과의 향기 겹침, 부딪힘, 그리고 섞어 썼을 때의 최상의 인생 시너지를 대입하여 정량 지수를 계산하고 있습니다.
                  </p>
                </div>
              </motion.div>
            )}

            {!loading && !analysisResult && (
              <motion.div
                key="empty-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-stone-200 border-dashed p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-3 h-full min-h-[350px] shadow-xs text-stone-500 break-keep"
              >
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-150 text-stone-400">
                  <Search className="w-6 h-6 text-stone-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-stone-900 text-sm font-bold">향수 정보를 입력해 주세요</h4>
                  <p className="text-stone-550 text-xs px-6 leading-relaxed max-w-sm font-semibold">
                    왼쪽 입력란에 살까 고민 중인 향수의 브랜드와 이름을 적은 다음 분석 버튼을 클릭해 주세요.
                  </p>
                </div>
              </motion.div>
            )}

            {!loading && analysisResult && (
              <motion.div
                key="result-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-stone-200 p-6 rounded-2xl shadow-xs space-y-6 text-stone-800 break-keep"
              >
                {/* Result Title & Score */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-[9px] tracking-widest font-mono text-[#2D4A3E] uppercase bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 font-bold inline-block">
                      AI SCENT ANALYSIS
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis animate-fade-in pr-2" title={`${analysisResult.newPerfume.brand} • ${analysisResult.newPerfume.name}`}>
                      {analysisResult.newPerfume.brand} • {analysisResult.newPerfume.name}
                    </h3>
                    <p className="text-xs text-stone-500 italic font-medium truncate" title={analysisResult.newPerfume.description}>
                      "{analysisResult.newPerfume.description}"
                    </p>
                  </div>

                  {/* Score Indicator Badge */}
                  <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200 self-start md:self-center shadow-xs shrink-0">
                    <div className="relative flex items-center justify-center">
                      {/* Circle Gauge Back */}
                      <svg className="w-12 h-12 transform -rotate-90">
                        <circle cx="24" cy="24" r="20" className="stroke-stone-200 fill-none" strokeWidth="3.5" />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          className="stroke-[#2D4A3E] fill-none"
                          strokeWidth="3.5"
                          strokeDasharray={125}
                          strokeDashoffset={125 - (125 * analysisResult.score) / 100}
                        />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-stone-800 tracking-tight leading-none font-mono">
                        {analysisResult.score}점
                      </span>
                    </div>
                    <div>
                      <div className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">구매 만족도</div>
                      <div className="text-xs font-bold text-[#2D4A3E]">
                        {analysisResult.score >= 85 ? "사셔도 좋습니다! 최고의 선택" : analysisResult.score >= 70 ? "괜찮은 선택! 새로운 영역 개척" : "한번 더 고민해보세요 (유사한 느낌)"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scent Spec Accordion */}
                <div className="bg-stone-50/50 rounded-xl p-4 border border-stone-150 space-y-2.5 shadow-xs">
                  <span className="text-[10px] font-bold text-[#2D4A3E] uppercase tracking-wider font-mono block">지배적인 향 계열 및 구성 스펙트럼</span>
                  <div className="flex flex-wrap gap-1.5">
                    {analysisResult.newPerfume.scentFamily.map((fam, i) => (
                      <span key={i} className="text-[10px] bg-white border border-stone-200 rounded px-2 py-0.5 text-stone-700 font-bold">
                        {fam}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-3 text-xs text-stone-600 border-t border-stone-200/60">
                    <div className="bg-white/80 p-3 rounded-xl border border-stone-150 space-y-1">
                      <dt className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider font-mono">탑 노트 (Top Notes)</dt>
                      <dd className="text-stone-800 font-bold text-[11px] leading-relaxed break-words whitespace-normal">
                        {analysisResult.newPerfume.topNotes.join(", ")}
                      </dd>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-stone-150 space-y-1">
                      <dt className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider font-mono">미들 노트 (Middle Notes)</dt>
                      <dd className="text-stone-800 font-bold text-[11px] leading-relaxed break-words whitespace-normal">
                        {analysisResult.newPerfume.middleNotes.join(", ")}
                      </dd>
                    </div>
                    <div className="bg-white/80 p-3 rounded-xl border border-stone-150 space-y-1">
                      <dt className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wider font-mono">베이스 노트 (Base Notes)</dt>
                      <dd className="text-stone-800 font-bold text-[11px] leading-relaxed break-words whitespace-normal">
                        {analysisResult.newPerfume.baseNotes.join(", ")}
                      </dd>
                    </div>
                  </div>
                </div>

                {/* Narrative Diagnostic Sections */}
                <div className="space-y-4">
                  {/* Synergy */}
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#2D4A3E]" />
                      내가 이미 가진 향수들과의 조화 및 유사향 여부
                    </h5>
                    <p className="text-xs text-stone-650 leading-relaxed font-semibold pl-5 break-keep">
                      {analysisResult.synergyAnalysis}
                    </p>
                  </div>

                  {/* Preference Match */}
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#2D4A3E]" />
                      내가 평소에 보관한 즐겨찾기 취향에 잘 맞는지
                    </h5>
                    <p className="text-xs text-stone-650 leading-relaxed font-semibold pl-5 break-keep">
                      {analysisResult.preferenceMatch}
                    </p>
                  </div>

                  {/* suggested layering partnership */}
                  {analysisResult.suggestedLayering && (
                    <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-150 space-y-1.5 animate-fade-in">
                      <h6 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D4A3E]" />
                        내 옷장 향수와 특별하게 섞어 쓰기 좋은 꿀조합 레시피
                      </h6>
                      <p className="text-xs text-stone-750 leading-relaxed break-keep">
                        새로 살 <strong className="text-stone-900">{analysisResult.newPerfume.name}</strong>을 내가 가진{" "}
                        <strong className="text-[#2D4A3E]">{analysisResult.suggestedLayering.withPerfumeBrand} {analysisResult.suggestedLayering.withPerfumeName}</strong>와 섞어 뿌려보세요.
                      </p>
                      <p className="text-xs text-stone-600 bg-white/80 p-2.5 rounded-lg border border-stone-200 leading-relaxed italic break-keep font-semibold shadow-xs">
                        "{analysisResult.suggestedLayering.expectedResult}"
                      </p>
                    </div>
                  )}

                  {/* Verdict Footer */}
                  <div className="pt-3 border-t border-stone-150 flex flex-col sm:flex-row items-start gap-2.5">
                    <div className="text-xs text-stone-750">
                      <span className="text-xs font-bold text-[#2D4A3E] block mb-0.5">AI 조향사의 최종 한마디</span>
                      <p className="leading-relaxed font-sans text-stone-600 italic font-bold break-keep">
                        "{analysisResult.verdict}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* footer buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={resetAnalyzer}
                    className="text-xs text-stone-650 hover:text-stone-900 bg-stone-105 hover:bg-stone-200 border border-stone-200 font-bold py-2 px-4 rounded-lg transition-all cursor-pointer"
                  >
                    이전으로
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
