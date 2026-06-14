import React, { useState } from "react";
import { Plus, Search, Trash, Sparkles } from "lucide-react";
import { Perfume } from "../types";

interface MyWardrobeTabProps {
  myPerfumes: Perfume[];
  catalog: Perfume[];
  onAddPerfume: (p: Perfume) => void;
  onRemovePerfume: (pId: string) => void;
  onRefreshCatalog: () => void;
}

// Beautiful minimalist perfume bottle silhouette vector helper
const PerfumeBottleIcon = ({ color = "#2D4A3E" }: { color?: string }) => (
  <svg viewBox="0 0 100 100" className="w-12 h-12 mx-auto filter drop-shadow-[0_2px_4px_rgba(45,74,62,0.1)]" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cap */}
    <rect x="42" y="16" width="16" height="12" rx="3" fill={color} fillOpacity="0.85" />
    <rect x="47" y="12" width="6" height="4" rx="1" fill={color} fillOpacity="0.4" />
    {/* Neck */}
    <rect x="46" y="28" width="8" height="6" fill="#D6D3D1" />
    {/* Bottle Body */}
    <rect x="25" y="34" width="50" height="50" rx="12" stroke={color} strokeWidth="2.5" fill="white" />
    {/* Liquid inside */}
    <path d="M 27 60 Q 50 63, 73 60 L 73 78 Q 50 82, 27 78 Z" fill={color} fillOpacity="0.15" />
    {/* Label */}
    <rect x="35" y="46" width="30" height="24" rx="2" stroke={color} strokeWidth="1" fill="#FBFBFA" />
    <line x1="42" y1="54" x2="58" y2="54" stroke={color} strokeWidth="1.5" />
    <line x1="45" y1="60" x2="55" y2="60" stroke={color} strokeWidth="0.8" strokeDasharray="1 1" />
  </svg>
);

export default function MyWardrobeTab({
  myPerfumes,
  catalog,
  onAddPerfume,
  onRemovePerfume,
  onRefreshCatalog
}: MyWardrobeTabProps) {
  const [searchCatalogQuery, setSearchCatalogQuery] = useState("");

  // AI Auto-Registration States
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiBrand, setAiBrand] = useState("");
  const [aiName, setAiName] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiSuccessMessage, setAiSuccessMessage] = useState("");
  const [aiStatusText, setAiStatusText] = useState("");

  // Filter Catalog using the state-driven dynamically populated catalog
  const filteredCatalog = catalog.filter(p => {
    const isAlreadyOwned = myPerfumes.some(owned => owned.id === p.id);
    const searchString = `${p.brand} ${p.brandKor || ""} ${p.name} ${p.nameKor || ""} ${p.scentFamily.join(" ")}`.toLowerCase();
    return !isAlreadyOwned && searchString.includes(searchCatalogQuery.toLowerCase());
  });

  const handleQuickAddClick = () => {
    const searchInput = document.getElementById("wardrobe-catalog-search");
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      searchInput.focus();
    }
  };

  const handleAiRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiName.trim()) {
      setAiError("향수 이름을 입력해 주세요.");
      return;
    }

    setLoadingAi(true);
    setAiError("");
    setAiSuccessMessage("");

    const inputName = aiName.trim();
    const inputBrand = aiBrand.trim();
    const initialText = `AI가 전 세계 향수 도감에서 '${inputBrand ? inputBrand + " " : ""}${inputName}'의 노트를 분석하고 있습니다... (약 5~10초 소요)`;
    setAiStatusText(initialText);

    // Dynamic progressive logs rotating every 3.2 seconds
    const textInterval = setInterval(() => {
      setAiStatusText((prev) => {
        if (prev.includes("도감에서")) {
          return "글로벌 향수 아카이브에서 공식 성분(Top, Middle, Base Notes) 정보를 심층 탐색 중입니다...";
        } else if (prev.includes("아카이브에서")) {
          return "수집된 노트를 조합하여 고유 향조 매트릭스 및 설명글을 빌드하여 마스터 DB에 등록 중입니다...";
        } else {
          return "AI 심층 탐색 및 DB 색인 작업이 거의 마무리 단계입니다. 조금만 더 대기해 주세요...";
        }
      });
    }, 3200);

    try {
      console.log(`[MyWardrobeTab] Dispatching AI real-time search for Brand: "${inputBrand}", Name: "${inputName}"`);
      const res = await fetch("/api/perfumes/search-or-create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brand: aiBrand,
          name: aiName,
        }),
      });

      clearInterval(textInterval);

      if (!res.ok) {
        throw new Error("서버 연동에 실패했거나 응답이 일연 및 지연되고 있습니다.");
      }

      const data = await res.json();
      if (data.perfume) {
        const newPerfume = data.perfume;
        
        // 1. Refresh global catalog state in client
        await onRefreshCatalog();

        // 2. Automatically add newly generated perfume to library/wardrobe
        onAddPerfume(newPerfume);

        // 3. Reset form and provide exquisite success feedback
        setAiBrand("");
        setAiName("");
        setAiSuccessMessage(
          `✨ [${newPerfume.brandKor || newPerfume.brand}] ${newPerfume.nameKor || newPerfume.name} 향수가 마스터 DB에 실시간 등록 및 나의 옷장에 추가되었습니다!`
        );
        setTimeout(() => setAiSuccessMessage(""), 7000);
      } else {
        setAiError("추가 과정에서 수집된 향 정보를 가져오지 못했습니다. 다시 시도해 주세요.");
      }
    } catch (err: any) {
      clearInterval(textInterval);
      console.error("[MyWardrobeTab] Error on registering perfume through AI:", err);
      setAiError("실시간 AI 수집 중 타임아웃 또는 서버 에러가 발생했습니다. 잠시 후 재시도해 주세요.");
    } finally {
      setLoadingAi(false);
      setAiStatusText("");
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto break-keep pb-10">
      {/* Exquisite Header Garnish */}
      <div className="bg-white border border-stone-200/60 p-5 rounded-2xl shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] font-bold tracking-widest px-2.5 py-1 bg-[#FBFBFA] text-brand-point rounded border border-stone-200 font-mono">
            MY PERSONAL SCENT WARDROBE
          </span>
          <h2 className="text-xl font-serif font-semibold text-[#1A1A1A] tracking-wide">
            나의 고유한 보유 향수 컬렉션
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Hand: Wardrobe Glass Dressroom Area (Grid of owned bottles) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-stone-200/60 p-6 rounded-2xl shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-wide text-brand-text font-serif">
                  내 옷장 품목 <span className="text-brand-point font-mono font-bold">({myPerfumes.length})</span>
                </h3>
                <button
                  onClick={handleQuickAddClick}
                  className="p-1 rounded-full bg-[#2D4A3E]/10 text-brand-point hover:bg-brand-point hover:text-white transition-all cursor-pointer shadow-2xs"
                  title="새로운 향수 등록하러 가기"
                >
                  <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                </button>
              </div>
              <span className="text-[10px] text-brand-sub font-mono font-bold uppercase tracking-widest">My Wardrobe</span>
            </div>

            {myPerfumes.length === 0 ? (
              <div className="bg-brand-bg/40 p-12 rounded-2xl border border-dashed border-stone-200/80 text-center space-y-3.5">
                <p className="text-xs text-brand-sub font-semibold">
                  아직 등록한 향수가 없습니다. 
                </p>
                <p className="text-[11px] text-brand-sub/80 max-w-sm mx-auto font-sans leading-relaxed">
                  우측의 '전체 향수 도감'에서 브랜드나 이름을 검색하시어 플러스(+) 버튼 하나로 가볍게 보관해 보세요.
                </p>
                <button 
                  onClick={handleQuickAddClick}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white bg-brand-point px-4 py-2 rounded-full hover:bg-brand-point-hover transition-all"
                >
                  <Search className="w-3.5 h-3.5" />
                  첫 향수 등록해보기
                </button>
              </div>
            ) : (
              /* Beautiful Bottle Card Grid as requested */
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {myPerfumes.map(per => {
                  const displayBrand = per.brandKor ? `${per.brandKor} (${per.brand})` : per.brand;
                  const displayName = per.nameKor ? per.nameKor : per.name;
                  return (
                    <div
                      key={per.id}
                      className="bg-white border border-stone-200/80 p-4 rounded-2xl shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between relative group"
                    >
                      {/* Delete button from wardrobe list */}
                      <button
                        onClick={() => onRemovePerfume(per.id)}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white hover:bg-red-50 text-stone-400 hover:text-red-650 transition-colors cursor-pointer shrink-0 border border-stone-100 z-10"
                        title="내 옷장에서 삭제하기"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </button>

                      {/* Bottle Illustration Box */}
                      <div className="py-4 bg-brand-bg/50 rounded-xl mb-3 flex items-center justify-center transition-colors group-hover:bg-brand-bg">
                        <PerfumeBottleIcon color="#2D4A3E" />
                      </div>

                      {/* Meta information */}
                      <div className="space-y-1 min-w-0 text-center">
                        <span className="text-[9px] text-brand-sub font-bold block uppercase tracking-wider truncate mb-0.5" title={displayBrand}>
                          {displayBrand}
                        </span>
                        <h4 className="text-xs font-bold text-brand-text truncate px-1" title={`${per.brand} ${per.name}`}>
                          {displayName}
                        </h4>
                        {/* Family Badges */}
                        <div className="flex flex-wrap justify-center gap-1 pt-1.5 opacity-80">
                          {per.scentFamily.slice(0, 2).map((fam, idx) => (
                            <span key={idx} className="text-[8px] font-bold px-1.5 py-0.5 bg-stone-150 text-stone-600 rounded">
                              {fam}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Hand: Full Catalog Library list + AI Auto-Registration Wizard */}
        <div className="lg:col-span-5 space-y-6">
          {/* Catalog list card */}
          <div className="bg-white border border-stone-200/60 p-6 rounded-2xl shadow-xs space-y-5">
            <div className="space-y-1.5">
              <h3 className="text-sm font-bold tracking-wide text-brand-text font-serif">전체 향수 도감</h3>
              <p className="text-xs text-brand-sub leading-normal font-sans font-medium">
                가지고 계신 향수를 아래 실시간 카탈로그에서 찾아서 내 옷장에 간편하게 담아 보세요.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-brand-sub absolute left-3.5 top-3.5" />
              <input
                id="wardrobe-catalog-search"
                type="text"
                value={searchCatalogQuery}
                onChange={(e) => setSearchCatalogQuery(e.target.value)}
                placeholder="브랜드 또는 향수 명칭 검색..."
                className="w-full bg-brand-bg/50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-3 text-stone-850 text-xs focus:outline-none focus:border-brand-point focus:bg-white transition-all font-sans"
              />
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {filteredCatalog.length === 0 ? (
                <div className="p-8 text-center text-brand-sub border border-dashed border-stone-150 rounded-2xl">
                  <p className="text-xs font-medium">일치하는 미보유 향수가 없습니다.</p>
                  <p className="text-[10px] text-stone-400 mt-1">이미 모두 추가하셨거나 신제품/비메이저 품목일 수 있습니다.</p>
                </div>
              ) : (
                filteredCatalog.map(p => {
                  const displayBrand = p.brandKor ? `${p.brandKor} (${p.brand})` : p.brand;
                  const displayName = p.nameKor ? p.nameKor : p.name;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onAddPerfume(p);
                        setSearchCatalogQuery("");
                      }}
                      className="w-full text-left flex items-center justify-between p-3.5 rounded-xl bg-brand-bg/25 hover:bg-brand-bg/75 border border-stone-150 hover:border-brand-sub shadow-2xs transition-all duration-200 cursor-pointer group"
                    >
                      <div className="min-w-0 pr-1.5">
                        <span className="text-[8px] text-brand-point block leading-none font-bold uppercase tracking-wider mb-1 truncate">{displayBrand}</span>
                        <span className="text-xs font-bold text-brand-text truncate block">{displayName}</span>
                        <span className="text-[10px] text-brand-sub block mt-0.5 font-sans truncate">({p.scentFamily.join(", ")})</span>
                      </div>
                      <span className="p-2 rounded-lg bg-white text-brand-sub group-hover:text-white group-hover:bg-brand-point transition-all border border-stone-200 pointer-events-none self-center shrink-0">
                        <Plus className="w-4 h-4" />
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* AI Auto-Registration Wizard Card as specified in requirement 3 (Most Important!) */}
          <div className="bg-stone-50 border border-stone-250/80 p-5 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-stone-200">
              <Sparkles className="w-4 h-4 text-[#C19A5B] animate-pulse" />
              <h4 className="text-xs font-bold text-[#1A1A1A] font-serif uppercase tracking-wider">
                원하는 향수가 도감에 없나요? (AI 실시간 등록)
              </h4>
            </div>

            <p className="text-[11px] text-stone-600 leading-normal">
              찾으시는 특이 하우스 향수나 방금 갓 발매된 신상 향수가 도감에 없을 때, 브랜드명과 이름만 입력해주시면 
              <strong> 실시간 AI 검색 시스템(Web Grounding)</strong>이 작용하여 올바른 탑/미들/베이스 노트 정보를 수집해 
              마스터 DB에 영구 등록하고 즉시 옷장에 보관합니다.
            </p>

            {aiSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-250 p-3 rounded-lg text-[11px] text-emerald-800 leading-relaxed font-semibold">
                {aiSuccessMessage}
              </div>
            )}

            {aiError && (
              <div className="bg-red-55 border border-red-200 p-2.5 rounded-lg text-[10px] text-red-650 leading-relaxed font-semibold">
                ⚠️ {aiError}
              </div>
            )}

            <form onSubmit={handleAiRegister} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">브랜드명 (옵션)</label>
                  <input
                    type="text"
                    value={aiBrand}
                    onChange={(e) => setAiBrand(e.target.value)}
                    placeholder="예: Tom Ford"
                    disabled={loadingAi}
                    className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-[11px] focus:outline-none focus:border-brand-point transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-stone-500 uppercase tracking-wider">향수명 (필수)</label>
                  <input
                    type="text"
                    value={aiName}
                    onChange={(e) => setAiName(e.target.value)}
                    placeholder="예: Soliel Blanc"
                    disabled={loadingAi}
                    required
                    className="w-full bg-white border border-stone-200 rounded-lg p-2.5 text-[11px] focus:outline-none focus:border-brand-point transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingAi || !aiName.trim()}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-white transition-all flex flex-col items-center justify-center gap-2 ${
                  loadingAi 
                    ? "bg-stone-500 cursor-not-allowed border border-stone-400" 
                    : "bg-[#2D4A3E] hover:bg-[#1E332A] cursor-pointer"
                }`}
              >
                {loadingAi ? (
                  <div className="flex flex-col items-center gap-1.5 w-full">
                    <div className="flex items-center gap-2">
                      <svg className="animate-spin h-3.5 w-3.5 text-white shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="font-bold">실시간 향수 수집 및 분석 정보 등록 중</span>
                    </div>
                    <p className="text-[10px] md:text-[11px] text-white/90 font-medium font-sans text-center leading-relaxed bg-[#1E332A]/45 py-1.5 px-3 rounded-lg border border-white/5 w-full max-w-md">
                      {aiStatusText}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>실시간 향수 자동 확장 및 내 컬렉션 담기</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
