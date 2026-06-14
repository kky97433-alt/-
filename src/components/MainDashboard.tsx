import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Filter,
  Thermometer,
  User,
  MapPin,
  Clock,
  ArrowRight,
  Anchor,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  Heart,
  Share2,
  Check,
  Droplet,
  Shirt
} from "lucide-react";
import { Perfume, RecommendResponse } from "../types";
import LayeringResultCard from "./LayeringResultCard";
import { motion, AnimatePresence } from "motion/react";
import { calculateLocalLayeringScore } from "../data";

interface MainDashboardProps {
  myPerfumes: Perfume[];
  onAddPerfume: (p: Perfume) => void;
  onRemovePerfume: (pId: string) => void;
  favorites: any[];
  onSaveFavorite: (layering: any) => void;
  logs: any[];
  onAddLog: (log: any) => void;
  onNavigateToTab?: (tab: "dashboard" | "wardrobe" | "analyzer" | "favorites") => void;
}

// Compact helper sub-component for list pairing items to display candidates elegantly ("쫘라락")
function PairingItemCard({
  pairing,
  index,
  onSaveFavorite,
  isSaved
}: {
  pairing: RecommendResponse & { source?: string };
  index: number;
  onSaveFavorite: (layering: any) => void;
  isSaved: boolean;
  key?: string;
}) {
  const [isOpen, setIsOpen] = useState(index === 0); // Expand the highest score pairing by default
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `ScentWeave에서 추천받은 [오늘의 앵커 ⚓] 레이어링 조합!\n\n${pairing.perfume1.brand} ${pairing.perfume1.name} x ${pairing.perfume2.brand} ${pairing.perfume2.name}\n\n매칭 시너지 점수: ${pairing.matchScore}점!\n지금 ScentWeave에서 나만의 향 시너지를 계산해보세요.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className={`bg-white border rounded-2xl shadow-2xs overflow-hidden transition-all duration-300 ${
        isOpen
          ? "border-[#2E5A36] ring-1 ring-[#2E5A36]/10"
          : "border-stone-200 hover:border-stone-300"
      }`}
    >
      {/* Header bar clickable to toggle collapse */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none bg-[#FDFDFD]"
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Rank Badge */}
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-extrabold shrink-0 ${
              index === 0
                ? "bg-[#2E5A36] text-white"
                : "bg-stone-150 text-stone-600 border border-stone-250"
            }`}
          >
            {index + 1}
          </span>

          <div className="min-w-0">
            <span className="text-[10px] text-[#2E5A36] font-extrabold uppercase tracking-wide block">
              추천 조합 #{index + 1}
            </span>
            <h4 className="text-sm font-bold text-stone-900 truncate mt-0.5">
              {pairing.perfume1.name} × <span className="text-[#2E5A36]">{pairing.perfume2.name}</span>
            </h4>
          </div>
        </div>

        {/* Score and actions in header */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs font-serif font-extrabold text-[#2E5A36] block">
              {pairing.matchScore}점
            </span>
            <span className="text-[9px] text-stone-400 block font-mono">COHESION</span>
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {/* Quick favoriting */}
            <button
              onClick={() => onSaveFavorite(pairing)}
              disabled={isSaved}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isSaved
                  ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                  : "bg-white border-stone-200 text-stone-500 hover:text-stone-800 hover:bg-stone-100"
              }`}
              title={isSaved ? "보관됨" : "조합 보관함에 담기"}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-emerald-700 text-[#2E5A36]" : ""}`} />
            </button>

            {/* Quick Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              title="클립보드 복사"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#2E5A36]" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="text-stone-400 p-0.5">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-stone-100 bg-[#FDFDFD] space-y-4">
          {/* Heuristic / AI analysis statement */}
          <div className="p-3.5 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-1 text-xs">
            <span className="font-extrabold text-stone-500 text-[9px] tracking-wider uppercase block font-mono">
              OLFACTIVE SYNTHESIS ANALYSIS
            </span>
            <p className="text-stone-600 leading-relaxed font-sans font-medium">
              {pairing.reason}
            </p>
          </div>

          {/* Core Perfume Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-stone-150 relative space-y-1">
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block font-mono">PART A (고정 앵커)</span>
              <span className="text-xs font-extrabold text-stone-800 block">{pairing.perfume1.brand} {pairing.perfume1.name}</span>
              <div className="flex flex-wrap gap-1 pt-1">
                {pairing.perfume1.scentFamily.map((f, i) => (
                  <span key={i} className="text-[9px] bg-stone-50 text-stone-500 rounded border border-stone-200/50 px-1.5 py-0.5">
                    {f}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 bg-white rounded-xl border border-stone-150 relative space-y-1">
              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider block font-mono">PART B (매칭 보유향수)</span>
              <span className="text-xs font-extrabold text-[#2E5A36] block">{pairing.perfume2.brand} {pairing.perfume2.name}</span>
              <div className="flex flex-wrap gap-1 pt-1">
                {pairing.perfume2.scentFamily.map((f, i) => (
                  <span key={i} className="text-[9px] bg-stone-50 text-stone-500 rounded border border-stone-200/50 px-1.5 py-0.5">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Spraying guide timeline */}
          <div className="space-y-3 pt-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2E5A36] block font-mono">
              TIMED SPRAYING TIMELINE
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              {/* Step 1 */}
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1 shadow-3xs">
                <span className="text-[9px] font-bold text-[#2E5A36] font-mono block">1단계. 베이스 하부 안착</span>
                <span className="font-extrabold text-stone-800 block truncate leading-tight">{pairing.sprayingProtocol.basePerfume}</span>
                <p className="text-[11px] text-stone-500 font-medium">
                  <strong>{pairing.sprayingProtocol.baseLocation}</strong> 부위에 <strong>{pairing.sprayingProtocol.basePumps}회</strong> 펌프 분사.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1 shadow-3xs">
                <span className="text-[9px] font-bold text-stone-400 font-mono block flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#2E5A36]" />
                  시간 딜레이 대기
                </span>
                <span className="font-extrabold text-stone-800 block">{pairing.sprayingProtocol.delayMinutes}분 동안 휴지기</span>
                <p className="text-[11px] text-stone-500 font-medium leading-relaxed">
                  손목을 마찰하지 않고, 피부 온도에 고정 오일들이 연출될 여유를 허락합니다.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-1 shadow-3xs">
                <span className="text-[9px] font-bold text-amber-700 font-mono block">2단계. 상부 탑 톤 얹기</span>
                <span className="font-extrabold text-stone-800 block truncate leading-tight">{pairing.sprayingProtocol.topPerfume}</span>
                <p className="text-[11px] text-stone-500 font-medium">
                  <strong>{pairing.sprayingProtocol.topLocation}</strong> 부근에 가볍게 <strong>{pairing.sprayingProtocol.topPumps}회</strong> 무화 분사.
                </p>
              </div>
            </div>

            {/* Specialist Tip Bar */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-150 text-[11px] text-stone-700 italic font-medium flex gap-2">
              <Droplet className="w-4 h-4 text-[#2E5A36] shrink-0 mt-0.5" />
              <span>
                <strong className="text-stone-800 not-italic font-bold font-mono text-[10px] mr-1.5 bg-stone-200/60 px-1 py-0.5 rounded">MASTER TIP</strong>
                "{pairing.sprayingProtocol.tip}"
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default function MainDashboard({
  myPerfumes,
  favorites,
  onSaveFavorite,
  onAddLog,
  onNavigateToTab
}: MainDashboardProps) {
  // Filters state
  const [targetPerfumeId, setTargetPerfumeId] = useState<string>("");
  const [tpoConcept, setTpoConcept] = useState<string>("상관없음");
  const [tpoStyle, setTpoStyle] = useState<string>("상관없음");
  const [tpoPlace, setTpoPlace] = useState<string>("상관없음");
  const [tpoTarget, setTpoTarget] = useState<string>("상관없음");
  const [weather, setWeather] = useState<string>("상관없음");

  // Custom user input text states
  const [customConcept, setCustomConcept] = useState<string>("");
  const [customStyle, setCustomStyle] = useState<string>("");
  const [customPlace, setCustomPlace] = useState<string>("");
  const [customTarget, setCustomTarget] = useState<string>("");

  // Search and custom dropdown states for Anchor
  const [anchorSearch, setAnchorSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [calcLoading, setCalcLoading] = useState(false);
  const [recommendationResult, setRecommendationResult] = useState<RecommendResponse & { source?: string } | null>(null);
  const [recommendationResultList, setRecommendationResultList] = useState<(RecommendResponse & { source?: string })[] | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeHighlight, setActiveHighlight] = useState<string | null>(null);

  // Sync anchor search description with selected targetPerfumeId
  useEffect(() => {
    if (targetPerfumeId && myPerfumes.length > 0) {
      const selected = myPerfumes.find((p) => p.id === targetPerfumeId);
      if (selected) {
        setAnchorSearch(`[${selected.brand}] ${selected.name}`);
      }
    } else if (!targetPerfumeId) {
      setAnchorSearch("");
    }
  }, [targetPerfumeId, myPerfumes]);

  const triggerRecommend = async () => {
    if (myPerfumes.length === 0) {
      setErrorMessage("내 옷장에 담긴 실물 향수가 최소 1개 이상 존재해야 조화로운 조합을 찾을 수 있습니다.");
      return;
    }
    setErrorMessage(null);
    setCalcLoading(true);
    setRecommendationResult(null);
    setRecommendationResultList(null);

    const finalConcept = tpoConcept === "custom" ? (customConcept.trim() || "상관없음") : tpoConcept;
    const finalStyle = tpoStyle === "custom" ? (customStyle.trim() || "상관없음") : tpoStyle;
    const finalPlace = tpoPlace === "custom" ? (customPlace.trim() || "상관없음") : tpoPlace;
    const finalTarget = tpoTarget === "custom" ? (customTarget.trim() || "상관없음") : tpoTarget;

    // 1. If anchor is selected, calculate all combinations relative to that anchor and output the full list
    if (targetPerfumeId) {
      setTimeout(() => {
        try {
          const anchor = myPerfumes.find((p) => p.id === targetPerfumeId);
          if (!anchor) {
            throw new Error("지정한 앵커 향수를 찾을 수 없습니다.");
          }

          const otherPerfumes = myPerfumes.filter((p) => p.id !== targetPerfumeId);
          if (otherPerfumes.length === 0) {
            throw new Error(
              "앵커 향수 외에 내 옷장에 다른 향수가 보관되어 있지 않습니다. 최소 2개 이상의 향수를 보관하셔야 앵커 기반 레이어링 매칭이 가능합니다."
            );
          }

          const calculatedList = otherPerfumes
            .map((p) => {
              const localRes = calculateLocalLayeringScore(anchor, p, {
                concept: finalConcept,
                style: finalStyle,
                place: finalPlace,
                target: finalTarget,
                weather
              });
              return {
                layeringName: `오늘의 앵커 매칭 [ ${anchor.name} × ${p.name} ]`,
                perfume1: anchor,
                perfume2: p,
                matchScore: localRes.score,
                reason: localRes.reason,
                sprayingProtocol: localRes.protocol,
                source: "local_heuristic"
              };
            })
            // Sort matches from highest score to lowest
            .sort((a, b) => b.matchScore - a.matchScore);

          setRecommendationResultList(calculatedList);

          // Save search in audit log
          if (calculatedList.length > 0) {
            onAddLog({
              id: `log_${Date.now()}`,
              perfumeId1: calculatedList[0].perfume1.id,
              perfumeId2: calculatedList[0].perfume2.id,
              tpoConcept: finalConcept,
              tpoStyle: finalStyle,
              tpoPlace: finalPlace,
              tpoTarget: finalTarget,
              weather,
              sprayedAt: new Date().toISOString()
            });
          }
        } catch (e: any) {
          setErrorMessage(e.message || "매칭 리스트를 생성하는 도중 오류가 발생했습니다.");
        } finally {
          setCalcLoading(false);
        }
      }, 750); // Fluid tactile timeout feel
    } else {
      // 2. Open-ended selection: Ask backend API (Gemini or heuristic fallback)
      try {
        const response = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetPerfumeId: undefined,
            myPerfumes,
            tpoConcept: finalConcept,
            tpoStyle: finalStyle,
            tpoPlace: finalPlace,
            tpoTarget: finalTarget,
            weather
          })
        });

        if (!response.ok) {
          throw new Error("서버와의 통신에 문제가 생겼습니다.");
        }

        const data = await response.json();
        setRecommendationResult(data);

        onAddLog({
          id: `log_${Date.now()}`,
          perfumeId1: data.perfume1.id,
          perfumeId2: data.perfume2.id,
          tpoConcept: finalConcept,
          tpoStyle: finalStyle,
          tpoPlace: finalPlace,
          tpoTarget: finalTarget,
          weather,
          sprayedAt: new Date().toISOString()
        });
      } catch (e: any) {
        setErrorMessage(e.message || "추천 결과를 불러오는 데 실패했습니다. 다시 한번 시도해 주세요.");
      } finally {
        setCalcLoading(false);
      }
    }
  };

  // Check if current layering combo is already favorited
  const checkIsSaved = () => {
    if (!recommendationResult) return false;
    return favorites.some(
      (f) =>
        (f.perfumeId1 === recommendationResult.perfume1.id && f.perfumeId2 === recommendationResult.perfume2.id) ||
        (f.perfumeId1 === recommendationResult.perfume2.id && f.perfumeId1 === recommendationResult.perfume1.id)
    );
  };

  const checkIsItemSaved = (item: any) => {
    return favorites.some(
      (f) =>
        (f.perfumeId1 === item.perfume1.id && f.perfumeId2 === item.perfume2.id) ||
        (f.perfumeId1 === item.perfume2.id && f.perfumeId2 === item.perfume1.id)
    );
  };

  // Highlight elements dynamically when visual cards are clicked
  const triggerHighlight = (key: string) => {
    setActiveHighlight(key);
    setTimeout(() => {
      setActiveHighlight(null);
    }, 2000);

    let targetId = "";
    if (key === "weather") targetId = "weather-select-section";
    else if (key === "place") targetId = "place-select-section";
    else if (key === "concept") targetId = "concept-select-section";

    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto text-stone-800 break-keep pb-10">
      {/* Visual Header - Luxury minimalist style */}
      <div className="bg-white border border-stone-200/60 p-5 rounded-2xl shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 bg-[#FBFBFA] text-[#2D4A3E] rounded border border-stone-200 font-mono">
            INTELLIGENT SCENT MIX ARCHIVE
          </span>
          <h2 className="text-xl font-serif font-semibold text-[#1A1A1A] tracking-wide">
            오늘의 레이어링 조합 추천
          </h2>

          {/* Minimalist Situation Selection Filter Cards */}
          <div className="grid grid-cols-3 gap-3 pt-4 max-w-xl">
            <button
              onClick={() => triggerHighlight("weather")}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-2 bg-brand-bg/40 border border-brand-sub/20 hover:border-[#2D4A3E] hover:bg-white rounded-2xl transition-all duration-200 cursor-pointer text-center group active:scale-95 shadow-2xs"
            >
              <span className="text-sm group-hover:scale-110 transition-transform">🌤️</span>
              <span className="text-[11px] font-bold text-brand-sub group-hover:text-[#2D4A3E] font-sans">오늘의 날씨</span>
            </button>
            <button
              onClick={() => triggerHighlight("place")}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-2 bg-brand-bg/40 border border-brand-sub/20 hover:border-[#2D4A3E] hover:bg-white rounded-2xl transition-all duration-200 cursor-pointer text-center group active:scale-95 shadow-2xs"
            >
              <span className="text-sm group-hover:scale-110 transition-transform">📍</span>
              <span className="text-[11px] font-bold text-brand-sub group-hover:text-[#2D4A3E] font-sans">목적지/장소</span>
            </button>
            <button
              onClick={() => triggerHighlight("concept")}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 py-3 px-2 bg-brand-bg/40 border border-brand-sub/20 hover:border-[#2D4A3E] hover:bg-white rounded-2xl transition-all duration-200 cursor-pointer text-center group active:scale-95 shadow-2xs"
            >
              <span className="text-sm group-hover:scale-110 transition-transform">👔</span>
              <span className="text-[11px] font-bold text-brand-sub group-hover:text-[#2D4A3E] font-sans">옷차림 무드</span>
            </button>
          </div>
        </div>
      </div>

      {myPerfumes.length === 0 ? (
        /* Empty Wardrobe Notification Box */
        <div className="bg-white border border-stone-200/60 p-12 rounded-2xl shadow-xs text-center space-y-4 max-w-3xl mx-auto">
          <div className="w-12 h-12 bg-[#2D4A3E]/10 text-[#2D4A3E] rounded-full flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-brand-text font-serif">보유하신 향수를 먼저 보관해 주세요</h3>
            <p className="text-xs text-brand-sub max-w-md mx-auto leading-relaxed font-medium">
              ScentWeave 레이어링 처방기는 회원님의 실제 소장 향수들 중 최적의 궁합을 계산합니다.
              '보유 향수' 탭에서 단 1개라도 소지하신 제품을 등록하시면 은은하고 격조 높은 추천을 바로 받으실 수 있습니다.
            </p>
          </div>
          <button
            onClick={() => onNavigateToTab?.("wardrobe")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2D4A3E] hover:bg-[#1E352F] text-white text-xs font-bold rounded-full transition-all shadow-xs cursor-pointer"
          >
            보유 향수 등록하러 가기
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Interactive Form & Result layout side by side elegantly */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Hand: Style Formulation Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-stone-200/60 p-6 rounded-2xl shadow-xs space-y-5 text-stone-800">
              <h3 className="text-xs font-extrabold tracking-wider uppercase text-brand-sub flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#2D4A3E]" />
                원하는 스타일 선택하기
              </h3>

              <div className="space-y-4">
                {/* UPGRADE: Top Highlight Scent Anchor Selector block */}
                <div className="space-y-3 bg-stone-50/50 p-4 rounded-xl border border-stone-200/80">
                  <div className="space-y-1">
                    <label className="block text-xs text-stone-700 font-extrabold flex items-center gap-1.5">
                      <Anchor className="w-3.5 h-3.5 text-[#2D4A3E]" />
                      오늘 어떤 향수를 꼭 뿌리고 싶으신가요?
                    </label>
                    <p className="text-[10px] text-stone-550 leading-relaxed font-sans font-medium">
                      지정하신 향수를 기본 앵커로 고정하고, 그 향기와 최고 시너지를 내는 소장 목록 조합 리스트를 순서대로 계산합니다.
                    </p>
                  </div>

                  {/* Search input with Custom Dropdown suggestions */}
                  <div className="relative">
                    <div className="flex items-center bg-white border border-stone-200 rounded-xl px-3 py-2.5 focus-within:border-[#2D4A3E] focus-within:ring-1 focus-within:ring-[#2D4A3E]/30 transition-all shadow-3xs">
                      <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={anchorSearch}
                        onChange={(e) => {
                          setAnchorSearch(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        onFocus={() => setIsDropdownOpen(true)}
                        placeholder="소장 향수 이름 또는 브랜드 검색 앵커 고정..."
                        className="w-full bg-transparent text-xs text-stone-800 placeholder-stone-400 focus:outline-none font-medium"
                      />
                      {targetPerfumeId ? (
                        <button
                          type="button"
                          onClick={() => {
                            setTargetPerfumeId("");
                            setAnchorSearch("");
                            setIsDropdownOpen(false);
                          }}
                          className="text-stone-400 hover:text-stone-600 transition-colors p-0.5 cursor-pointer ml-1"
                          title="앵커 해제"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="text-stone-400 hover:text-stone-600 transition-colors p-0.5 cursor-pointer ml-1"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Custom Dropdown */}
                    {isDropdownOpen && (
                      <div className="absolute z-30 left-0 right-0 mt-1.5 max-h-52 overflow-y-auto bg-white border border-stone-200 rounded-xl shadow-lg text-xs">
                        <div className="p-2 border-b border-stone-100 bg-stone-50/80 font-bold text-stone-400 text-[9px] tracking-wider uppercase font-mono flex justify-between items-center">
                          <span>내 컬렉션 소장 향수 ({myPerfumes.length})</span>
                          <button
                            onClick={() => setIsDropdownOpen(false)}
                            className="text-[#2D4A3E] hover:underline cursor-pointer"
                          >
                            [ 닫기 ]
                          </button>
                        </div>

                        {/* Free recommendation option */}
                        <button
                          type="button"
                          onClick={() => {
                            setTargetPerfumeId("");
                            setAnchorSearch("");
                            setIsDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2.5 border-b border-stone-100 text-[#2D4A3E] font-bold hover:bg-stone-50 transition-colors"
                        >
                          ✨ 백지상태에서 전체 보유 목록 매칭 (고정 없음)
                        </button>

                        {myPerfumes
                          .filter((p) => {
                            if (!anchorSearch || anchorSearch.startsWith("[")) return true;
                            const term = anchorSearch.toLowerCase();
                            return (
                              p.brand.toLowerCase().includes(term) ||
                              p.name.toLowerCase().includes(term) ||
                              p.scentFamily.some((fam) => fam.toLowerCase().includes(term))
                            );
                          })
                          .map((p) => (
                            <button
                              key={p.id}
                              type="button"
                              onClick={() => {
                                setTargetPerfumeId(p.id);
                                setIsDropdownOpen(false);
                              }}
                              className={`w-full text-left px-3.5 py-2.5 hover:bg-stone-50 transition-all flex items-center justify-between border-b border-stone-100/50 last:border-none ${
                                targetPerfumeId === p.id
                                  ? "bg-stone-50 font-extrabold text-[#2D4A3E]"
                                  : "text-stone-700"
                              }`}
                            >
                              <div>
                                <span className="font-extrabold text-[9px] text-[#2D4A3E] uppercase block font-mono">
                                  {p.brand}
                                </span>
                                <span className="font-semibold text-xs text-stone-900 block mt-0.5">
                                  {p.name}
                                </span>
                              </div>
                              <div className="flex gap-1">
                                {p.scentFamily.slice(0, 2).map((fam, i) => (
                                  <span
                                    key={i}
                                    className="text-[9px] bg-stone-100 border border-stone-200/60 rounded px-1.5 py-0.5 text-stone-600 font-sans"
                                  >
                                    {fam}
                                  </span>
                                ))}
                              </div>
                            </button>
                          ))}

                        {myPerfumes.filter((p) => {
                          if (!anchorSearch || anchorSearch.startsWith("[")) return true;
                          const term = anchorSearch.toLowerCase();
                          return (
                            p.brand.toLowerCase().includes(term) ||
                            p.name.toLowerCase().includes(term) ||
                            p.scentFamily.some((fam) => fam.toLowerCase().includes(term))
                          );
                        }).length === 0 && (
                          <div className="p-4 text-center text-stone-400 font-medium">
                            필터와 일치하는 소장 향수가 없습니다.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Tactile Tag list below input to instantly choose anchor */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-stone-400 font-bold block uppercase font-mono">
                      QUICK TAP LOCK:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {myPerfumes.map((p) => {
                        const isSelected = targetPerfumeId === p.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setTargetPerfumeId("");
                              } else {
                                setTargetPerfumeId(p.id);
                              }
                              setIsDropdownOpen(false);
                            }}
                            className={`text-[10px] font-bold py-1 px-2.5 rounded-full border transition-all cursor-pointer ${
                              isSelected
                                ? "bg-[#2D4A3E] text-white border-[#2D4A3E] shadow-3xs"
                                : "bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50"
                            }`}
                          >
                            {p.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* TPO Mood (기분 / 분위기) filters */}
                <div
                  id="concept-select-section"
                  className={`space-y-2 p-1.5 rounded-xl transition-all duration-300 ${
                    activeHighlight === "concept" ? "ring-2 ring-brand-point/40 bg-brand-bg/50" : ""
                  }`}
                >
                  <label className="block text-xs text-brand-text font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#2D4A3E]" />
                    오늘의 기분 / 분위기 (Mood)
                  </label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none snap-x touch-pan-x">
                    {[
                      { label: "상관없음", value: "상관없음" },
                      { label: "차분함/정적🌿", value: "차분함 / 정적인 / 리프레시가 필요한" },
                      { label: "생기/활발⚡", value: "생기 넘치는 / 활발한 / 에너제틱" },
                      { label: "성숙/매혹💋", value: "성숙한 / 매혹적인 / 관능적인" },
                      { label: "포근/편안☁️", value: "포근한 / 편안한 / 힐링이 되는" },
                      { label: "시크/도도❄️", value: "시크한 / 도도한 / 차가운" },
                      { label: "몽환/신비🌌", value: "몽환적인 / 신비로운" },
                      { label: "[직접 입력] ✍️", value: "custom" }
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setTpoConcept(item.value)}
                        className={`text-[11px] font-bold py-1.5 px-3.5 rounded-full border transition-all cursor-pointer whitespace-nowrap snap-center shrink-0 ${
                          tpoConcept === item.value
                            ? "bg-[#2D4A3E] text-white border-[#2D4A3E] shadow-sm"
                            : "bg-brand-bg text-brand-sub border-stone-200 hover:border-brand-sub hover:bg-stone-100"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {tpoConcept === "custom" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <input
                          type="text"
                          value={customConcept}
                          onChange={(e) => setCustomConcept(e.target.value)}
                          placeholder="원하시는 기분이나 무드를 마음대로 적어주세요 (예: 비 내리는 오후의 커피솝)"
                          className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#2D4A3E] font-medium mt-1.5 shadow-3xs"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* TPO Style (옷차림 분위기) filters */}
                <div
                  id="style-select-section"
                  className={`space-y-2 p-1.5 rounded-xl transition-all duration-300 ${
                    activeHighlight === "style" ? "ring-2 ring-brand-point/40 bg-brand-bg/50" : ""
                  }`}
                >
                  <label className="block text-xs text-brand-text font-bold flex items-center gap-1">
                    <Shirt className="w-3.5 h-3.5 text-[#2D4A3E]" />
                    오늘의 옷차림 분위기 (Style)
                  </label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none snap-x touch-pan-x">
                    {[
                      { label: "상관없음", value: "상관없음" },
                      { label: "미니멀🕶️", value: "미니멀 / 놈코어 (깔끔하고 군더더기 없는 스타일)" },
                      { label: "포멀💼", value: "포멀 / 비즈니스 수트 (격식 있고 단정한 출근룩)" },
                      { label: "클래식🏰", value: "클래식 / 올드머니 (고급스럽고 차분한 룩)" },
                      { label: "캐주얼👕", value: "캐주얼 / 데일리 (편안한 티셔츠나 셔츠룩)" },
                      { label: "스트릿🛹", value: "스트릿 / 힙한 (개성 있고 트렌디한 스타일)" },
                      { label: "페미닌🌸", value: "페미닌 / 로맨틱 (화사하고 부드러운 스타일)" },
                      { label: "아메카지🪵", value: "아메카지 / 워크웨어 (빈티지하고 묵직한 스타일)" },
                      { label: "[직접 입력] ✍️", value: "custom" }
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => setTpoStyle(item.value)}
                        className={`text-[11px] font-bold py-1.5 px-3.5 rounded-full border transition-all cursor-pointer whitespace-nowrap snap-center shrink-0 ${
                          tpoStyle === item.value
                            ? "bg-[#2D4A3E] text-white border-[#2D4A3E] shadow-sm"
                            : "bg-brand-bg text-brand-sub border-stone-200 hover:border-brand-sub hover:bg-stone-100"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <AnimatePresence>
                    {tpoStyle === "custom" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <input
                          type="text"
                          value={customStyle}
                          onChange={(e) => setCustomStyle(e.target.value)}
                          placeholder="착용하신 코디 분위기를 마음대로 적어주세요 (예: 가죽 재킷에 그런지 룩)"
                          className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#2D4A3E] font-medium mt-1.5 shadow-3xs"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Weather Filters */}
                <div
                  id="weather-select-section"
                  className={`space-y-2 p-1.5 rounded-xl transition-all duration-300 ${
                    activeHighlight === "weather" ? "ring-2 ring-brand-point/40 bg-[#2D4A3E]/5" : ""
                  }`}
                >
                  <label className="block text-xs text-brand-text font-bold flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-[#2D4A3E]" />
                    오늘의 날씨 / 계절
                  </label>
                  <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none snap-x touch-pan-x">
                    {["상관없음", "온화한 봄날", "무더운 여름", "쌀쌀한 가을", "시린 겨울", "비 오는 날"].map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setWeather(item)}
                        className={`text-[11px] font-bold py-1.5 px-3.5 rounded-full border transition-all cursor-pointer whitespace-nowrap snap-center shrink-0 ${
                          weather === item
                            ? "bg-[#2D4A3E] text-white border-[#2D4A3E] shadow-sm"
                            : "bg-brand-bg text-brand-sub border-stone-200 hover:border-brand-sub hover:bg-stone-100"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Place location settings */}
                <div
                  id="place-select-section"
                  className={`space-y-1.5 p-1.5 rounded-xl transition-all duration-300 ${
                    activeHighlight === "place" ? "ring-2 ring-brand-point/40 bg-brand-bg/50" : ""
                  }`}
                >
                  <label className="block text-xs text-brand-text font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#2D4A3E]" />
                    뿌리고 갈 목적지 / 장소
                  </label>
                  <select
                    value={tpoPlace}
                    onChange={(e) => setTpoPlace(e.target.value)}
                    className="w-full bg-brand-bg border border-stone-200 rounded-xl px-3.5 py-2.5 text-brand-text text-xs focus:outline-none focus:border-[#2D4A3E] focus:bg-white cursor-pointer font-medium"
                  >
                    <option value="상관없음">상관없음 / 선택 안 함</option>
                    <option value="조요한 오피스">조용한 사무실 실내</option>
                    <option value="로맨틱 야외 데이트">로맨틱 야외 데이트</option>
                    <option value="격식 있는 비즈니스 살롱">격식 있는 격식 파티/회의</option>
                    <option value="도심 속 갤러리 산책">도심 속 미술관/공원 산책</option>
                    <option value="혼자만의 차분한 북카페">혼자만의 조용한 북카페</option>
                    <option value="custom">[직접 입력]</option>
                  </select>
                  <AnimatePresence>
                    {tpoPlace === "custom" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <input
                          type="text"
                          value={customPlace}
                          onChange={(e) => setCustomPlace(e.target.value)}
                          placeholder="장소를 마음대로 입력해 주세요 (예: 한강 피크닉, 재즈바)"
                          className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#2D4A3E] font-medium mt-1.5 shadow-3xs"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 만나게 될 사람 */}
                <div className="space-y-1.5 p-1.5">
                  <label className="block text-xs text-brand-text font-bold flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#2D4A3E]" />
                    만날 사람 / 동석자
                  </label>
                  <select
                    value={tpoTarget}
                    onChange={(e) => setTpoTarget(e.target.value)}
                    className="w-full bg-brand-bg border border-stone-200 rounded-xl px-3.5 py-2.5 text-brand-text text-xs focus:outline-none focus:border-[#2D4A3E] focus:bg-white cursor-pointer font-medium"
                  >
                    <option value="상관없음">상관없음 / 선택 안 함</option>
                    <option value="연인">사랑하는 연인</option>
                    <option value="친구와 동료">편한 친구와 직장 동료</option>
                    <option value="비즈니스 클라이언트">중요한 일 관계자 / 고객</option>
                    <option value="혼자만의 시간">나 홀로 가지는 차분한 시간</option>
                    <option value="custom">[직접 입력]</option>
                  </select>
                  <AnimatePresence>
                    {tpoTarget === "custom" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <input
                          type="text"
                          value={customTarget}
                          onChange={(e) => setCustomTarget(e.target.value)}
                          placeholder="동석자를 마음대로 입력해 주세요 (예: 까다로운 직장 상사, 소개팅 주선자)"
                          className="w-full bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#2D4A3E] font-medium mt-1.5 shadow-3xs"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-red-600 bg-red-50 p-3.5 rounded-xl border border-red-200 font-medium">
                  {errorMessage}
                </p>
              )}

              <button
                onClick={triggerRecommend}
                disabled={calcLoading || myPerfumes.length === 0}
                className="w-full bg-[#2D4A3E] hover:bg-[#1E352F] text-white disabled:bg-stone-50 disabled:text-stone-400 font-bold text-sm py-3.5 px-4 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-xs border border-transparent"
              >
                {calcLoading ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin text-white" />
                    조화 시너지를 정밀 매칭하는 중...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#A3E635]" />
                    {targetPerfumeId ? "필수 포함 레이어링 처방기 작동" : "조합 레이어링 처방받기"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Hand: AI Recommendation or Heuristics List Results Zone */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {calcLoading && (
                <motion.div
                  key="loading-box"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-stone-200/60 rounded-2xl p-16 text-center flex flex-col items-center justify-center space-y-4 shadow-xs break-keep min-h-[400px]"
                >
                  <div className="w-10 h-10 rounded-full border-3 border-stone-100 border-t-[#2D4A3E] animate-spin" />
                  <h4 className="text-brand-text text-sm font-bold font-sans">최적의 향수 조합 분석 중...</h4>
                  <p className="text-brand-sub text-xs leading-relaxed max-w-sm font-medium font-sans">
                    소장하신 향수 리스트들의 오lf액티브 노트(탑/미들/베이스) 궁합 점수를 매칭하여 오늘 가시는 목적지와 옷차림 무드에 맞는 조향 설계를 완수하고 있습니다.
                  </p>
                </motion.div>
              )}

              {!calcLoading && !recommendationResult && !recommendationResultList && (
                <motion.div
                  key="idle-box"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white border border-stone-200/60 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4 shadow-xs min-h-[460px]"
                >
                  <div className="w-14 h-14 bg-brand-bg text-[#2D4A3E] rounded-full flex items-center justify-center border border-stone-150 shadow-2xs">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-brand-text text-sm font-bold font-serif font-semibold">
                      나만의 시그니처 향 매칭 대기 중
                    </h4>
                    <p className="text-brand-sub text-xs leading-relaxed max-w-sm font-medium font-sans mx-auto">
                      왼쪽에서 오늘 꼭 뿌릴 앵커 향수 또는 나갈 목적지의 날씨와 무드를 지정하고 처방을 내려보세요.
                      가장 아름다운 페어 시너지를 찾아 매칭합니다.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* UPGRADE DISPLAY 1: Anchor-centric result list ("쫘라락" 정렬 리스트 출력) */}
              {!calcLoading && recommendationResultList && (
                <motion.div
                  key="list-results-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Scent Anchor Matching Metrics Dashboard Header */}
                  <div className="bg-[#2E5A36]/5 p-5 rounded-2xl border border-[#2E5A36]/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2E5A36] animate-pulse" />
                        <span className="text-[10px] tracking-wider uppercase font-extrabold text-[#2E5A36] font-mono">
                          ANCHOR-CENTRIC SCENT FINDER
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 font-sans tracking-tight">
                        고정 앵커 : <span className="text-[#2E5A36] underline font-extrabold font-serif">"{myPerfumes.find(p => p.id === targetPerfumeId)?.name}"</span> 조합 결과 리스트
                      </h4>
                      <p className="text-[11px] text-stone-600 leading-normal font-sans font-medium">
                        지정하신 핵심 향수가 반드시 포함된 상태에서, 내 옷장의 다른 향수들과의 어울림 만족 지수를 정렬하여 매칭 조합을 연출했습니다.
                      </p>
                    </div>

                    {/* Intuitive Matchmaking Algorithm Indicator (User Spec: Algorithm Info) */}
                    <div className="bg-white/90 px-3 py-2 border border-stone-200 shadow-3xs text-[10px] text-stone-500 font-mono font-medium rounded-xl shrink-0 self-stretch flex flex-col justify-center max-w-[200px]">
                      <span className="font-extrabold text-stone-700 flex items-center gap-1 mb-1 text-[11px]">
                        <Info className="w-3.5 h-3.5 text-[#2E5A36]" />
                        알고리즘 배점 법칙
                      </span>
                      점수 = 기본 어울림(75) <br />
                      + 향조 시너지(+12~18) <br />
                      + 복장/TPO 피팅(+4) <br />
                      + 날씨/계절 지수(+5) <br />
                      - 향조 중복 대조 감점(-10)
                    </div>
                  </div>

                  {/* List of pairings */}
                  <div className="space-y-4">
                    {recommendationResultList.map((pairing, idx) => (
                      <PairingItemCard
                        key={pairing.perfume2.id}
                        pairing={pairing}
                        index={idx}
                        onSaveFavorite={onSaveFavorite}
                        isSaved={checkIsItemSaved(pairing)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* STANDARD DISPLAY: Single open-ended supreme recommendation (No anchor) */}
              {!calcLoading && recommendationResult && (
                <LayeringResultCard
                  key="result-card"
                  result={recommendationResult}
                  onSaveFavorite={onSaveFavorite}
                  isSaved={checkIsSaved()}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
