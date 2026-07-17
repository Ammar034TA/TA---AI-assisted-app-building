import { useState } from 'react';
import { WeatherData } from '../types';
import { 
  Sparkles, 
  Shirt, 
  CheckSquare, 
  Activity, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer, 
  ShieldCheck, 
  Flame, 
  Layers, 
  Umbrella,
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

interface RecommendationsProps {
  data: WeatherData;
}

export default function Recommendations({ data }: RecommendationsProps) {
  const [activeTab, setActiveTab] = useState<'dress' | 'outdoor' | 'gear'>('dress');
  const [checkedGears, setCheckedGears] = useState<string[]>([]);

  const temp = data.current.temperature;
  const apparentTemp = data.current.apparentTemperature;
  const wind = data.current.windSpeed;
  const humidity = data.current.humidity;
  const isRainy = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(data.current.weatherCode);
  const uvIndex = data.daily[0]?.uvIndexMax || 0;

  // --- Dynamic Outfitting Recommendations (Dress Code) ---
  const getDressCode = () => {
    if (temp < 5) {
      return {
        title: "Sub-Zero Shield Required",
        suitability: "Heavy thermal insulated layers",
        layers: [
          { level: "Base Layer", item: "Merino wool or synthetic thermal undergarment" },
          { level: "Mid Layer", item: "Thick fleece fleece cardigan or heavy knit sweater" },
          { level: "Outer Layer", item: "Down-filled winter parka with windproof exterior" },
          { level: "Accessories", item: "Heavy gloves, thermal beanie, and thick wool socks" }
        ],
        advice: "Significant wind chill risk. Cover all exposed skin."
      };
    } else if (temp < 13) {
      return {
        title: "Cold Layering Setup",
        suitability: "Insulated layers + light outerwear",
        layers: [
          { level: "Base Layer", item: "Long sleeve thermal t-shirt or turtleneck shirt" },
          { level: "Mid Layer", item: "Lightweight sweater or comfortable denim pullover" },
          { level: "Outer Layer", item: "Trench coat, bomber, or synthetic windbreaker" },
          { level: "Footwear", item: "Closed-toe leather boots or insulated sneakers" }
        ],
        advice: "Chest and neck should remain shielded from cold air currents."
      };
    } else if (temp < 20) {
      return {
        title: "Temperate Transition Gear",
        suitability: "Highly flexible dual layer system",
        layers: [
          { level: "Base Layer", item: "Soft breathable cotton shirt or casual polo" },
          { level: "Mid Layer", item: "Zip-up hoodie, cardigan, or denim jacket" },
          { level: "Outer Layer", item: "Keep a light windbreaker in your bag just in case" },
          { level: "Footwear", item: "Comfortable urban sneakers or loafers" }
        ],
        advice: "Cool in the shade but warm in active motion. Highly versatile environment."
      };
    } else if (temp < 28) {
      return {
        title: "Warm Summer Fit",
        suitability: "Single breezy layer with UV shield",
        layers: [
          { level: "Top Fit", item: "Linen shirt, light cotton t-shirt, or summer dress" },
          { level: "Bottoms", item: "Breathable shorts, lightweight chinos, or light skirt" },
          { level: "Footwear", item: "Open-mesh running sneakers or premium sandals" },
          { level: "Protection", item: "Polarized eyewear / classic sun-cap" }
        ],
        advice: "Highly pleasant. Natural light-colored fibers optimize comfort."
      };
    } else {
      return {
        title: "Extreme Thermal Venting",
        suitability: "Maximum ventilation & heat repulsion",
        layers: [
          { level: "Top Fit", item: "Loose sleeveless tank or ultra-thin linen wear" },
          { level: "Bottoms", item: "Ventilated athletic shorts or light swimwear" },
          { level: "Defense", item: "Wide-brimmed safari hat or visor" },
          { level: "Protection", item: "Broad-spectrum SPF 50+ sunscreen layer" }
        ],
        advice: "Extreme heat warning. Stay in shaded spaces and hydrate frequently."
      };
    }
  };

  const dressConfig = getDressCode();

  // --- Dynamic Gear Checklist Generator ---
  const generateGearChecklist = () => {
    const checklist = [];
    if (isRainy) {
      checklist.push({ id: 'umbrella', label: 'Windproof Umbrella', desc: 'Active rain is detected in forecast', icon: Umbrella, req: true });
      checklist.push({ id: 'raincoat', label: 'Waterproof Rain Coat', desc: 'Keep garments completely dry', icon: ShieldCheck, req: true });
    }
    if (uvIndex > 4) {
      checklist.push({ id: 'sunscreen', label: 'SPF 30+ Sunscreen', desc: 'UV index is active', icon: Sun, req: true });
      checklist.push({ id: 'sunglasses', label: 'UV-blocking Sunglasses', desc: 'Shield eyes from glare', icon: ShieldCheck, req: true });
    }
    if (temp > 24) {
      checklist.push({ id: 'flask', label: 'Insulated Water Bottle', desc: 'High fluid depletion rate', icon: Flame, req: true });
    }
    if (temp < 10) {
      checklist.push({ id: 'beanie', label: 'Thermal Knit Beanie', desc: 'Avoid body heat dissipation', icon: Layers, req: true });
    }
    if (wind > 22) {
      checklist.push({ id: 'cap', label: 'Fitted Sports Cap', desc: 'High velocity wind gusts', icon: Wind, req: false });
    }
    
    // Always present standard gear
    checklist.push({ id: 'powerbank', label: 'Portable Power Bank', desc: 'Heavy coordinate tracking', icon: Sparkles, req: false });
    return checklist;
  };

  const gearChecklist = generateGearChecklist();

  const handleToggleGear = (id: string) => {
    if (checkedGears.includes(id)) {
      setCheckedGears(checkedGears.filter(g => g !== id));
    } else {
      setCheckedGears([...checkedGears, id]);
    }
  };

  // --- Dynamic Activity Ratings & Ideal Time-Windows ---
  const getActivityRatings = () => {
    let jogScore = 100 - Math.abs(temp - 17) * 4.5;
    if (isRainy) jogScore -= 50;
    if (wind > 25) jogScore -= 20;
    if (temp > 30) jogScore -= 35;
    if (temp < 5) jogScore -= 30;
    
    let cycleScore = 100 - Math.abs(temp - 19) * 4;
    if (isRainy) cycleScore -= 60;
    if (wind > 25) cycleScore -= 30;
    if (temp > 31) cycleScore -= 25;

    let picnicScore = 100 - Math.abs(temp - 22) * 5;
    if (isRainy) picnicScore -= 80;
    if (wind > 18) picnicScore -= 25;
    if (temp > 30) picnicScore -= 30;
    if (temp < 11) picnicScore -= 50;

    let indoorScore = 40;
    if (isRainy || temp < 8 || temp > 31 || wind > 30) {
      indoorScore = 95;
    }

    const getLabel = (score: number) => {
      if (score >= 80) return { label: 'Excellent', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      if (score >= 60) return { label: 'Optimal', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' };
      if (score >= 35) return { label: 'Sub-Optimal', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      return { label: 'Not Advised', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
    };

    return [
      { name: 'Jogging / Running', score: Math.max(0, Math.min(100, Math.round(jogScore))), meta: getLabel(jogScore) },
      { name: 'Cycling / Commuting', score: Math.max(0, Math.min(100, Math.round(cycleScore))), meta: getLabel(cycleScore) },
      { name: 'Picnics / Leisure', score: Math.max(0, Math.min(100, Math.round(picnicScore))), meta: getLabel(picnicScore) },
      { name: 'Indoor Athletics', score: Math.max(0, Math.min(100, Math.round(indoorScore))), meta: getLabel(indoorScore) }
    ];
  };

  const activityRatings = getActivityRatings();

  // Determine best daily scheduling slot
  const getSchedulingOutlook = () => {
    if (isRainy) {
      return {
        recommendation: "Precipitation expected throughout the cycle. Focus on indoor slots.",
        morning: "Sub-Optimal (Wet pavements)",
        midday: "Unsuitable (Heavy downpour threat)",
        evening: "Cozy indoor study / cinema"
      };
    }
    
    if (temp > 28) {
      return {
        recommendation: "Midday sun is aggressive. Move outdoor actions to early hours.",
        morning: "Excellent (Cool & low wind)",
        midday: "Hot / Apply heavy protection",
        evening: "Optimal (Pleasant twilight wind)"
      };
    }

    if (temp < 8) {
      return {
        recommendation: "Temperatures are quite low. Midday provides optimal natural warmth.",
        morning: "Chilly / Frost risk",
        midday: "Optimal (Sun is warmest)",
        evening: "Very cold / Return indoors"
      };
    }

    return {
      recommendation: "Atmospheric windows are balanced. Standard routines apply.",
      morning: "Refreshing (Good for runs)",
      midday: "Excellent (Bright & warm)",
      evening: "Pleasant (Calm breeze)"
    };
  };

  const scheduleOutlook = getSchedulingOutlook();

  // Create dynamic warning alert messages for planning
  const alerts: { type: 'warning' | 'info'; message: string; icon: any }[] = [];
  if (uvIndex > 6) {
    alerts.push({ type: 'warning', message: `High UV Intensity Warning: Wear SPF 50+ sunscreen, polarized eyewear, and limit midday exposure.`, icon: Sun });
  }
  if (wind > 28) {
    alerts.push({ type: 'warning', message: `Severe Wind Gust Warning (${wind} km/h): Secure light gear and anticipate resistance on commutes.`, icon: Wind });
  }
  if (isRainy) {
    alerts.push({ type: 'warning', message: `Wet Precipitation Event: Damp roads increase slip hazards. Use sturdy umbrella and rain shells.`, icon: Umbrella });
  }
  if (temp > 32) {
    alerts.push({ type: 'warning', message: `Extreme Ambient Heat Warning (${Math.round(temp)}°C): High thermal stress. Postpone strenuous runs and hydrate.`, icon: Flame });
  } else if (temp < 6) {
    alerts.push({ type: 'warning', message: `Low Temperature Exposure (${Math.round(temp)}°C): Frost hazard. Keep core and extremities fully insulated.`, icon: Thermometer });
  }

  return (
    <div
      id="recommendations-card"
      className="bg-slate-900/40 border border-slate-800/90 rounded-3xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col justify-between"
    >
      <div>
        {/* Title Block */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-5 bg-amber-500 rounded-full inline-block" />
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-widest text-slate-100 font-display">
                Meteorological Planner
              </h3>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                Predictive Activity & Outfit Guides
              </p>
            </div>
          </div>
          <div className="p-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <Sparkles className="h-4 w-4" />
          </div>
        </div>

        {/* Tab Controls */}
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950/60 border border-slate-800 rounded-xl mb-5">
          <button
            type="button"
            id="tab-dress-code"
            onClick={() => setActiveTab('dress')}
            className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'dress'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            👕 Dress Code
          </button>
          <button
            type="button"
            id="tab-outdoor-plans"
            onClick={() => setActiveTab('outdoor')}
            className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
              activeTab === 'outdoor'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🏃 Outdoor
          </button>
          <button
            type="button"
            id="tab-gear-checklist"
            onClick={() => setActiveTab('gear')}
            className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all relative ${
              activeTab === 'gear'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            🎒 Gear
            {checkedGears.length > 0 && checkedGears.length === gearChecklist.length && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Dynamic Warning Alert Banner if any alert exists */}
        {alerts.length > 0 && (
          <div className="mb-5 p-3.5 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-2.5 animate-in fade-in duration-300">
            {(() => {
              const activeAlert = alerts[0];
              const AlertIcon = activeAlert.icon;
              return (
                <>
                  <AlertIcon className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="text-[9px] font-extrabold text-red-400 uppercase tracking-wider">
                      Atmospheric Safe-Travel Advisory
                    </p>
                    <p className="text-[10px] text-slate-300 leading-normal font-semibold">
                      {activeAlert.message}
                    </p>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* TAB 1: DRESS CODE */}
        {activeTab === 'dress' && (
          <div className="space-y-4 animate-in fade-in duration-300" id="dress-code-panel">
            <div className="p-4 bg-slate-950/40 border border-slate-800 rounded-2xl">
              <div className="flex items-center gap-2.5 mb-2">
                <Shirt className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-black text-slate-100 uppercase tracking-wide">
                  {dressConfig.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-semibold">
                Status suitability: <span className="text-amber-400">{dressConfig.suitability}</span>
              </p>
            </div>

            {/* Layers stack */}
            <div className="space-y-2">
              {dressConfig.layers.map((layer, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-950/20 border border-slate-800/50 p-2.5 rounded-xl text-[11px]">
                  <span className="text-[9px] font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-slate-400 w-24 text-center shrink-0">
                    {layer.level}
                  </span>
                  <span className="text-slate-200 font-medium truncate">
                    {layer.item}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-[10px] text-amber-300 font-medium leading-normal">
              💡 <strong>Advisor Tip:</strong> {dressConfig.advice}
            </div>
          </div>
        )}

        {/* TAB 2: OUTDOOR PLANS */}
        {activeTab === 'outdoor' && (
          <div className="space-y-4 animate-in fade-in duration-300" id="outdoor-suitability-panel">
            <div className="space-y-3">
              {activityRatings.map((activity, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200">{activity.name}</span>
                    <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border uppercase tracking-wider ${activity.meta.color}`}>
                      {activity.meta.label} ({activity.score}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/40">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${
                        activity.score >= 80 
                          ? 'bg-emerald-500' 
                          : activity.score >= 60 
                            ? 'bg-blue-500' 
                            : activity.score >= 35 
                              ? 'bg-amber-500' 
                              : 'bg-red-500'
                      }`}
                      style={{ width: `${activity.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Time slot schedule recommendation */}
            <div className="mt-4 p-4 bg-slate-950/40 border border-slate-800 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-xs uppercase tracking-wider">
                <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                <span>Operational Timeline</span>
              </div>
              <div className="grid grid-cols-1 gap-1.5 text-[10px] font-mono">
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-500 font-bold">MORNING:</span>
                  <span className="text-slate-300 font-semibold">{scheduleOutlook.morning}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span className="text-slate-500 font-bold">MIDDAY:</span>
                  <span className="text-slate-300 font-semibold">{scheduleOutlook.midday}</span>
                </div>
                <div className="flex justify-between pb-0.5">
                  <span className="text-slate-500 font-bold">EVENING:</span>
                  <span className="text-slate-300 font-semibold">{scheduleOutlook.evening}</span>
                </div>
              </div>
              <p className="text-[10px] leading-relaxed text-slate-400 font-semibold border-t border-slate-800 pt-2 italic">
                {scheduleOutlook.recommendation}
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: GEAR CHECKLIST */}
        {activeTab === 'gear' && (
          <div className="space-y-3 animate-in fade-in duration-300" id="gear-checklist-panel">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 uppercase font-bold border-b border-slate-800/60 pb-2">
              <span>Item Checklist</span>
              <span>{checkedGears.length} / {gearChecklist.length} Equipped</span>
            </div>

            <div className="max-h-[220px] overflow-y-auto space-y-2 pr-1">
              {gearChecklist.map((item) => {
                const isChecked = checkedGears.includes(item.id);
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    id={`gear-item-${item.id}`}
                    type="button"
                    onClick={() => handleToggleGear(item.id)}
                    className={`w-full text-left p-2.5 rounded-xl border flex items-start gap-3 transition-all ${
                      isChecked
                        ? 'bg-slate-950/20 border-emerald-500/30 text-slate-400'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-200'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                      isChecked 
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                        : 'border-slate-700 bg-slate-950'
                    }`}>
                      {isChecked && <CheckCircle className="w-3 h-3 stroke-[3] text-slate-950 fill-white" />}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[11px] font-extrabold ${isChecked ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                          {item.label}
                        </span>
                        {item.req && !isChecked && (
                          <span className="text-[8px] bg-red-500/10 text-red-400 border border-red-500/20 px-1 py-0.2 rounded shrink-0 font-bold uppercase">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold truncate">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {checkedGears.length === gearChecklist.length && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[10px] text-emerald-300 text-center font-bold uppercase tracking-wider animate-bounce">
                🎉 All Prepared! Ready for local conditions.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-amber-500/60 uppercase tracking-wider">
        <span>STATUS: OUTSIDE SYSTEM ACTIVE</span>
        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
