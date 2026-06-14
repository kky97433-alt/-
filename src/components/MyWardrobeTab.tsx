import React, { useState } from "react";
import { Plus, Search, Trash, Sparkles } from "lucide-react";
import { Perfume } from "../types";
import { MASTER_PERFUMES } from "../data";

interface MyWardrobeTabProps {
  myPerfumes: Perfume[];
  onAddPerfume: (p: Perfume) => void;
  onRemovePerfume: (pId: string) => void;
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
  onAddPerfume,
  onRemovePerfume
}: MyWardrobeTabProps) {
  const [searchCatalogQuery, setSearchCatalogQuery] = useState("");

  const filteredCatalog = MASTER_PERFUMES.filter(p => {
    const isAlreadyOwned = myPerfumes.some(owned => owned.id === p.id);
    const searchString = `${p.brand} ${p.name} ${p.scentFamily.join(" ")}`.toLowerCase();
    return !isAlreadyOwned && searchString.includes(searchCatalogQuery.toLowerCase());
  });

  const handleQuickAddClick = () => {
    const searchInput = document.getElementById("wardrobe-catalog-search");
    if (searchInput) {
      searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
      searchInput.focus();
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
        {/* Left Hand: Wardrobe Glass Dressroom Area (Grid of owned bottles) - 7 Columns for better beauty list spacing */}
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
                {myPerfumes.map(per => (
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
                      <span className="text-[10px] text-brand-sub font-bold block uppercase tracking-wider">{per.brand}</span>
                      <h4 className="text-xs font-bold text-brand-text truncate px-1" title={per.name}>
                        {per.name}
                      </h4>
                      {/* Family Badges */}
                      <div className="flex flex-wrap justify-center gap-1 pt-1.5 opacity-80">
                        {per.scentFamily.slice(0, 2).map((fam, idx) => (
                          <span key={idx} className="text-[8px] font-bold px-1 py-0.2 bg-stone-100 text-stone-600 rounded">
                            {fam}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Hand: Full Catalog Library list (5 columns for beautiful bento box visual layout) */}
        <div className="lg:col-span-5 space-y-6">
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
                placeholder="브랜드 또는 향수 이름 검색..."
                className="w-full bg-brand-bg/50 border border-stone-200 rounded-xl pl-10 pr-3.5 py-3 text-stone-850 text-xs focus:outline-none focus:border-brand-point focus:bg-white transition-all font-sans"
              />
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredCatalog.length === 0 ? (
                <div className="p-8 text-center text-brand-sub border border-dashed border-stone-150 rounded-2xl">
                  <p className="text-xs font-medium">일치하는 향수가 더 없습니다.</p>
                  <p className="text-[10px] text-stone-400 mt-1">이미 모두 추가하셨거나 다른 키워드로 기재해 주세요.</p>
                </div>
              ) : (
                filteredCatalog.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onAddPerfume(p);
                      setSearchCatalogQuery("");
                    }}
                    className="w-full text-left flex items-center justify-between p-3.5 rounded-xl bg-brand-bg/25 hover:bg-brand-bg/75 border border-stone-150 hover:border-brand-sub shadow-2xs transition-all duration-200 cursor-pointer group"
                  >
                    <div className="min-w-0 pr-1.5">
                      <span className="text-[9px] text-brand-point block leading-none font-bold uppercase tracking-wider mb-1">{p.brand}</span>
                      <span className="text-xs font-bold text-brand-text truncate block">{p.name}</span>
                      <span className="text-[10px] text-brand-sub block mt-0.5 font-sans truncate">({p.scentFamily.join(", ")})</span>
                    </div>
                    <span className="p-2 rounded-lg bg-white text-brand-sub group-hover:text-white group-hover:bg-brand-point transition-all border border-stone-200 pointer-events-none self-center shrink-0">
                      <Plus className="w-4 h-4" />
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
