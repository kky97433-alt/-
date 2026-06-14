import React, { useState, useEffect } from "react";
import { Layers, Sparkles, Heart, Landmark, Compass, Award, Plus, Trash, Eye } from "lucide-react";
import { Perfume, FavoriteLayering, LayeringLog, RecommendResponse } from "./types";
import { MASTER_PERFUMES, INITIAL_USER_LIBRARY, INITIAL_FAVORITES } from "./data";
import MainDashboard from "./components/MainDashboard";
import BlindBuyAnalyzer from "./components/BlindBuyAnalyzer";
import MyWardrobeTab from "./components/MyWardrobeTab";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "wardrobe" | "analyzer" | "favorites">("dashboard");

  // 1. Load data safely with standard localstorage or defaults
  const [myPerfumes, setMyPerfumes] = useState<Perfume[]>([]);
  const [favorites, setFavorites] = useState<FavoriteLayering[]>([]);
  const [logs, setLogs] = useState<LayeringLog[]>([]);

  useEffect(() => {
    // 1-1. Initialize My Dressroom
    const savedWardrobe = localStorage.getItem("scent_weave_wardrobe");
    if (savedWardrobe) {
      try {
        setMyPerfumes(JSON.parse(savedWardrobe));
      } catch (e) {
        // Fallback default
        setMyPerfumesFromDefaults();
      }
    } else {
      setMyPerfumesFromDefaults();
    }

    // 1-2. Initialize Favorites
    const savedFavs = localStorage.getItem("scent_weave_favorites");
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        setFavorites(INITIAL_FAVORITES);
      }
    } else {
      setFavorites(INITIAL_FAVORITES);
    }

    // 1-3. Initialize Logs
    const savedLogs = localStorage.getItem("scent_weave_logs");
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        setLogs([]);
      }
    }
  }, []);

  const setMyPerfumesFromDefaults = () => {
    // Map initial library IDs to full Perfume object specs
    const defaults = INITIAL_USER_LIBRARY.map(lib => {
      const match = MASTER_PERFUMES.find(p => p.id === lib.perfumeId);
      return match;
    }).filter(p => !!p) as Perfume[];
    setMyPerfumes(defaults);
    localStorage.setItem("scent_weave_wardrobe", JSON.stringify(defaults));
  };

  // 2. Data Persistence methods
  const addPerfumeToLibrary = (perfume: Perfume) => {
    const updated = [...myPerfumes, perfume];
    setMyPerfumes(updated);
    localStorage.setItem("scent_weave_wardrobe", JSON.stringify(updated));
  };

  const removePerfumeFromLibrary = (id: string) => {
    const updated = myPerfumes.filter(p => p.id !== id);
    setMyPerfumes(updated);
    localStorage.setItem("scent_weave_wardrobe", JSON.stringify(updated));
  };

  const saveFavoriteLayering = (layering: RecommendResponse) => {
    // Check duplication
    const isDup = favorites.some(
      f =>
        (f.perfumeId1 === layering.perfume1.id && f.perfumeId2 === layering.perfume2.id) ||
        (f.perfumeId1 === layering.perfume2.id && f.perfumeId2 === layering.perfume1.id)
    );
    if (isDup) return;

    const newFav: FavoriteLayering = {
      id: `fav_${Date.now()}`,
      userId: "user_01",
      perfumeId1: layering.perfume1.id,
      perfumeId2: layering.perfume2.id,
      name: layering.layeringName,
      notes: layering.reason,
      addedAt: new Date().toISOString()
    };

    const updated = [newFav, ...favorites];
    setFavorites(updated);
    localStorage.setItem("scent_weave_favorites", JSON.stringify(updated));
  };

  const deleteFavorite = (id: string) => {
    const updated = favorites.filter(f => f.id !== id);
    setFavorites(updated);
    localStorage.setItem("scent_weave_favorites", JSON.stringify(updated));
  };

  const addLogEntry = (newLog: any) => {
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem("scent_weave_logs", JSON.stringify(updated));
  };

  // 3. Simple Analytics computation
  // Calculate dominant notes/scent families in favorited list
  const getDominantFamilies = () => {
    const familyCounts: Record<string, number> = {};
    let totalFamilies = 0;

    favorites.forEach(f => {
      const p1 = MASTER_PERFUMES.find(p => p.id === f.perfumeId1);
      const p2 = MASTER_PERFUMES.find(p => p.id === f.perfumeId2);

      [p1, p2].forEach(p => {
        if (!p) return;
        p.scentFamily.forEach(fam => {
          familyCounts[fam] = (familyCounts[fam] || 0) + 1;
          totalFamilies += 1;
        });
      });
    });

    return Object.entries(familyCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        count,
        percentage: totalFamilies ? Math.round((count / totalFamilies) * 100) : 0
      }));
  };

  const dominantFamilies = getDominantFamilies();

  return (
    <div 
      className="min-h-screen font-sans text-[#1A1A1A] pb-20 relative bg-brand-bg"
    >
      {/* Subtle Warm Texturing Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-stone-200/10 pointer-events-none" />

      {/* Upper Brand Garnish bar */}
      <header className="border-b border-stone-200/60 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo element: Vertical layout with exquisite spacing, ScentWeave only in English */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-brand-point flex items-center justify-center shadow-xs shrink-0">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-serif font-semibold tracking-[0.08em] text-brand-point leading-none">ScentWeave</h1>
              <span className="text-[10px] text-brand-sub tracking-[0.05em] font-sans font-medium uppercase mt-1">
                Niche Scent Layering Lab
              </span>
            </div>
          </div>

          {/* Luxury Tab Hover Navigation Bar - Capsules */}
          <nav className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-2 text-xs font-semibold py-2.5 px-5 rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === "dashboard" 
                  ? "bg-brand-point text-white shadow-md scale-[1.02]" 
                  : "text-brand-sub hover:text-brand-text hover:bg-stone-100"
              }`}
            >
              <Compass className="w-4 h-4" />
              오늘의 레이어링
            </button>
            <button
              onClick={() => setActiveTab("wardrobe")}
              className={`flex items-center gap-2 text-xs font-semibold py-2.5 px-5 rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === "wardrobe" 
                  ? "bg-brand-point text-white shadow-md scale-[1.02]" 
                  : "text-brand-sub hover:text-brand-text hover:bg-stone-100"
              }`}
            >
              <Layers className="w-4 h-4" />
              보유 향수
            </button>
            <button
              onClick={() => setActiveTab("analyzer")}
              className={`flex items-center gap-2 text-xs font-semibold py-2.5 px-5 rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === "analyzer" 
                  ? "bg-brand-point text-white shadow-md scale-[1.02]" 
                  : "text-brand-sub hover:text-brand-text hover:bg-stone-100"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              구매 만족도 예측
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex items-center gap-2 text-xs font-semibold py-2.5 px-5 rounded-full transition-all duration-200 cursor-pointer ${
                activeTab === "favorites" 
                  ? "bg-brand-point text-white shadow-md scale-[1.02]" 
                  : "text-brand-sub hover:text-brand-text hover:bg-stone-100"
              }`}
            >
              <Heart className="w-4 h-4" />
              내 취향 보관함
            </button>
          </nav>

          {/* User Avatar tag (Garnish) */}
          <div className="flex items-center gap-2.5">
            <span className="hidden sm:inline-block text-right">
              <span className="text-[11px] font-bold text-stone-800 block">kky97433</span>
              <span className="text-[9px] text-brand-point font-mono leading-none block font-semibold">PREMIUM MEMBER</span>
            </span>
            <div className="w-9 h-9 rounded-full bg-brand-point text-white flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              K
            </div>
          </div>
        </div>

        {/* Mobile Tab menu bar */}
        <div className="border-t border-stone-200/60 md:hidden w-full grid grid-cols-4 px-2 py-2 gap-1 bg-white/95 shrink-0">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`text-[11px] font-bold py-1.5 px-0.5 text-center rounded-lg transition-all duration-200 cursor-pointer truncate ${
              activeTab === "dashboard" ? "bg-brand-point text-white shadow-xs" : "text-brand-sub hover:text-brand-text hover:bg-stone-50"
            }`}
            title="오늘의 레이어링"
          >
            오늘의 조합
          </button>
          <button
            onClick={() => setActiveTab("wardrobe")}
            className={`text-[11px] font-bold py-1.5 px-0.5 text-center rounded-lg transition-all duration-200 cursor-pointer truncate ${
              activeTab === "wardrobe" ? "bg-brand-point text-white shadow-xs" : "text-brand-sub hover:text-brand-text hover:bg-stone-50"
            }`}
            title="보유 향수"
          >
            보유 향수
          </button>
          <button
            onClick={() => setActiveTab("analyzer")}
            className={`text-[11px] font-bold py-1.5 px-0.5 text-center rounded-lg transition-all duration-200 cursor-pointer truncate ${
              activeTab === "analyzer" ? "bg-brand-point text-white shadow-xs" : "text-brand-sub hover:text-brand-text hover:bg-stone-50"
            }`}
            title="구매 만족도 예측"
          >
            만족도 예측
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`text-[11px] font-bold py-1.5 px-0.5 text-center rounded-lg transition-all duration-200 cursor-pointer truncate ${
              activeTab === "favorites" ? "bg-brand-point text-white shadow-xs" : "text-brand-sub hover:text-brand-text hover:bg-stone-50"
            }`}
            title="내 취향 보관함"
          >
            취향 보관함
          </button>
        </div>
      </header>

      {/* Main Body container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-25">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="tab-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MainDashboard
                myPerfumes={myPerfumes}
                onAddPerfume={addPerfumeToLibrary}
                onRemovePerfume={removePerfumeFromLibrary}
                favorites={favorites}
                onSaveFavorite={saveFavoriteLayering}
                logs={logs}
                onAddLog={addLogEntry}
                onNavigateToTab={setActiveTab}
              />
            </motion.div>
          )}

          {activeTab === "wardrobe" && (
            <motion.div
              key="tab-wardrobe"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <MyWardrobeTab
                myPerfumes={myPerfumes}
                onAddPerfume={addPerfumeToLibrary}
                onRemovePerfume={removePerfumeFromLibrary}
              />
            </motion.div>
          )}

          {activeTab === "analyzer" && (
            <motion.div
              key="tab-analyzer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <BlindBuyAnalyzer myPerfumes={myPerfumes} favorites={favorites} />
            </motion.div>
          )}

          {activeTab === "favorites" && (
            <motion.div
              key="tab-favorites"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* Personalized analytical dashboard */}
              <div className="bg-white border border-stone-250/75 p-6 rounded-2xl shadow-xs relative overflow-hidden text-stone-800 break-keep">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-1.5 max-w-lg">
                    <span className="text-[10px] uppercase font-extrabold text-[#2E5A36] font-mono tracking-widest bg-stone-100 px-2 py-0.5 rounded-full">
                      My Taste Analytics
                    </span>
                    <h2 className="text-lg font-bold text-stone-900 tracking-tight break-keep">나의 향기 취향 분석표</h2>
                  </div>

                  {/* Stat block */}
                  <div className="p-4 bg-stone-850 text-white rounded-xl shadow-xs flex items-center gap-4 shrink-0 border border-stone-700">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                      <Award className="w-5.5 h-5.5 text-[#A3E635]" />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-300 leading-none block">보관된 추천 조합</span>
                      <strong className="text-md font-mono font-bold tracking-wider">{favorites.length}개</strong>
                      <span className="text-[9px] text-[#A3E635] block font-semibold">+ 내 취향 실시간 반영 중</span>
                    </div>
                  </div>
                </div>

                {/* Scent families list distribution - styled after minimalistic stat charts */}
                {favorites.length > 0 && dominantFamilies.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-5 mt-5 border-t border-stone-100">
                    {dominantFamilies.slice(0, 4).map((fam, i) => (
                      <div key={i} className="bg-stone-50/50 p-3.5 rounded-xl border border-stone-200/60 space-y-1.5 shadow-xs">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-stone-700">{fam.name}</span>
                          <span className="text-[#2E5A36] font-mono">{fam.percentage}%</span>
                        </div>
                        <div className="w-full bg-stone-200/50 h-1 rounded-full overflow-hidden">
                          <div className="bg-[#2E5A36] h-full rounded-full" style={{ width: `${fam.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Journal list area */}
              <div className="space-y-4">
                <h3 className="text-xs font-extrabold tracking-wider uppercase text-stone-500 pl-1">
                  내가 보관한 향수 조합 목록
                </h3>

                {favorites.length === 0 ? (
                  <div className="bg-white border border-stone-200 border-dashed rounded-2xl p-12 text-center text-stone-500 space-y-1 break-keep">
                    <p className="text-xs font-medium">아직 보관된 향수 조합이 없습니다.</p>
                    <p className="text-[11px] text-stone-400 font-sans">조합 실험실에서 어울리는 조합을 찾은 후 "조합 보관하기"를 선택해 보세요.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {favorites.map(fav => {
                      const p1 = MASTER_PERFUMES.find(p => p.id === fav.perfumeId1);
                      const p2 = MASTER_PERFUMES.find(p => p.id === fav.perfumeId2);

                      return (
                        <div
                          key={fav.id}
                          className="bg-white border border-stone-200 p-5 rounded-2xl flex flex-col justify-between hover:border-stone-400 transition-all shadow-xs group relative text-stone-800 break-keep"
                        >
                          <button
                            onClick={() => deleteFavorite(fav.id)}
                            className="absolute top-4 right-4 p-1.5 rounded-md bg-stone-50 hover:bg-red-50 text-stone-400 hover:text-red-650 transition-colors cursor-pointer border border-stone-200"
                            title="보관함에서 지우기"
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>

                          <div className="space-y-3">
                            <span className="text-[9px] tracking-wider font-mono text-[#2E5A36] uppercase leading-none block font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                              {new Date(fav.addedAt).toLocaleDateString()} 저장됨
                            </span>
                            <h4 className="text-sm font-bold text-stone-900 tracking-tight pr-6">{fav.name}</h4>

                            {p1 && p2 && (
                                <div className="flex items-center gap-2 text-[11px] font-mono text-stone-600 bg-stone-50 py-1 px-2 rounded-lg border border-stone-150">
                                  <span>{p1.brand} {p1.name}</span>
                                  <span className="text-stone-300">x</span>
                                  <span>{p2.brand} {p2.name}</span>
                                </div>
                              )}

                            <p className="text-xs text-stone-600 leading-relaxed font-medium pt-1 break-keep">
                              {fav.notes}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
