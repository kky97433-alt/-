import React, { useState } from "react";
import { Sparkles, Heart, SprayCan, Clock, Droplet, Check, Share2 } from "lucide-react";
import { RecommendResponse } from "../types";
import { motion } from "motion/react";

interface LayeringResultCardProps {
  key?: string;
  result: RecommendResponse & { source?: string };
  onSaveFavorite: (layering: any) => void;
  isSaved: boolean;
}

export default function LayeringResultCard({ result, onSaveFavorite, isSaved }: LayeringResultCardProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = `ScentWeave에서 추천받은 [${result.layeringName}] 레이어링 조합!\n\n${result.perfume1.brand} ${result.perfume1.name} x ${result.perfume2.brand} ${result.perfume2.name}\n\n매칭 시너지 점수: ${result.matchScore}점!\n지금 ScentWeave에서 나만의 향 시너지를 계산해보세요.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-stone-200 rounded-2xl shadow-xs overflow-hidden relative break-keep"
      id="layering-result-card"
    >
      {/* Accent Background Glow - Beautiful elegant botanical green accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#2E5A36]" />

      <div className="p-6 space-y-6">
        {/* Header Title with source tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] tracking-widest font-mono text-[#2E5A36] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                RECOMMENDED WEAVING
              </span>
              {result.source && (
                <span className="text-[9px] tracking-widest font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                  {result.source === "gemini_ai" ? "GEMINI AI 3.5" : "LOCAL RULESET"}
                </span>
              )}
            </div>
            <h3 className="text-[17px] font-bold text-stone-900 tracking-tight break-keep">{result.layeringName}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSaveFavorite(result)}
              disabled={isSaved}
              className={`flex items-center gap-1.5 text-xs font-semibold py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
                isSaved
                  ? "bg-emerald-55/60 border-emerald-220/80 text-emerald-800"
                  : "bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-emerald-700 text-[#2E5A36]" : ""}`} />
              {isSaved ? "즐겨찾기 보관됨" : "조합 보관하기"}
            </button>

            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              title="결과 클립보드 복사"
            >
              {copied ? <Check className="w-4 h-4 text-[#2E5A36]" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Dynamic Duo Perfumers Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Perfume 1 info */}
          <div className="bg-stone-50/50 p-4 rounded-xl border border-stone-200/80 space-y-2 relative">
            <div className="absolute top-3 right-3 text-[9px] font-mono text-stone-400 tracking-widest font-semibold">파트 A (기본 베이스)</div>
            <span className="text-[11px] text-[#2E5A36] tracking-tight block font-bold uppercase">{result.perfume1.brand}</span>
            <h4 className="text-sm font-bold text-stone-900 leading-tight">{result.perfume1.name}</h4>
            <div className="flex flex-wrap gap-1">
              {result.perfume1.scentFamily.map((fam, i) => (
                <span key={i} className="text-[10px] bg-white border border-stone-150 text-stone-600 rounded px-1.5 py-0.5">
                  {fam}
                </span>
              ))}
            </div>
          </div>

          {/* Perfume 2 info */}
          <div className="bg-stone-50/50 p-4 rounded-xl border border-stone-200/80 space-y-2 relative">
            <div className="absolute top-3 right-3 text-[9px] font-mono text-amber-600 tracking-widest font-semibold">파트 B (화사한 포인트)</div>
            <span className="text-[11px] text-amber-700 tracking-tight block font-bold uppercase">{result.perfume2.brand}</span>
            <h4 className="text-sm font-bold text-stone-900 leading-tight">{result.perfume2.name}</h4>
            <div className="flex flex-wrap gap-1">
              {result.perfume2.scentFamily.map((fam, i) => (
                <span key={i} className="text-[10px] bg-white border border-stone-150 text-stone-600 rounded px-1.5 py-0.5">
                  {fam}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Match score bar */}
        <div className="space-y-2 bg-[#2E5A36]/5 p-4 rounded-xl border border-[#2E5A36]/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-800 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#2E5A36] fill-[#2E5A36]/10" />
              두 향수의 어울림 궁합
            </span>
            <span className="text-xs font-mono font-bold text-[#2E5A36]">{result.matchScore}점 / 100</span>
          </div>
          {/* Progress bar */}
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#2E5A36] h-full transition-all duration-1000 ease-out"
              style={{ width: `${result.matchScore}%` }}
            />
          </div>
          <p className="text-xs text-stone-600 leading-relaxed font-sans font-medium mt-2 break-keep">
            {result.reason}
          </p>
        </div>

        {/* Detailed Spraying Protocol Guidance */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-2">
            <SprayCan className="w-4 h-4 text-[#2E5A36]" />
            AI 조향사가 추천하는 향수 뿌리는 방법 (스텝별 순서)
          </h4>

          <div className="relative border-l border-stone-200 pl-4 ml-2.5 space-y-5 py-1">
            {/* Base Step */}
            <div className="relative">
              {/* Dot Icon Indicator */}
              <div className="absolute -left-[22px] top-0.5 w-2.5 h-2.5 rounded-full bg-[#2E5A36] border border-white" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#2E5A36] font-mono">1단계. 지속력이 강한 향수 먼저 뿌리기</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 rounded text-stone-600 border border-stone-200">
                    {result.sprayingProtocol.basePumps}회 분사
                  </span>
                </div>
                <h5 className="text-xs font-bold text-stone-900">{result.sprayingProtocol.basePerfume}</h5>
                <p className="text-xs text-stone-600 font-medium break-keep">
                  <strong className="text-stone-800">{result.sprayingProtocol.baseLocation}</strong> 부위에 고르고 넓게 분사합니다. 
                  체온이 직접 닿는 골격 부위나 하반신 부근에 은은하게 퍼지도록 하여, 지속력이 길고 묵직한 이 향기가 밑바탕에 오랜 시간 잘 깔리도록 다져줍니다.
                </p>
              </div>
            </div>

            {/* Waiting Step */}
            <div className="relative">
              <div className="absolute -left-[22px] top-0.5 w-2.5 h-2.5 rounded-full bg-stone-400 border border-white" />
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-stone-500 font-mono">
                  <Clock className="w-3 h-3 text-[#2E5A36]" />
                  향기가 스며드는 잠깐의 기다림 ({result.sprayingProtocol.delayMinutes}분 동안 그대로 두기)
                </div>
                <p className="text-xs text-stone-600 font-medium break-keep">
                  첫 향수가 내 살결의 오일 성분 및 체온과 충분히 어우러져 알코올 성질이 은은하게 가라앉을 때까지 약{" "}
                  <strong className="text-stone-800 font-mono">{result.sprayingProtocol.delayMinutes}분</strong> 동안 건드리지 않고 기다립니다. 
                  손목을 세게 문지르거나 비비면 향의 분자가 깨져 본연의 깊고 부드러운 잔향이 줄어들 수 있으니 주의해 주세요.
                </p>
              </div>
            </div>

            {/* Top Layering Step */}
            <div className="relative">
              <div className="absolute -left-[22px] top-0.5 w-2.5 h-2.5 rounded-full bg-amber-600 border border-white" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-amber-800 font-mono">2단계. 가벼운 향수로 화사함 얹기</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-stone-100 rounded text-stone-600 border border-stone-200">
                    {result.sprayingProtocol.topPumps}회 분사
                  </span>
                </div>
                <h5 className="text-xs font-bold text-stone-900">{result.sprayingProtocol.topPerfume}</h5>
                <p className="text-xs text-stone-600 font-medium break-keep">
                  기다린 시간이 지난 후, 맑고 상쾌함을 표현해줄 포인트 향수를{" "}
                  <strong className="text-stone-800">{result.sprayingProtocol.topLocation}</strong> 부근에 가볍게 얹듯이 뿌려줍니다. 
                  가볍고 맑은 첫인상이 먼저 풍기고 나중에 묵직한 베이스 향과 섞여 우아한 어울림을 드러냅니다.
                </p>
              </div>
            </div>
          </div>

          {/* Expert Tip Notice */}
          <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-start gap-2 text-xs">
            <Droplet className="w-4 h-4 text-[#2E5A36] fill-[#2E5A36]/10 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold text-stone-800">AI 조향사의 꿀팁:</span>
              <p className="text-stone-600 leading-relaxed italic break-keep font-medium">
                "{result.sprayingProtocol.tip}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
