



import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Shield, Zap, Leaf, AlertTriangle, CheckCircle,
  Eye, Droplets, Bug, Wind, ChevronRight, X, Sparkles,
  Globe, ChevronDown,
} from "lucide-react";

// ─── FREE TRANSLATION ─────────────────────────────────────────────────────────
async function freeTranslateText(text, targetLang) {
  if (!text || targetLang === "en") return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res  = await fetch(url);
    const data = await res.json();
    return data[0].map(item => item[0]).join("");
  } catch (e) {
    console.warn("translateText failed:", e);
    return text;
  }
}

async function freeTranslateArray(arr, targetLang) {
  if (!arr?.length || targetLang === "en") return arr;
  const DELIM = " |||SPL||| ";
  try {
    const joined     = arr.join(DELIM);
    const translated = await freeTranslateText(joined, targetLang);
    const parts      = translated.split(/\|\|\|SPL\|\|\|/);
    if (parts.length !== arr.length) return arr;
    return parts.map(s => s.trim());
  } catch {
    return arr;
  }
}

async function translateDisease(disease, targetLang) {
  if (targetLang === "en") return null;
  const [name, label, severity, summary, symptoms, causes, prevention, treatment] =
    await Promise.all([
      freeTranslateText(disease.name,    targetLang),
      freeTranslateText(disease.label,   targetLang),
      freeTranslateText(disease.severity,targetLang),
      freeTranslateText(disease.summary, targetLang),
      freeTranslateArray(disease.symptoms,   targetLang),
      freeTranslateArray(disease.causes,     targetLang),
      freeTranslateArray(disease.prevention, targetLang),
      freeTranslateArray(disease.treatment,  targetLang),
    ]);
  return { name, label, severity, summary, symptoms, causes, prevention, treatment };
}

const GOOGLE_CODE = {
  en:"en", hi:"hi", kn:"kn", te:"te", ta:"ta", mr:"mr",
  pa:"pa", gu:"gu", ml:"ml", bn:"bn", fr:"fr",
  es:"es", de:"de", zh:"zh-CN", ar:"ar",
};

// ─── DISEASE DATA ─────────────────────────────────────────────────────────────
const DISEASES = [
  {
    id:"leaf_curl_virus",name:"Leaf Curl Virus",label:"Viral",emoji:"🌀",
    tagColor:"#7c3aed",tagBg:"#f3e8ff",severity:"High",severityColor:"#dc2626",
    icon:<Wind className="h-5 w-5"/>,
    summary:"A whitefly-transmitted virus causing severe leaf curling, yellowing, and stunted growth that can devastate entire crops.",
    symptoms:["Upward or downward curling of leaves","Yellowing and chlorosis between leaf veins","Stunted, bushy plant growth","Reduced fruit size and yield","Thickened, leathery leaf texture"],
    causes:["Bemisia tabaci (silverleaf whitefly) as primary vector","Virus spreads rapidly during hot, dry weather","Infected transplants introduced to the field","High whitefly populations in surrounding areas"],
    prevention:["Use virus-resistant varieties (e.g., Arka Rakshak)","Install 50-mesh insect-proof netting in nurseries","Apply reflective mulch to repel whiteflies","Remove and destroy infected plants immediately","Avoid planting near infected fields"],
    treatment:["No cure exists — focus on vector management","Spray imidacloprid 17.8 SL @ 0.3 ml/L water","Apply neem oil (5 ml/L) every 7 days","Use yellow sticky traps to monitor & trap whiteflies","Remove heavily infected plants to protect surrounding crop"],
    gradient:"from-purple-600 to-violet-800",bg:"from-purple-50 to-violet-50",accent:"#7c3aed",
  },
  {
    id:"spider_mites",name:"Spider Mites",label:"Pest",emoji:"🕷️",
    tagColor:"#b45309",tagBg:"#fef3c7",severity:"Medium",severityColor:"#d97706",
    icon:<Bug className="h-5 w-5"/>,
    summary:"Tiny arachnid pests that colonise leaf undersides, creating fine webbing and causing stippling that drains plant vitality.",
    symptoms:["Fine silvery or bronze stippling on upper leaf surface","Visible fine webbing on leaf undersides","Leaves turn yellow, dry, and drop prematurely","Tiny moving dots (mites) visible with a magnifying glass","Plant vigor declines rapidly in hot, dry conditions"],
    causes:["Tetranychus urticae (two-spotted spider mite)","Hot, dry conditions accelerate reproduction","Pesticide overuse killing natural predators","Dusty conditions favour population explosions"],
    prevention:["Maintain adequate soil moisture and irrigation","Avoid excessive nitrogen fertiliser","Introduce predatory mites (Phytoseiidae spp.)","Monitor plants twice weekly from crop establishment","Keep field surroundings weed-free"],
    treatment:["Spray abamectin 1.8 EC @ 0.5 ml/L water","Apply spiromesifen 22.9 SC @ 0.5 ml/L water","Use neem oil + soap solution every 5–7 days","Strong water sprays dislodge colonies from undersides","Rotate miticides to prevent resistance"],
    gradient:"from-amber-500 to-orange-700",bg:"from-amber-50 to-orange-50",accent:"#b45309",
  },
  {
    id:"leaf_mold",name:"Leaf Mold",label:"Fungal",emoji:"🍂",
    tagColor:"#065f46",tagBg:"#d1fae5",severity:"Medium",severityColor:"#d97706",
    icon:<Droplets className="h-5 w-5"/>,
    summary:"A fungal disease thriving in high-humidity environments, coating leaf undersides with olive-green spore masses.",
    symptoms:["Pale green to yellow spots on upper leaf surface","Olive-green to brown velvety mold on undersides","Infected leaves curl upward and eventually die","Severe infections spread to stems and blossoms","Reduced photosynthesis and premature defoliation"],
    causes:["Passalora fulva (formerly Cladosporium fulvum)","Relative humidity above 85% for extended periods","Poor greenhouse/polyhouse ventilation","Temperatures between 22–24°C favour sporulation"],
    prevention:["Plant resistant varieties (e.g., V473, Arka Abha)","Maintain humidity below 85% with ventilation","Space plants adequately for air circulation","Avoid overhead irrigation — use drip systems","Remove and destroy crop debris after harvest"],
    treatment:["Spray mancozeb 75 WP @ 2.5 g/L water","Apply chlorothalonil 75 WP @ 2 g/L water","Use copper oxychloride 50 WP @ 3 g/L water","Trifloxystrobin + tebuconazole at label rates","Repeat spray every 10–12 days under humid conditions"],
    gradient:"from-emerald-600 to-teal-700",bg:"from-emerald-50 to-teal-50",accent:"#065f46",
  },
  {
    id:"leaf_miner",name:"Leaf Miner",label:"Pest",emoji:"🐛",
    tagColor:"#92400e",tagBg:"#fef3c7",severity:"Low",severityColor:"#16a34a",
    icon:<Bug className="h-5 w-5"/>,
    summary:"Larvae that tunnel between leaf surfaces, creating winding mines that disrupt photosynthesis and reduce marketability.",
    symptoms:["Serpentine white or yellowish winding tunnels in leaves","Brown blotches where larvae feed intensively","Premature leaf drop in severe infestations","Tiny dark larvae visible within mines when leaves held to light","Stippled feeding scars from adult flies"],
    causes:["Liriomyza trifolii and L. sativae (agromyzid flies)","Adults lay eggs in leaf tissue; larvae mine internally","Warm temperatures (25–30°C) speed development","Resistance to insecticides complicates management"],
    prevention:["Use fine mesh netting over seedbeds","Apply yellow sticky traps at 25 per hectare","Encourage parasitic wasps (Diglyphus, Dacnusa spp.)","Rotate crops to break pest cycle","Monitor adult flight activity with traps"],
    treatment:["Cyromazine 75 WP @ 0.75 g/L water (systemic action)","Abamectin 1.8 EC @ 0.5 ml/L water","Remove and destroy heavily mined leaves","Spinosad 45 SC @ 0.3 ml/L targets larvae","Avoid broad-spectrum insecticides to protect parasitoids"],
    gradient:"from-yellow-500 to-amber-600",bg:"from-yellow-50 to-amber-50",accent:"#92400e",
  },
  {
    id:"late_blight",name:"Late Blight",label:"Fungal / Oomycete",emoji:"💀",
    tagColor:"#991b1b",tagBg:"#fee2e2",severity:"Critical",severityColor:"#dc2626",
    icon:<AlertTriangle className="h-5 w-5"/>,
    summary:"The most destructive tomato disease worldwide, capable of destroying an entire crop within days under wet, cool conditions.",
    symptoms:["Water-soaked, irregular dark lesions on leaves and stems","White cottony mold on lesion undersides in humid conditions","Brown to black discoloration spreads rapidly","Fruit develops brown, greasy-looking firm rot","Infected tissue collapses; entire plant can die in 7–10 days"],
    causes:["Phytophthora infestans (oomycete water mold)","Cool (10–25°C), wet weather with high humidity (>90%)","Infected seed or transplants introduce the pathogen","Wind-dispersed sporangia spread infection rapidly"],
    prevention:["Plant certified disease-free transplants only","Use resistant varieties (Defiant, Iron Lady)","Apply preventive copper fungicide before disease onset","Avoid overhead irrigation; water at soil level","Improve field drainage; avoid low-lying, poorly drained plots"],
    treatment:["Spray metalaxyl + mancozeb (Ridomil Gold) @ 2.5 g/L","Cymoxanil + mancozeb @ 2 g/L water","Dimethomorph 50 WP @ 1 g/L in severe outbreaks","Remove and destroy all infected plant material immediately","Rotate fungicide classes to prevent resistance development"],
    gradient:"from-red-700 to-rose-900",bg:"from-red-50 to-rose-50",accent:"#991b1b",
  },
  {
    id:"insect_damage",name:"Insect Damage",label:"Pest",emoji:"🦟",
    tagColor:"#1d4ed8",tagBg:"#dbeafe",severity:"Medium",severityColor:"#d97706",
    icon:<Bug className="h-5 w-5"/>,
    summary:"General feeding damage from caterpillars, thrips, aphids, and other insects that weaken the plant and create entry points for pathogens.",
    symptoms:["Ragged holes and bite marks on leaves","Rolled or distorted young leaves (thrips feeding)","Silvery streaks on leaf surface (thrips)","Deformed fruit with surface scars or tunnels","Sticky honeydew deposits leading to sooty mold"],
    causes:["Helicoverpa armigera (fruit borer) — major pest","Thrips tabaci and Frankliniella occidentalis","Myzus persicae (green peach aphid)","Spodoptera litura (tobacco caterpillar)"],
    prevention:["Install pheromone traps (Helicoverpa, Spodoptera)","Use light traps to monitor adult moth populations","Encourage natural enemies: lady beetles, lacewings","Apply IIHR tomato pest management schedule","Maintain weed-free field margins"],
    treatment:["Emamectin benzoate 5 SG @ 0.4 g/L for caterpillars","Spinosad 45 SC @ 0.3 ml/L for thrips","Imidacloprid 17.8 SL @ 0.3 ml/L for aphids","Chlorpyrifos 20 EC @ 2.5 ml/L for soil pests","Bacillus thuringiensis for caterpillar biocontrol"],
    gradient:"from-blue-600 to-indigo-700",bg:"from-blue-50 to-indigo-50",accent:"#1d4ed8",
  },
  {
    id:"healthy",name:"Healthy",label:"No Disease",emoji:"✅",
    tagColor:"#15803d",tagBg:"#dcfce7",severity:"None",severityColor:"#16a34a",
    icon:<CheckCircle className="h-5 w-5"/>,
    summary:"A perfectly healthy tomato leaf — deep green, firm, and blemish-free. Your crop is thriving! Keep up the great management.",
    symptoms:["Deep, uniform green colour throughout the leaf","No spots, lesions, or discoloration","Firm texture without curling or wilting","Normal leaf veination visible","Appropriate size for the plant's growth stage"],
    causes:["Optimal soil pH (6.0–6.8)","Balanced NPK nutrition","Adequate, consistent irrigation","Good pest and disease prevention practices"],
    prevention:["Maintain regular scouting schedules (twice weekly)","Continue balanced nutrition and irrigation","Keep up preventive fungicide and pest management","Monitor weather for incoming disease pressure","Rotate crops in subsequent seasons"],
    treatment:["No treatment needed — maintain current practices","Consider soil health check every season","Continue drip irrigation and mulching","Ensure continued micronutrient availability","Celebrate healthy crop management! 🎉"],
    gradient:"from-green-500 to-emerald-700",bg:"from-green-50 to-emerald-50",accent:"#15803d",
  },
  {
    id:"early_blight",name:"Early Blight",label:"Fungal",emoji:"🍄",
    tagColor:"#b45309",tagBg:"#fef3c7",severity:"High",severityColor:"#dc2626",
    icon:<AlertTriangle className="h-5 w-5"/>,
    summary:"A very common fungal disease causing characteristic concentric-ring 'target' spots that spread rapidly upward from older leaves.",
    symptoms:["Dark brown spots with concentric rings (target-board pattern)","Yellow halo surrounding individual lesions","Spots coalesce causing large areas of dead tissue","Disease starts on older lower leaves, moves upward","Fruit develops dark, sunken, leathery spots near stem"],
    causes:["Alternaria solani fungus","Warm temperatures (24–29°C) with wet/humid conditions","Infected crop debris in soil carries spores","Plant stress (nutrient deficiency, drought) increases susceptibility"],
    prevention:["Use certified disease-free seed and transplants","Apply preventive mancozeb spray from early stages","Remove lower leaves as the season progresses","Avoid excessive nitrogen fertilisation","Practice 3–4 year crop rotation"],
    treatment:["Mancozeb 75 WP @ 2 g/L water (contact fungicide)","Azoxystrobin 23 SC @ 1 ml/L water","Propiconazole 25 EC @ 1 ml/L water","Copper oxychloride 50 WP @ 3 g/L water","Spray every 7–10 days; alternate fungicide classes"],
    gradient:"from-orange-500 to-amber-700",bg:"from-orange-50 to-amber-50",accent:"#b45309",
  },
  {
    id:"cercospora_leaf_mold",name:"Cercospora Leaf Mold",label:"Fungal",emoji:"🔵",
    tagColor:"#0369a1",tagBg:"#e0f2fe",severity:"Medium",severityColor:"#d97706",
    icon:<Eye className="h-5 w-5"/>,
    summary:"Also called 'grey leaf spot', this fungal disease produces small, dark circular spots with a distinctive ash-grey centre.",
    symptoms:["Small (2–3 mm) dark brown circular spots","Spots develop a lighter grey or white centre","Yellow halo may surround individual spots","Spots may coalesce under heavy disease pressure","Premature leaf senescence and defoliation"],
    causes:["Cercospora fuligena fungus","Warm, humid conditions (>25°C, RH >80%)","Extended leaf wetness from dew or rain","Infected plant debris carries overwintering spores"],
    prevention:["Use resistant or tolerant tomato varieties","Apply mulch to reduce soil splash of spores","Use drip irrigation to keep foliage dry","Remove infected leaf material from the field","Rotate with non-solanaceous crops for 2+ years"],
    treatment:["Chlorothalonil 75 WP @ 2 g/L water","Azoxystrobin + difenoconazole (Amistar Top) @ 1 ml/L","Mancozeb 75 WP @ 2.5 g/L water","Begin spray programme at first sign of symptoms","Repeat every 10–14 days through humid season"],
    gradient:"from-sky-500 to-blue-700",bg:"from-sky-50 to-blue-50",accent:"#0369a1",
  },
  {
    id:"bacterial_spot",name:"Bacterial Spot",label:"Bacterial",emoji:"🦠",
    tagColor:"#7f1d1d",tagBg:"#fee2e2",severity:"High",severityColor:"#dc2626",
    icon:<Zap className="h-5 w-5"/>,
    summary:"A seed-borne bacterial disease causing water-soaked spots that turn dark and scabby, affecting leaves, stems, and fruit.",
    symptoms:["Water-soaked, greasy-looking small spots on leaves","Spots turn dark brown to black with a yellow margin","Raised, scabby, rough lesions on fruit surface","Stems develop dark, elongated cankers","Severe defoliation under wet, windy conditions"],
    causes:["Xanthomonas vesicatoria and related species","Seed-borne pathogen; survives in infected debris","Spreads rapidly through rain splash and wind","Warm (24–30°C), wet, humid conditions"],
    prevention:["Use certified disease-free or hot-water treated seed","Treat transplants with copper bactericide before planting","Avoid working in wet fields (reduces spread)","Use drip irrigation to keep foliage dry","Choose resistant varieties where available"],
    treatment:["Copper hydroxide 77 WP @ 3 g/L water","Copper oxychloride 50 WP @ 3 g/L water","Streptomycin sulfate 90 SP @ 0.5 g/L (if approved in region)","Apply at 5–7 day intervals during wet conditions","No curative bactericide exists — prevention is key"],
    gradient:"from-rose-700 to-red-900",bg:"from-rose-50 to-red-50",accent:"#7f1d1d",
  },
  {
    id:"other",name:"Other / Unknown",label:"Unclassified",emoji:"❓",
    tagColor:"#374151",tagBg:"#f3f4f6",severity:"Unknown",severityColor:"#6b7280",
    icon:<Search className="h-5 w-5"/>,
    summary:"The classifier detected anomalies that don't match any trained disease category. Seek expert diagnosis for precise identification.",
    symptoms:["Unusual discoloration not matching known disease patterns","Atypical lesion shape or distribution","Multiple overlapping symptoms suggesting co-infection","Abiotic stress symptoms (nutrient deficiency, sun scorch)","Herbicide drift or chemical injury patterns"],
    causes:["Nutrient deficiencies (calcium, magnesium, boron)","Chemical injury from herbicide drift or misapplication","Abiotic stress: sun scorch, frost, wind burn","Rare or emerging pathogens not in training data"],
    prevention:["Maintain comprehensive crop health records","Take clear photos for expert diagnosis","Consult your local Krishi Vigyan Kendra (KVK)","Send samples to the state plant disease diagnostic lab","Follow general good agronomic practices"],
    treatment:["Consult a certified agronomist before applying any treatment","Submit leaf samples to a diagnostic laboratory","Contact your state agriculture department helpline","Do not apply chemicals without confirmed diagnosis","Monitor plants closely for symptom progression"],
    gradient:"from-gray-500 to-slate-700",bg:"from-gray-50 to-slate-50",accent:"#374151",
  },
];

// ─── SUPPORTED LANGUAGES ─────────────────────────────────────────────────────
const LANGUAGES = [
  {code:"en", label:"English",   flag:"🇬🇧", native:"English"},
  {code:"hi", label:"Hindi",     flag:"🇮🇳", native:"हिंदी"},
  {code:"kn", label:"Kannada",   flag:"🇮🇳", native:"ಕನ್ನಡ"},
  {code:"te", label:"Telugu",    flag:"🇮🇳", native:"తెలుగు"},
  {code:"ta", label:"Tamil",     flag:"🇮🇳", native:"தமிழ்"},
  {code:"mr", label:"Marathi",   flag:"🇮🇳", native:"मराठी"},
  {code:"pa", label:"Punjabi",   flag:"🇮🇳", native:"ਪੰਜਾਬੀ"},
  {code:"gu", label:"Gujarati",  flag:"🇮🇳", native:"ગુજરાતી"},
  {code:"ml", label:"Malayalam", flag:"🇮🇳", native:"മലയാളം"},
  {code:"bn", label:"Bengali",   flag:"🇮🇳", native:"বাংলা"},
  {code:"fr", label:"French",    flag:"🇫🇷", native:"Français"},
  {code:"es", label:"Spanish",   flag:"🇪🇸", native:"Español"},
  {code:"de", label:"German",    flag:"🇩🇪", native:"Deutsch"},
  {code:"zh", label:"Chinese",   flag:"🇨🇳", native:"中文"},
  {code:"ar", label:"Arabic",    flag:"🇸🇦", native:"العربية"},
];

// ─── LANGUAGE SELECTOR BAR ────────────────────────────────────────────────────
function LanguageSelectorBar({ selectedLang, onSelect, translating, progress }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position:"relative" }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ display:"inline-flex", alignItems:"center", gap:8, background:"white", border:"1.5px solid rgba(45,80,22,0.15)", borderRadius:999, padding:"8px 16px", fontSize:13, fontWeight:600, color:"#1a3a0a", cursor:"pointer", fontFamily:"sans-serif", boxShadow:"0 2px 8px rgba(0,0,0,0.06)", transition:"all 0.2s" }}
      >
        <Globe style={{ width:15, height:15, color:"#7FD14F" }}/>
        {translating ? (
          <>
            <div style={{ width:12, height:12, border:"2px solid rgba(45,80,22,0.3)", borderTopColor:"#2D5016", borderRadius:"50%", animation:"db-spin 0.8s linear infinite" }}/>
            Translating {progress.done}/{progress.total}…
          </>
        ) : (
          <>{selectedLang.flag} {selectedLang.native}</>
        )}
        <ChevronDown style={{ width:13, height:13, color:"rgba(45,80,22,0.5)", transform: open ? "rotate(180deg)" : "none", transition:"transform 0.2s" }}/>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity:0, y:-8, scale:0.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-8, scale:0.97 }}
            style={{ position:"absolute", right:0, top:"calc(100% + 8px)", background:"white", borderRadius:18, boxShadow:"0 20px 60px rgba(0,0,0,0.2)", zIndex:300, width:220, maxHeight:320, overflowY:"auto", border:"1px solid rgba(45,80,22,0.1)" }}
          >
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => { onSelect(lang); setOpen(false); }}
                style={{ width:"100%", textAlign:"left", padding:"11px 16px", background: selectedLang.code === lang.code ? "#f0f7e6" : "none", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:12, fontSize:13, color:"#2d3436", fontFamily:"sans-serif", fontWeight: selectedLang.code === lang.code ? 700 : 400, borderBottom:"1px solid #f5f5f5" }}
              >
                <span style={{ fontSize:18 }}>{lang.flag}</span>
                <div>
                  <div>{lang.native}</div>
                  <div style={{ fontSize:10, color:"#9e9e9e" }}>{lang.label}</div>
                </div>
                {selectedLang.code === lang.code && <span style={{ marginLeft:"auto", color:"#2D5016" }}>✓</span>}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── DISEASE CARD ─────────────────────────────────────────────────────────────
function DiseaseCard({ disease, index, onClick, translatedData }) {
  const name    = translatedData?.name    || disease.name;
  const summary = translatedData?.summary || disease.summary;

  return (
    <motion.div
      initial={{ opacity:0, y:40 }}
      animate={{ opacity:1, y:0 }}
      transition={{ duration:0.5, delay:index*0.06, ease:[0.23,1,0.32,1] }}
      whileHover={{ y:-8, scale:1.015 }}
      onClick={() => onClick(disease)}
      style={{ cursor:"pointer", position:"relative", overflow:"hidden", borderRadius:"2rem", border:"1.5px solid rgba(255,255,255,0.7)", background:"rgba(255,255,255,0.65)", padding:24, boxShadow:"0 8px 32px rgba(45,80,22,0.10)", backdropFilter:"blur(12px)", transition:"box-shadow 0.2s" }}
    >
      <div style={{ position:"absolute", right:-32, top:-32, width:160, height:160, borderRadius:"50%", background:`linear-gradient(135deg,${disease.accent}22,${disease.accent}44)` }}/>
      <div style={{ position:"relative", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
        <div style={{ width:56, height:56, borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, background:`linear-gradient(135deg,${disease.accent}22,${disease.accent}44)`, border:`1.5px solid ${disease.accent}33`, boxShadow:"0 4px 12px rgba(0,0,0,0.06)" }}>
          {disease.emoji}
        </div>
        <span style={{ borderRadius:999, padding:"4px 12px", fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", background:disease.tagBg, color:disease.tagColor }}>
          {translatedData?.label || disease.label}
        </span>
      </div>
      <h3 style={{ position:"relative", marginTop:16, fontSize:20, fontWeight:700, color:"#1a3a0a", fontFamily:"Georgia, serif" }}>{name}</h3>
      <div style={{ position:"relative", marginTop:6, display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:7, height:7, borderRadius:"50%", background:disease.severityColor }}/>
        <span style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:disease.severityColor }}>
          {translatedData?.severity || disease.severity} severity
        </span>
      </div>
      <p style={{ position:"relative", marginTop:10, fontSize:13.5, lineHeight:1.65, color:"rgba(61,61,58,0.75)", fontFamily:"sans-serif" }}>
        {summary.length > 100 ? summary.slice(0, 100) + "…" : summary}
      </p>
      <div style={{ position:"relative", marginTop:14, display:"flex", flexWrap:"wrap", gap:6 }}>
        {["Symptoms","Treatment","Prevention"].map(tag => (
          <span key={tag} style={{ borderRadius:999, border:"1px solid rgba(45,80,22,0.12)", background:"rgba(255,255,255,0.8)", padding:"4px 12px", fontSize:11, color:"rgba(44,44,44,0.7)", fontFamily:"sans-serif" }}>{tag}</span>
        ))}
      </div>
      <div style={{ position:"relative", marginTop:18, display:"flex", alignItems:"center", gap:4, fontSize:13, fontWeight:600, color:disease.accent, fontFamily:"sans-serif" }}>
        View details <ChevronRight style={{ width:15, height:15 }}/>
      </div>
    </motion.div>
  );
}

// ─── DETAIL MODAL — fixed close button ────────────────────────────────────────
function DetailModal({ disease, onClose, translatedData }) {
  const name       = translatedData?.name       || disease.name;
  const label      = translatedData?.label      || disease.label;
  const severity   = translatedData?.severity   || disease.severity;
  const summary    = translatedData?.summary    || disease.summary;
  const symptoms   = translatedData?.symptoms   || disease.symptoms;
  const causes     = translatedData?.causes     || disease.causes;
  const prevention = translatedData?.prevention || disease.prevention;
  const treatment  = translatedData?.treatment  || disease.treatment;

  const sections = [
    { title:"Symptoms",   icon:<Eye className="h-4 w-4"/>,           items:symptoms,   color:"#dc2626" },
    { title:"Causes",     icon:<AlertTriangle className="h-4 w-4"/>, items:causes,     color:"#d97706" },
    { title:"Prevention", icon:<Shield className="h-4 w-4"/>,        items:prevention, color:"#16a34a" },
    { title:"Treatment",  icon:<Zap className="h-4 w-4"/>,           items:treatment,  color:"#1d4ed8" },
  ];

  // Lock body scroll and handle ESC key
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    // ── Backdrop: pointer events on the backdrop div itself ──
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      style={{
        position:"fixed", inset:0, zIndex:500,
        display:"flex", alignItems:"center", justifyContent:"center",
        padding:16,
        background:"rgba(10,20,5,0.72)",
        backdropFilter:"blur(12px)",
        WebkitBackdropFilter:"blur(12px)",
        cursor:"pointer",
      }}
      // Close when clicking the backdrop
      onPointerDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* ── Modal box — stop propagation so clicks inside don't close ── */}
      <motion.div
        initial={{ scale:0.88, y:40, opacity:0 }}
        animate={{ scale:1, y:0, opacity:1 }}
        exit={{ scale:0.92, y:20, opacity:0 }}
        transition={{ type:"spring", stiffness:200, damping:22 }}
        style={{
          position:"relative",
          maxHeight:"90vh",
          width:"100%",
          maxWidth:720,
          overflowY:"auto",
          borderRadius:"2.5rem",
          border:"1px solid rgba(255,255,255,0.2)",
          background:"white",
          boxShadow:"0 40px 100px rgba(0,0,0,0.4)",
          cursor:"default",
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        {/* ── Hero ── */}
        <div style={{
          position:"relative",
          overflow:"hidden",
          borderRadius:"2.5rem 2.5rem 0 0",
          background:`linear-gradient(135deg,${disease.accent},${disease.accent}bb)`,
          padding:32,
        }}>
          <div style={{ position:"absolute", right:-64, top:-64, width:256, height:256, borderRadius:"50%", background:"rgba(255,255,255,0.1)", pointerEvents:"none" }}/>

          {/* ✅ FIXED CLOSE BUTTON — high z-index, explicit pointer events */}
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              position:"absolute",
              right:20,
              top:20,
              width:44,
              height:44,
              borderRadius:"50%",
              background:"rgba(255,255,255,0.25)",
              border:"1.5px solid rgba(255,255,255,0.4)",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
              cursor:"pointer",
              backdropFilter:"blur(8px)",
              zIndex:600,
              transition:"background 0.2s, transform 0.15s",
              pointerEvents:"all",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.4)"; e.currentTarget.style.transform = "scale(1.1)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.25)"; e.currentTarget.style.transform = "scale(1)"; }}
            aria-label="Close"
          >
            <X style={{ width:18, height:18, color:"white", pointerEvents:"none" }}/>
          </button>

          <div style={{ position:"relative" }}>
            <div style={{ fontSize:48 }}>{disease.emoji}</div>
            <h2 style={{ marginTop:12, fontSize:28, fontWeight:700, color:"white", fontFamily:"Georgia, serif" }}>{name}</h2>
            <div style={{ marginTop:8, display:"flex", flexWrap:"wrap", gap:8 }}>
              <span style={{ borderRadius:999, background:"rgba(255,255,255,0.2)", padding:"4px 12px", fontSize:11, fontWeight:600, color:"white", fontFamily:"sans-serif" }}>{label}</span>
              <span style={{ borderRadius:999, background:"rgba(255,255,255,0.2)", padding:"4px 12px", fontSize:11, fontWeight:600, color:"white", fontFamily:"sans-serif" }}>{severity} severity</span>
            </div>
            <p style={{ marginTop:14, fontSize:13.5, lineHeight:1.75, color:"rgba(255,255,255,0.88)", fontFamily:"sans-serif" }}>{summary}</p>
          </div>
        </div>

        {/* ── Content grid ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(260px, 1fr))" }}>
          {sections.map((section, i) => (
            <div
              key={section.title}
              style={{
                padding:28,
                borderRight: i%2===0 ? "1px solid #f0f0f0" : "none",
                borderBottom: i<2 ? "1px solid #f0f0f0" : "none",
              }}
            >
              <div style={{ display:"flex", alignItems:"center", gap:8, color:section.color, marginBottom:16 }}>
                {section.icon}
                <span style={{ fontSize:10, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.2em", fontFamily:"sans-serif" }}>{section.title}</span>
              </div>
              <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:10 }}>
                {section.items.map((item, idx) => (
                  <li key={idx} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                    <span style={{ marginTop:6, width:6, height:6, borderRadius:"50%", background:section.color, flexShrink:0 }}/>
                    <span style={{ fontSize:13, lineHeight:1.65, color:"#3d3d3a", fontFamily:"sans-serif" }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <div style={{ borderRadius:"0 0 2.5rem 2.5rem", borderTop:"1px solid #f0f0f0", background:"#fafaf8", padding:"16px 32px" }}>
          <p style={{ margin:0, fontSize:11, color:"#9e9e9e", fontFamily:"sans-serif" }}>
            ⚕️ Always consult a certified agronomist or your local KVK before applying chemical treatments.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── MAIN DISEASE DATABASE PAGE ───────────────────────────────────────────────
export default function DiseaseDatabasePage() {
  const [scrolled,  setScrolled]  = useState(false);
  const [search,    setSearch]    = useState("");
  const [filter,    setFilter]    = useState("All");
  const [selected,  setSelected]  = useState(null);

  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [translating,  setTranslating]  = useState(false);
  const [translations, setTranslations] = useState({});
  const [progress,     setProgress]     = useState({ done:0, total:0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLanguageSelect = async (lang) => {
    setSelectedLang(lang);
    if (lang.code === "en") { setTranslations({}); return; }
    const gLang = GOOGLE_CODE[lang.code] || lang.code;
    setTranslating(true);
    setTranslations({});
    setProgress({ done:0, total:DISEASES.length });
    let done = 0;
    for (const disease of DISEASES) {
      try {
        const result = await translateDisease(disease, gLang);
        if (result) setTranslations(prev => ({ ...prev, [disease.id]: result }));
      } catch (e) { console.warn(`Translation failed for ${disease.id}:`, e); }
      done++;
      setProgress({ done, total:DISEASES.length });
    }
    setTranslating(false);
  };

  const labels = ["All", "Fungal", "Bacterial", "Viral", "Pest", "No Disease", "Unclassified"];

  const filtered = DISEASES.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = d.name.toLowerCase().includes(q) || d.label.toLowerCase().includes(q);
    const matchFilter = filter === "All" || d.label.toLowerCase().includes(filter.toLowerCase());
    return matchSearch && matchFilter;
  });

  const counts = {
    total:    DISEASES.length,
    fungal:   DISEASES.filter(d => d.label.includes("Fungal")).length,
    pest:     DISEASES.filter(d => d.label === "Pest").length,
    critical: DISEASES.filter(d => d.severity === "Critical" || d.severity === "High").length,
  };

  return (
    <div style={{ minHeight:"100vh", overflowX:"hidden", color:"#1A1A1A", fontFamily:"Georgia, serif", background:"linear-gradient(165deg,#FEFDFB 0%,#F2F7EC 45%,#F5F1E8 100%)" }}>
      <style>{`
        .glass{backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);background:rgba(255,255,255,0.62);}
        .shadow-soft{box-shadow:0 20px 50px rgba(26,58,10,0.12);}
        .filter-pill{padding:7px 18px;border-radius:999px;font-size:12px;font-weight:600;font-family:sans-serif;border:1.5px solid rgba(45,80,22,0.15);background:white;color:#4a4a47;cursor:pointer;transition:all 0.2s;}
        .filter-pill:hover{background:#f0f7e6;border-color:rgba(45,80,22,0.3);color:#1a3a0a;}
        .filter-pill.active{background:#2D5016;color:white;border-color:#2D5016;box-shadow:0 4px 14px rgba(45,80,22,0.3);}
        .search-input{font-family:sans-serif;background:white;border:1.5px solid rgba(45,80,22,0.12);border-radius:999px;padding:12px 20px 12px 48px;width:100%;font-size:14px;color:#1a3a0a;outline:none;box-shadow:0 2px 12px rgba(0,0,0,0.04);transition:border-color 0.2s,box-shadow 0.2s;box-sizing:border-box;}
        .search-input:focus{border-color:#2D5016;box-shadow:0 0 0 3px rgba(45,80,22,0.1);}
        .search-input::placeholder{color:rgba(44,44,44,0.35);}
        @keyframes db-spin{to{transform:rotate(360deg)}}
        .db-nav-link{background:none;border:none;cursor:pointer;font-family:sans-serif;font-size:13px;font-weight:600;color:rgba(45,80,22,0.75);padding:6px 10px;border-radius:999px;transition:all 0.2s;text-decoration:none;display:inline-flex;align-items:center;gap:5px;}
        .db-nav-link:hover{background:rgba(45,80,22,0.08);color:#1a3a0a;}
      `}</style>

      {/* ── AGRICULTURE-THEMED NAV ── */}
      <header
        style={{
          position:"fixed", top:0, zIndex:100, width:"100%", transition:"all 0.3s",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          background: scrolled ? "rgba(254,253,251,0.88)" : "transparent",
          borderBottom: scrolled ? "1px solid rgba(45,80,22,0.08)" : "none",
          boxShadow: scrolled ? "0 2px 30px rgba(26,58,10,0.10)" : "none",
        }}
      >
        <div style={{ maxWidth:1280, margin:"0 auto", height:72, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px" }}>
          {/* Logo */}
          <button onClick={() => window.location.href="/"} style={{ display:"flex", alignItems:"center", gap:12, background:"none", border:"none", cursor:"pointer" }}>
            <span style={{ width:40, height:40, borderRadius:"50%", background:"linear-gradient(135deg,#2D5016,#1a3a0a)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(45,80,22,0.3)" }}>
              <Leaf style={{ width:18, height:18, color:"white" }}/>
            </span>
            <span>
              <span style={{ display:"block", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.35em", color:"rgba(45,80,22,0.65)", textTransform:"uppercase", fontFamily:"sans-serif" }}>Agro AI</span>
              <span style={{ display:"block", fontSize:"0.85rem", fontWeight:600, color:"#1a3a0a", fontFamily:"sans-serif" }}>Disease Database</span>
            </span>
          </button>

          {/* Agriculture-themed nav links */}
          <nav style={{ display:"flex", alignItems:"center", gap:4, flexWrap:"wrap" }}>
            {/* Language selector */}
            <LanguageSelectorBar
              selectedLang={selectedLang}
              onSelect={handleLanguageSelect}
              translating={translating}
              progress={progress}
            />

            <button className="db-nav-link" onClick={() => window.location.href="/"}>🏠 Home</button>
            <button className="db-nav-link" onClick={() => window.location.href="/tomato-cultivation"}>🌿 Cultivation</button>
            <button className="db-nav-link" onClick={() => window.location.href="/news"}>📰 News</button>
            <button className="db-nav-link" onClick={() => window.location.href="/map"}>🗺️ Map</button>

            {/* Divider */}
            <div style={{ width:1, height:22, background:"rgba(45,80,22,0.15)", margin:"0 4px" }}/>

            <button
              onClick={() => window.location.href="/predictions"}
              style={{ background:"linear-gradient(135deg,#E63946,#c0392b)", color:"white", border:"none", borderRadius:999, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"sans-serif", boxShadow:"0 4px 12px rgba(230,57,70,0.3)", display:"flex", alignItems:"center", gap:6, transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
            >
              🍅 Analyze Leaf
            </button>
          </nav>
        </div>
      </header>

      {/* ── Translation progress bar ── */}
      <AnimatePresence>
        {translating && (
          <motion.div
            initial={{ opacity:0, y:-4 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:-4 }}
            style={{ position:"fixed", top:72, left:0, right:0, zIndex:99, height:3, background:"#e0e0e0", overflow:"hidden" }}
          >
            <motion.div
              style={{ height:"100%", background:"linear-gradient(90deg,#2D5016,#7FD14F)", borderRadius:999 }}
              animate={{ width:`${(progress.done / Math.max(progress.total,1)) * 100}%` }}
              transition={{ duration:0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toast notification while translating ── */}
      <AnimatePresence>
        {translating && (
          <motion.div
            initial={{ opacity:0, y:20 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:20 }}
            style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:150, background:"rgba(26,58,10,0.94)", borderRadius:999, padding:"10px 24px", boxShadow:"0 8px 32px rgba(0,0,0,0.3)", backdropFilter:"blur(8px)" }}
          >
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:14, height:14, border:"2px solid rgba(127,209,79,0.3)", borderTopColor:"#7FD14F", borderRadius:"50%", animation:"db-spin 0.85s linear infinite" }}/>
              <span style={{ color:"white", fontSize:13, fontFamily:"sans-serif", fontWeight:600 }}>
                Translating to {selectedLang.flag} {selectedLang.native}… {progress.done}/{progress.total}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main style={{ paddingTop:72 }}>
        {/* ── HERO ── */}
        <section style={{ position:"relative", overflow:"hidden", background:"linear-gradient(135deg,#1b3a0f 0%,#2d5016 50%,#1e4a2a 100%)", padding:"80px 24px 100px" }}>
          <svg viewBox="0 0 1440 80" style={{ position:"absolute", bottom:0, left:0, width:"100%", display:"block" }} preserveAspectRatio="none">
            <path d="M0 80 Q360 0 720 50 Q1080 100 1440 30 L1440 80 Z" fill="#FEFDFB"/>
          </svg>
          <div style={{ position:"relative", maxWidth:1000, margin:"0 auto", textAlign:"center" }}>
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:8, borderRadius:999, border:"1px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.1)", padding:"8px 20px", fontSize:11, fontWeight:700, color:"white", letterSpacing:"0.12em", fontFamily:"sans-serif", backdropFilter:"blur(8px)", marginBottom:20 }}>
                <Sparkles style={{ width:13, height:13, color:"#7FD14F" }}/> DISEASE KNOWLEDGE HUB 
              </div>
              <h1 style={{ fontSize:"clamp(2.4rem,6vw,4rem)", lineHeight:1.1, fontWeight:400, color:"white", margin:"0 0 20px", textShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
                Tomato Disease<br/>
                <span style={{ color:"#f9a825", fontStyle:"italic" }}>Database & Guide</span>
              </h1>
              <p style={{ fontFamily:"sans-serif", fontSize:17, lineHeight:1.8, color:"#c8e6a0", maxWidth:600, margin:"0 auto 0", fontWeight:300 }}>
                Full symptoms, causes, prevention & treatment for every disease. Use the <strong style={{ color:"#f9a825" }}> language selector</strong>  to translate everything instantly — completely free.
              </p>
            </motion.div>
            {/* Stats */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }} style={{ marginTop:48, display:"flex", flexWrap:"wrap", justifyContent:"center", gap:16 }}>
              {[{ num:counts.total, label:"Disease Classes" }, { num:counts.fungal, label:"Fungal Diseases" }, { num:counts.pest, label:"Pest Types" }, { num:counts.critical, label:"High / Critical" }, { num:15, label:"Languages" }].map(s => (
                <div key={s.label} style={{ borderRadius:24, border:"1px solid rgba(255,255,255,0.15)", background:"rgba(255,255,255,0.1)", padding:"16px 24px", color:"white", textAlign:"center", backdropFilter:"blur(8px)" }}>
                  <div style={{ fontSize:"2rem", fontWeight:400, lineHeight:1 }}>{s.num}</div>
                  <div style={{ marginTop:4, fontSize:11, color:"rgba(255,255,255,0.7)", fontFamily:"sans-serif" }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── SEARCH + FILTER ── */}
        <section style={{ maxWidth:1000, margin:"0 auto", padding:"48px 16px 16px" }}>
          <div style={{ position:"relative", maxWidth:600, margin:"0 auto" }}>
            <Search style={{ position:"absolute", left:18, top:"50%", transform:"translateY(-50%)", width:16, height:16, color:"rgba(45,80,22,0.4)", pointerEvents:"none" }}/>
            <input className="search-input" placeholder="Search diseases…" value={search} onChange={e => setSearch(e.target.value)}/>
          </div>
          <div style={{ marginTop:16, display:"flex", flexWrap:"wrap", justifyContent:"center", gap:8 }}>
            {labels.map(label => (
              <button key={label} className={`filter-pill ${filter === label ? "active" : ""}`} onClick={() => setFilter(label)}>{label}</button>
            ))}
          </div>

          {selectedLang.code !== "en" && (
            <motion.div
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
              style={{ marginTop:16, textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", gap:8, fontFamily:"sans-serif", fontSize:13, color:"#2D5016" }}
            >
              <Globe style={{ width:14, height:14 }}/>
              {translating
                ? `Translating to ${selectedLang.native}… ${progress.done}/${progress.total} done`
                : `Showing in ${selectedLang.flag} ${selectedLang.native}`
              }
              <button
                onClick={() => handleLanguageSelect(LANGUAGES[0])}
                style={{ marginLeft:8, background:"#fee2e2", border:"none", borderRadius:999, padding:"3px 10px", fontSize:11, cursor:"pointer", color:"#c0392b", fontFamily:"sans-serif" }}
              >
                Reset to English
              </button>
            </motion.div>
          )}

          <p style={{ marginTop:12, textAlign:"center", fontSize:13, color:"rgba(44,44,44,0.5)", fontFamily:"sans-serif" }}>
            Showing <strong style={{ color:"#1a3a0a" }}>{filtered.length}</strong> of {DISEASES.length} diseases
          </p>
        </section>

        {/* ── GRID ── */}
        <section style={{ maxWidth:1280, margin:"0 auto", padding:"8px 16px 80px" }}>
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ padding:"80px 0", textAlign:"center" }}>
                <div style={{ fontSize:48 }}>🔍</div>
                <p style={{ marginTop:16, fontSize:17, color:"rgba(44,44,44,0.6)", fontFamily:"sans-serif" }}>No diseases match your search.</p>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                style={{ display:"grid", gap:24, gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))" }}
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              >
                {filtered.map((disease, i) => (
                  <DiseaseCard
                    key={disease.id}
                    disease={disease}
                    index={i}
                    onClick={setSelected}
                    translatedData={translations[disease.id] || null}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* ── CTA ── */}
        <section style={{ maxWidth:1280, margin:"0 auto", padding:"0 16px 64px" }}>
          <motion.div
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ overflow:"hidden", borderRadius:"2.5rem", background:"linear-gradient(135deg,#1b3a0f,#2d5016)", padding:64, textAlign:"center", boxShadow:"0 20px 60px rgba(26,58,10,0.2)" }}
          >
            <div style={{ fontSize:48 }}>🍅</div>
            <h2 style={{ marginTop:16, fontSize:28, color:"white", fontStyle:"italic" }}>Think your plant has one of these?</h2>
            <p style={{ marginTop:12, maxWidth:480, margin:"12px auto 0", fontSize:15, lineHeight:1.8, color:"#c8e6a0", fontFamily:"sans-serif" }}>
              Upload a clear photo of the affected leaf to our AI classifier for instant disease identification.
            </p>
            <button
              onClick={() => window.location.href="/predictions"}
              style={{ marginTop:32, display:"inline-flex", alignItems:"center", gap:8, background:"#E63946", color:"white", border:"none", borderRadius:999, padding:"14px 32px", fontSize:14, fontWeight:700, cursor:"pointer", boxShadow:"0 8px 24px rgba(230,57,70,0.4)", fontFamily:"sans-serif", transition:"all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.background = "#c0392b"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "#E63946"; }}
            >
              🍅 Analyze a leaf now →
            </button>
          </motion.div>
        </section>
      </main>

      <footer style={{ background:"#1b3a0f", padding:"40px 24px", textAlign:"center" }}>
        <p style={{ color:"#a5d6a7", fontFamily:"sans-serif", fontSize:13, margin:0 }}>
          🌿 Disease Database · Agro AI · Free translation via Google Translate
        </p>
        <button onClick={() => window.location.href="/"} style={{ marginTop:16, background:"transparent", border:"1px solid rgba(165,214,167,0.35)", borderRadius:999, padding:"8px 22px", color:"#a5d6a7", fontSize:13, cursor:"pointer", fontFamily:"sans-serif" }}>
          ← Back to Home
        </button>
      </footer>

      {/* ── DETAIL MODAL ── */}
      <AnimatePresence>
        {selected && (
          <DetailModal
            disease={selected}
            onClose={() => setSelected(null)}
            translatedData={translations[selected.id] || null}
          />
        )}
      </AnimatePresence>
    </div>
  );
}