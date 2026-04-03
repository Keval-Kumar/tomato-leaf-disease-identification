
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, Upload, X, Menu, Leaf, ShieldCheck,
  Eye, AlertTriangle, Shield, Zap, RefreshCw,
  Globe, Check, Cpu, Sparkles,
} from "lucide-react";

// const FLASK_PROXY_URL = "http://localhost:5000";
const FLASK_PROXY_URL = "https://tomato-leaf-disease-identification.onrender.com";

const DISEASE_DETAILS = {
  leaf_curl_virus: {
    displayName:"Leaf Curl Virus",emoji:"🌀",color:"#7c3aed",bg:"#f3e8ff",
    label:"Viral",severity:"High",severityColor:"#dc2626",
    symptoms:["Upward or downward curling of leaves","Yellowing and chlorosis between leaf veins","Stunted, bushy plant growth","Reduced fruit size and yield","Thickened, leathery leaf texture"],
    causes:["Bemisia tabaci (silverleaf whitefly) as primary vector","Virus spreads rapidly during hot, dry weather","Infected transplants introduced to the field","High whitefly populations in surrounding areas"],
    prevention:["Use virus-resistant varieties (e.g., Arka Rakshak)","Install 50-mesh insect-proof netting in nurseries","Apply reflective mulch to repel whiteflies","Remove and destroy infected plants immediately","Avoid planting near infected fields"],
    treatment:["No cure exists — focus on vector management","Spray imidacloprid 17.8 SL @ 0.3 ml/L water","Apply neem oil (5 ml/L) every 7 days","Use yellow sticky traps to monitor & trap whiteflies","Remove heavily infected plants to protect surrounding crop"],
  },
  spider_mites:{
    displayName:"Spider Mites",emoji:"🕷️",color:"#b45309",bg:"#fef3c7",
    label:"Pest",severity:"Medium",severityColor:"#d97706",
    symptoms:["Fine silvery or bronze stippling on upper leaf surface","Visible fine webbing on leaf undersides","Leaves turn yellow, dry, and drop prematurely","Tiny moving dots (mites) visible with a magnifying glass","Plant vigor declines rapidly in hot, dry conditions"],
    causes:["Tetranychus urticae (two-spotted spider mite)","Hot, dry conditions accelerate reproduction","Pesticide overuse killing natural predators","Dusty conditions favour population explosions"],
    prevention:["Maintain adequate soil moisture and irrigation","Avoid excessive nitrogen fertiliser","Introduce predatory mites (Phytoseiidae spp.)","Monitor plants twice weekly from crop establishment","Keep field surroundings weed-free"],
    treatment:["Spray abamectin 1.8 EC @ 0.5 ml/L water","Apply spiromesifen 22.9 SC @ 0.5 ml/L water","Use neem oil + soap solution every 5–7 days","Strong water sprays dislodge colonies from undersides","Rotate miticides to prevent resistance"],
  },
  leaf_mold:{
    displayName:"Leaf Mold",emoji:"🍂",color:"#065f46",bg:"#d1fae5",
    label:"Fungal",severity:"Medium",severityColor:"#d97706",
    symptoms:["Pale green to yellow spots on upper leaf surface","Olive-green to brown velvety mold on undersides","Infected leaves curl upward and eventually die","Severe infections spread to stems and blossoms","Reduced photosynthesis and premature defoliation"],
    causes:["Passalora fulva fungus","Relative humidity above 85% for extended periods","Poor greenhouse/polyhouse ventilation","Temperatures between 22–24°C favour sporulation"],
    prevention:["Plant resistant varieties","Maintain humidity below 85% with ventilation","Space plants adequately for air circulation","Avoid overhead irrigation — use drip systems","Remove and destroy crop debris after harvest"],
    treatment:["Spray mancozeb 75 WP @ 2.5 g/L water","Apply chlorothalonil 75 WP @ 2 g/L water","Use copper oxychloride 50 WP @ 3 g/L water","Trifloxystrobin + tebuconazole at label rates","Repeat spray every 10–12 days under humid conditions"],
  },
  leaf_miner:{
    displayName:"Leaf Miner",emoji:"🐛",color:"#92400e",bg:"#fef3c7",
    label:"Pest",severity:"Low",severityColor:"#16a34a",
    symptoms:["Serpentine white or yellowish winding tunnels in leaves","Brown blotches where larvae feed intensively","Premature leaf drop in severe infestations","Tiny dark larvae visible within mines when held to light","Stippled feeding scars from adult flies"],
    causes:["Liriomyza trifolii and L. sativae (agromyzid flies)","Adults lay eggs in leaf tissue; larvae mine internally","Warm temperatures (25–30°C) speed development","Resistance to insecticides complicates management"],
    prevention:["Use fine mesh netting over seedbeds","Apply yellow sticky traps at 25 per hectare","Encourage parasitic wasps (Diglyphus, Dacnusa spp.)","Rotate crops to break pest cycle","Monitor adult flight activity with traps"],
    treatment:["Cyromazine 75 WP @ 0.75 g/L water","Abamectin 1.8 EC @ 0.5 ml/L water","Remove and destroy heavily mined leaves","Spinosad 45 SC @ 0.3 ml/L targets larvae","Avoid broad-spectrum insecticides to protect parasitoids"],
  },
  late_blight:{
    displayName:"Late Blight",emoji:"💀",color:"#991b1b",bg:"#fee2e2",
    label:"Fungal / Oomycete",severity:"Critical",severityColor:"#dc2626",
    symptoms:["Water-soaked, irregular dark lesions on leaves and stems","White cottony mold on lesion undersides in humid conditions","Brown to black discoloration spreads rapidly","Fruit develops brown, greasy-looking firm rot","Entire plant can die in 7–10 days"],
    causes:["Phytophthora infestans (oomycete water mold)","Cool (10–25°C), wet weather with high humidity (>90%)","Infected seed or transplants introduce the pathogen","Wind-dispersed sporangia spread infection rapidly"],
    prevention:["Plant certified disease-free transplants only","Use resistant varieties (Defiant, Iron Lady)","Apply preventive copper fungicide before disease onset","Avoid overhead irrigation; water at soil level","Improve field drainage; avoid low-lying plots"],
    treatment:["Spray metalaxyl + mancozeb (Ridomil Gold) @ 2.5 g/L","Cymoxanil + mancozeb @ 2 g/L water","Dimethomorph 50 WP @ 1 g/L in severe outbreaks","Remove and destroy all infected plant material immediately","Rotate fungicide classes to prevent resistance"],
  },
  insect_damage:{
    displayName:"Insect Damage",emoji:"🦟",color:"#1d4ed8",bg:"#dbeafe",
    label:"Pest",severity:"Medium",severityColor:"#d97706",
    symptoms:["Ragged holes and bite marks on leaves","Rolled or distorted young leaves (thrips feeding)","Silvery streaks on leaf surface (thrips)","Deformed fruit with surface scars or tunnels","Sticky honeydew deposits leading to sooty mold"],
    causes:["Helicoverpa armigera (fruit borer) — major pest","Thrips tabaci and Frankliniella occidentalis","Myzus persicae (green peach aphid)","Spodoptera litura (tobacco caterpillar)"],
    prevention:["Install pheromone traps (Helicoverpa, Spodoptera)","Use light traps to monitor adult moth populations","Encourage natural enemies: lady beetles, lacewings","Apply IIHR tomato pest management schedule","Maintain weed-free field margins"],
    treatment:["Emamectin benzoate 5 SG @ 0.4 g/L for caterpillars","Spinosad 45 SC @ 0.3 ml/L for thrips","Imidacloprid 17.8 SL @ 0.3 ml/L for aphids","Chlorpyrifos 20 EC @ 2.5 ml/L for soil pests","Bacillus thuringiensis for caterpillar biocontrol"],
  },
  healthy:{
    displayName:"Healthy",emoji:"✅",color:"#15803d",bg:"#dcfce7",
    label:"No Disease",severity:"None",severityColor:"#16a34a",
    symptoms:["Deep, uniform green colour throughout the leaf","No spots, lesions, or discoloration","Firm texture without curling or wilting","Normal leaf veination clearly visible","Appropriate size for the plant's growth stage"],
    causes:["Optimal soil pH (6.0–6.8)","Balanced NPK nutrition","Adequate, consistent irrigation","Good pest and disease prevention practices"],
    prevention:["Maintain regular scouting schedules (twice weekly)","Continue balanced nutrition and irrigation","Keep up preventive fungicide and pest management","Monitor weather for incoming disease pressure","Rotate crops in subsequent seasons"],
    treatment:["No treatment needed — maintain current practices","Consider soil health check every season","Continue drip irrigation and mulching","Ensure continued micronutrient availability","Great work — your crop is thriving! 🎉"],
  },
  early_blight:{
    displayName:"Early Blight",emoji:"🍄",color:"#b45309",bg:"#fef3c7",
    label:"Fungal",severity:"High",severityColor:"#dc2626",
    symptoms:["Dark brown spots with concentric rings (target-board pattern)","Yellow halo surrounding individual lesions","Spots coalesce causing large areas of dead tissue","Disease starts on older lower leaves, moves upward","Fruit develops dark, sunken, leathery spots near stem"],
    causes:["Alternaria solani fungus","Warm temperatures (24–29°C) with wet/humid conditions","Infected crop debris in soil carries spores","Plant stress (nutrient deficiency, drought) increases susceptibility"],
    prevention:["Use certified disease-free seed and transplants","Apply preventive mancozeb spray from early stages","Remove lower leaves as the season progresses","Avoid excessive nitrogen fertilisation","Practice 3–4 year crop rotation"],
    treatment:["Mancozeb 75 WP @ 2 g/L water (contact fungicide)","Azoxystrobin 23 SC @ 1 ml/L water","Propiconazole 25 EC @ 1 ml/L water","Copper oxychloride 50 WP @ 3 g/L water","Spray every 7–10 days; alternate fungicide classes"],
  },
  cercospora_leaf_mold:{
    displayName:"Cercospora Leaf Mold",emoji:"🔵",color:"#0369a1",bg:"#e0f2fe",
    label:"Fungal",severity:"Medium",severityColor:"#d97706",
    symptoms:["Small (2–3 mm) dark brown circular spots","Spots develop a lighter grey or white centre","Yellow halo may surround individual spots","Spots may coalesce under heavy disease pressure","Premature leaf senescence and defoliation"],
    causes:["Cercospora fuligena fungus","Warm, humid conditions (>25°C, RH >80%)","Extended leaf wetness from dew or rain","Infected plant debris carries overwintering spores"],
    prevention:["Use resistant or tolerant tomato varieties","Apply mulch to reduce soil splash of spores","Use drip irrigation to keep foliage dry","Remove infected leaf material from the field","Rotate with non-solanaceous crops for 2+ years"],
    treatment:["Chlorothalonil 75 WP @ 2 g/L water","Azoxystrobin + difenoconazole @ 1 ml/L","Mancozeb 75 WP @ 2.5 g/L water","Begin spray programme at first sign of symptoms","Repeat every 10–14 days through humid season"],
  },
  bacterial_spot:{
    displayName:"Bacterial Spot",emoji:"🦠",color:"#7f1d1d",bg:"#fee2e2",
    label:"Bacterial",severity:"High",severityColor:"#dc2626",
    symptoms:["Water-soaked, greasy-looking small spots on leaves","Spots turn dark brown to black with a yellow margin","Raised, scabby, rough lesions on fruit surface","Stems develop dark, elongated cankers","Severe defoliation under wet, windy conditions"],
    causes:["Xanthomonas vesicatoria and related species","Seed-borne pathogen; survives in infected debris","Spreads rapidly through rain splash and wind","Warm (24–30°C), wet, humid conditions"],
    prevention:["Use certified disease-free or hot-water treated seed","Treat transplants with copper bactericide before planting","Avoid working in wet fields (reduces spread)","Use drip irrigation to keep foliage dry","Choose resistant varieties where available"],
    treatment:["Copper hydroxide 77 WP @ 3 g/L water","Copper oxychloride 50 WP @ 3 g/L water","Streptomycin sulfate 90 SP @ 0.5 g/L (if approved)","Apply at 5–7 day intervals during wet conditions","No curative bactericide exists — prevention is key"],
  },
  other:{
    displayName:"Other / Unknown",emoji:"❓",color:"#374151",bg:"#f3f4f6",
    label:"Unclassified",severity:"Unknown",severityColor:"#6b7280",
    symptoms:["Unusual discoloration not matching known disease patterns","Atypical lesion shape or distribution","Multiple overlapping symptoms suggesting co-infection","Abiotic stress symptoms (nutrient deficiency, sun scorch)","Herbicide drift or chemical injury patterns"],
    causes:["Nutrient deficiencies (calcium, magnesium, boron)","Chemical injury from herbicide drift or misapplication","Abiotic stress: sun scorch, frost, wind burn","Rare or emerging pathogens not in training data"],
    prevention:["Maintain comprehensive crop health records","Take clear photos for expert diagnosis","Consult your local Krishi Vigyan Kendra (KVK)","Send samples to the state plant disease diagnostic lab","Follow general good agronomic practices"],
    treatment:["Consult a certified agronomist before any treatment","Submit leaf samples to a diagnostic laboratory","Contact your state agriculture department helpline","Do not apply chemicals without confirmed diagnosis","Monitor plants closely for symptom progression"],
  },
};

function normaliseKey(raw) {
  if (!raw) return "other";
  const cleaned = raw.toString().toLowerCase().trim().replace(/[\s\-]+/g,"_");
  if (DISEASE_DETAILS[cleaned]) return cleaned;
  for (const key of Object.keys(DISEASE_DETAILS)) {
    if (cleaned.includes(key) || key.includes(cleaned)) return key;
  }
  return "other";
}

const LANGUAGES = [
  {code:"en",label:"English",flag:"🇬🇧",native:"English"},
  {code:"hi",label:"Hindi",flag:"🇮🇳",native:"हिंदी"},
  {code:"kn",label:"Kannada",flag:"🇮🇳",native:"ಕನ್ನಡ"},
  {code:"te",label:"Telugu",flag:"🇮🇳",native:"తెలుగు"},
  {code:"ta",label:"Tamil",flag:"🇮🇳",native:"தமிழ்"},
  {code:"mr",label:"Marathi",flag:"🇮🇳",native:"मराठी"},
  {code:"pa",label:"Punjabi",flag:"🇮🇳",native:"ਪੰਜਾਬੀ"},
  {code:"gu",label:"Gujarati",flag:"🇮🇳",native:"ગુજરાતી"},
  {code:"ml",label:"Malayalam",flag:"🇮🇳",native:"മലയാളം"},
  {code:"bn",label:"Bengali",flag:"🇮🇳",native:"বাংলা"},
  {code:"fr",label:"French",flag:"🇫🇷",native:"Français"},
  {code:"es",label:"Spanish",flag:"🇪🇸",native:"Español"},
  {code:"de",label:"German",flag:"🇩🇪",native:"Deutsch"},
  {code:"zh",label:"Chinese",flag:"🇨🇳",native:"中文"},
  {code:"ar",label:"Arabic",flag:"🇸🇦",native:"العربية"},
];
const GOOGLE_CODE = {en:"en",hi:"hi",kn:"kn",te:"te",ta:"ta",mr:"mr",pa:"pa",gu:"gu",ml:"ml",bn:"bn",fr:"fr",es:"es",de:"de",zh:"zh-CN",ar:"ar"};

async function freeTranslateText(text, targetLang) {
  if (!text || targetLang === "en") return text;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  const data = await res.json();
  return data[0].map(i => i[0]).join("");
}
async function freeTranslateArray(arr, targetLang) {
  if (!arr?.length || targetLang === "en") return arr;
  const DELIM = " |||SPL||| ";
  const translated = await freeTranslateText(arr.join(DELIM), targetLang);
  const parts = translated.split(/\|\|\|SPL\|\|\|/);
  return parts.length === arr.length ? parts.map(s => s.trim()) : arr;
}

function LangPickerModal({ currentLang, accentColor, onSelect, onClose }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,zIndex:300,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}
      onClick={onClose}>
      <motion.div initial={{scale:0.88,opacity:0,y:24}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.88,opacity:0,y:24}}
        transition={{type:"spring",stiffness:320,damping:28}} onClick={e=>e.stopPropagation()}
        style={{background:"white",borderRadius:28,width:"min(520px,100%)",maxHeight:"80vh",overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,0.28)",display:"flex",flexDirection:"column"}}>
        <div style={{background:`linear-gradient(135deg,${accentColor},${accentColor}bb)`,padding:"22px 26px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <Globe style={{width:20,height:20,color:"white"}}/>
            <div>
              <div style={{color:"white",fontWeight:800,fontSize:16,fontFamily:"sans-serif"}}>Choose Language</div>
              <div style={{color:"rgba(255,255,255,0.7)",fontSize:11,fontFamily:"sans-serif",marginTop:2}}>Translates entire result instantly</div>
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,0.2)",border:"none",borderRadius:"50%",width:34,height:34,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <X style={{width:16,height:16,color:"white"}}/>
          </button>
        </div>
        <div style={{overflowY:"auto",padding:"16px 20px 20px",flex:1}}>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:10}}>
            {LANGUAGES.map(lang => {
              const sel = currentLang?.code === lang.code;
              return (
                <button key={lang.code} onClick={()=>onSelect(lang)}
                  style={{background:sel?`${accentColor}15`:"#f9f9f7",border:sel?`2px solid ${accentColor}`:"2px solid transparent",borderRadius:16,padding:"14px 12px",cursor:"pointer",textAlign:"left",transition:"all 0.18s",position:"relative",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:22}}>{lang.flag}</span>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:13,color:sel?accentColor:"#2d3436",fontFamily:"sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{lang.native}</div>
                    <div style={{fontSize:10,color:"#9e9e9e",fontFamily:"sans-serif"}}>{lang.label}</div>
                  </div>
                  {sel && <div style={{position:"absolute",top:8,right:8,width:18,height:18,background:accentColor,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}><Check style={{width:10,height:10,color:"white"}}/></div>}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{padding:"10px 20px 14px",borderTop:"1px solid #f0f0f0",fontSize:10,color:"#bdbdbd",textAlign:"center",fontFamily:"sans-serif",flexShrink:0}}>
          Free translation via Google Translate · No API key needed
        </div>
      </motion.div>
    </motion.div>
  );
}

const INFO_TABS = [
  {id:"symptoms",label:"Symptoms",icon:<Eye className="h-4 w-4"/>,color:"#dc2626"},
  {id:"causes",label:"Causes",icon:<AlertTriangle className="h-4 w-4"/>,color:"#d97706"},
  {id:"prevention",label:"Prevention",icon:<Shield className="h-4 w-4"/>,color:"#16a34a"},
  {id:"treatment",label:"Treatment",icon:<Zap className="h-4 w-4"/>,color:"#1d4ed8"},
];

function DiseaseInfoPanel({ diseaseKey, overrideInfo }) {
  const [activeTab, setActiveTab] = useState("symptoms");
  const base = DISEASE_DETAILS[diseaseKey] || DISEASE_DETAILS["other"];
  const info = overrideInfo ? { ...base, ...overrideInfo } : base;
  const tabData = { symptoms:info.symptoms, causes:info.causes, prevention:info.prevention, treatment:info.treatment };

  return (
    <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.5}}
      style={{background:"white",borderRadius:28,overflow:"hidden",border:`1.5px solid ${base.color}22`,boxShadow:`0 12px 40px ${base.color}18,0 4px 16px rgba(0,0,0,0.06)`}}>
      <div style={{background:`linear-gradient(135deg,${base.color},${base.color}cc)`,padding:"28px 32px",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",right:-20,top:-20,width:120,height:120,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
        <div style={{display:"flex",alignItems:"center",gap:16,position:"relative"}}>
          <div style={{width:56,height:56,borderRadius:18,background:"rgba(255,255,255,0.2)",backdropFilter:"blur(10px)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>{base.emoji}</div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{background:"rgba(255,255,255,0.25)",borderRadius:999,padding:"2px 10px",fontSize:10,fontWeight:700,color:"white",letterSpacing:"0.12em",textTransform:"uppercase",fontFamily:"sans-serif"}}>{info.label||base.label}</span>
              <span style={{background:base.severityColor+"44",borderRadius:999,padding:"2px 10px",fontSize:10,fontWeight:700,color:"white",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"sans-serif"}}>{info.severity||base.severity} severity</span>
            </div>
            <h3 style={{fontFamily:"Georgia,serif",fontSize:22,fontWeight:700,color:"white",margin:0}}>{info.displayName||base.displayName}</h3>
          </div>
        </div>
      </div>
      <div style={{display:"flex",borderBottom:"1px solid #f0f0f0",background:"#fafaf8"}}>
        {INFO_TABS.map(tab=>(
          <button key={tab.id} onClick={()=>setActiveTab(tab.id)}
            style={{flex:1,padding:"14px 8px",background:"none",border:"none",cursor:"pointer",borderBottom:activeTab===tab.id?`2.5px solid ${tab.color}`:"2.5px solid transparent",display:"flex",flexDirection:"column",alignItems:"center",gap:4,transition:"all 0.2s",color:activeTab===tab.id?tab.color:"#9e9e9e"}}>
            <span style={{color:activeTab===tab.id?tab.color:"#bdbdbd"}}>{tab.icon}</span>
            <span style={{fontSize:10,fontWeight:700,fontFamily:"sans-serif",letterSpacing:"0.1em",textTransform:"uppercase"}}>{tab.label}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.2}} style={{padding:"24px 28px"}}>
          <ul style={{listStyle:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:12}}>
            {(tabData[activeTab]||[]).map((item,i)=>{
              const tab = INFO_TABS.find(t=>t.id===activeTab);
              return (
                <li key={i} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:tab.color+"15",border:`1.5px solid ${tab.color}33`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:tab.color}}/>
                  </div>
                  <span style={{fontSize:13.5,color:"#3d3d3a",lineHeight:1.65,fontFamily:"sans-serif"}}>{item}</span>
                </li>
              );
            })}
          </ul>
        </motion.div>
      </AnimatePresence>
      <div style={{padding:"14px 28px",background:"#f9f9f7",borderTop:"1px solid #f0f0f0"}}>
        <p style={{margin:0,fontSize:11,color:"#9e9e9e",fontFamily:"sans-serif"}}>Always consult a certified agronomist or your local KVK before applying any treatments.</p>
      </div>
    </motion.div>
  );
}

function ConfidenceMeter({ value }) {
  const pct = Math.round((value||0)*100);
  return (
    <div style={{marginTop:14}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
        <span style={{fontFamily:"sans-serif",fontSize:12,color:"rgba(255,255,255,0.7)"}}>Confidence</span>
        <span style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"white"}}>{pct}%</span>
      </div>
      <div style={{height:10,background:"rgba(255,255,255,0.2)",borderRadius:999,overflow:"hidden"}}>
        <motion.div initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1.2,ease:"easeOut"}}
          style={{height:"100%",background:"rgba(255,255,255,0.9)",borderRadius:999}}/>
      </div>
    </div>
  );
}

function TranslatingOverlay({ langName, color }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      style={{position:"fixed",inset:0,zIndex:400,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <motion.div initial={{scale:0.85,opacity:0}} animate={{scale:1,opacity:1}}
        style={{background:"white",borderRadius:24,padding:"36px 48px",textAlign:"center",boxShadow:"0 24px 64px rgba(0,0,0,0.22)",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
        <div style={{width:52,height:52,border:`4px solid ${color}28`,borderTopColor:color,borderRadius:"50%",animation:"pred-spin 0.85s linear infinite"}}/>
        <div>
          <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#1a1a1a"}}>Translating…</div>
          <div style={{fontFamily:"sans-serif",fontSize:13,color:"#636e72",marginTop:4}}>Converting to <strong>{langName}</strong></div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Local model badge — replaces "Powered by Claude AI"
function ModelBadge() {
  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"linear-gradient(135deg,#2D5016,#1a3a0a)",borderRadius:999,padding:"4px 12px",marginBottom:8}}>
      <Cpu style={{width:12,height:12,color:"white"}}/>
      <span style={{fontSize:10,fontWeight:700,color:"white",letterSpacing:"0.15em",textTransform:"uppercase",fontFamily:"sans-serif"}}>AGRO AI Model</span>
      <Sparkles style={{width:10,height:10,color:"#f9a825"}}/>
    </div>
  );
}

export default function PredictionPage() {
  const [mobileMenuOpen,setMobileMenuOpen] = useState(false);
  const [scrolled,setScrolled] = useState(false);
  const [file,setFile] = useState(null);
  const [previewUrl,setPreviewUrl] = useState("");
  const [loading,setLoading] = useState(false);
  const [loadingStep,setLoadingStep] = useState("");
  const [result,setResult] = useState(null);
  const [error,setError] = useState("");
  const [diseaseKey,setDiseaseKey] = useState(null);
  const [serverOnline,setServerOnline] = useState(null);

  const [showLangPicker,setShowLangPicker] = useState(false);
  const [translating,setTranslating] = useState(false);
  const [translateError,setTranslateError] = useState("");
  const [selectedLang,setSelectedLang] = useState(null);
  const [translatedInfo,setTranslatedInfo] = useState(null);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${FLASK_PROXY_URL}/health`, { signal: AbortSignal.timeout(60000) });
        setServerOnline(res.ok);
      } catch { setServerOnline(false); }
    };
    checkServer();
  }, []);

  useEffect(()=>{
    const onScroll=()=>setScrolled(window.scrollY>16);
    window.addEventListener("scroll",onScroll,{passive:true}); onScroll();
    return ()=>window.removeEventListener("scroll",onScroll);
  },[]);

  useEffect(()=>{
    if(!file){setPreviewUrl("");return;}
    const url=URL.createObjectURL(file);
    setPreviewUrl(url);
    return ()=>URL.revokeObjectURL(url);
  },[file]);

  const handleAnalyze = async () => {
    setError(""); setResult(null); setDiseaseKey(null);
    setTranslatedInfo(null); setSelectedLang(null); setTranslateError("");
    if (!file) { setError("Please select an image file first."); return; }

    try {
      setLoading(true);
      setLoadingStep("Reading image…");

      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setLoadingStep("Running AI model…");

      const response = await fetch(`${FLASK_PROXY_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Data, mediaType: file.type || "image/jpeg" }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(()=>({}));
        throw new Error(errData?.error || `Server error ${response.status}`);
      }

      const apiData = await response.json();
      setLoadingStep("Processing results…");

      const rawText = apiData.content.filter(b=>b.type==="text").map(b=>b.text).join("");
      const parsed = JSON.parse(rawText);
      if (!parsed.prediction) throw new Error("No prediction returned.");

      setResult(parsed);
      const key = normaliseKey(parsed.prediction);
      setDiseaseKey(key);

      setTimeout(()=>{
        document.getElementById("result-section")?.scrollIntoView({behavior:"smooth",block:"start"});
      },300);

    } catch (e) {
      if (e.name==="TypeError"||e.message?.includes("fetch")||e.message?.includes("Failed to fetch")) {
        setServerOnline(false);
        setError("Cannot reach the Flask server. Make sure you ran: python server.py");
      } else {
        setError(e.message || "Analysis failed. Try a clear, well-lit photo.");
      }
    } finally {
      setLoading(false); setLoadingStep("");
    }
  };

  const handleSelectLang = async (lang) => {
    setShowLangPicker(false);
    if (lang.code==="en"){setSelectedLang(lang);setTranslatedInfo(null);setTranslateError("");return;}
    const info = DISEASE_DETAILS[diseaseKey]||DISEASE_DETAILS["other"];
    const gLang = GOOGLE_CODE[lang.code]||lang.code;
    setSelectedLang(lang); setTranslating(true); setTranslateError(""); setTranslatedInfo(null);
    try {
      const [displayName,label,severity,symptoms,causes,prevention,treatment] = await Promise.all([
        freeTranslateText(info.displayName,gLang), freeTranslateText(info.label,gLang),
        freeTranslateText(info.severity,gLang), freeTranslateArray(info.symptoms,gLang),
        freeTranslateArray(info.causes,gLang), freeTranslateArray(info.prevention,gLang),
        freeTranslateArray(info.treatment,gLang),
      ]);
      setTranslatedInfo({displayName,label,severity,symptoms,causes,prevention,treatment});
    } catch(e){setTranslateError(e.message||"Translation failed.");}
    finally{setTranslating(false);}
  };

  const handleReset = () => {
    setFile(null); setPreviewUrl(""); setResult(null); setDiseaseKey(null);
    setError(""); setTranslatedInfo(null); setSelectedLang(null);
    setShowLangPicker(false); setTranslateError("");
  };

  const baseInfo = diseaseKey ? DISEASE_DETAILS[diseaseKey] : null;
  const displayInfo = translatedInfo ? { ...baseInfo, ...translatedInfo } : baseInfo;

  return (
    <div className="min-h-screen overflow-x-hidden text-[#1A1A1A]"
      style={{fontFamily:"Inter,ui-sans-serif,system-ui,sans-serif",background:"linear-gradient(180deg,#FEFDFB 0%,#F5F1E8 48%,#F3EFE4 100%)"}}>
      <style>{`
        .glass{backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);background:rgba(255,255,255,0.58);}
        .shadow-soft{box-shadow:0 20px 50px rgba(26,58,10,0.12);}
        @keyframes pred-scan{0%{top:0;opacity:1}50%{opacity:0.5}100%{top:calc(100% - 3px);opacity:1}}
        @keyframes pred-spin{to{transform:rotate(360deg)}}
        @keyframes translate-pulse{0%,100%{box-shadow:0 0 0 0 rgba(127,209,79,0.4)}50%{box-shadow:0 0 0 14px rgba(127,209,79,0)}}
      `}</style>

      <AnimatePresence>
        {translating && baseInfo && <TranslatingOverlay langName={selectedLang?.native} color={baseInfo.color}/>}
      </AnimatePresence>
      <AnimatePresence>
        {showLangPicker && baseInfo && (
          <LangPickerModal currentLang={selectedLang} accentColor={baseInfo.color} onSelect={handleSelectLang} onClose={()=>setShowLangPicker(false)}/>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <header className={`fixed top-0 z-[100] w-full transition-all duration-300 ${scrolled?"glass shadow-soft border-b border-white/50":"bg-transparent"}`}>
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button className="flex items-center gap-3 rounded-full px-2 py-1" onClick={()=>window.location.href="/"}>
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#2D5016] to-[#1a3a0a] text-white ring-1 ring-white/40 shadow-lg">
              <Leaf className="h-5 w-5"/>
            </span>
            <span>
              <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.35em] text-[#2D5016]/70">Agro AI</span>
              <span className="block font-semibold text-[#1a3a0a]">Tomato Disease Identifier</span>
            </span>
          </button>
          <div className="flex items-center gap-3">
            <div style={{display:"flex",alignItems:"center",gap:6,background:"white",border:"1px solid rgba(45,80,22,0.12)",borderRadius:999,padding:"5px 12px",fontSize:11,fontFamily:"sans-serif",fontWeight:600,
              color: serverOnline===false?"#dc2626":serverOnline===true?"#15803d":"#9e9e9e"}}>
              <span style={{width:7,height:7,borderRadius:"50%",flexShrink:0,
                background: serverOnline===false?"#dc2626":serverOnline===true?"#15803d":"#d1d5db"}}/>
              {serverOnline===null?"Checking…":serverOnline?"Model server online":"Server offline"}
            </div>
            <button className="hidden rounded-full border border-[#2D5016]/15 bg-white px-4 py-2 text-sm font-medium text-[#1a3a0a] shadow-sm transition-all hover:scale-[1.03] md:inline-flex"
              onClick={()=>window.location.href="/"}>← Back Home</button>
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#2D5016]/15 bg-white text-[#1a3a0a] shadow-sm transition hover:scale-105 md:hidden"
              onClick={()=>setMobileMenuOpen(v=>!v)}>
              {mobileMenuOpen?<X className="h-5 w-5"/>:<Menu className="h-5 w-5"/>}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{opacity:0,y:-16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
              className="mx-4 mb-4 rounded-3xl border border-white/60 bg-white/90 p-4 shadow-2xl md:hidden">
              <button onClick={()=>window.location.href="/"} className="w-full rounded-2xl bg-[#2D5016] px-4 py-3 text-sm font-semibold text-white">← Back Home</button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative pt-[76px]">
        {/* PAGE HEADER */}
        <section style={{background:"linear-gradient(135deg,#1b3a0f 0%,#2d5016 60%,#162e0b 100%)",padding:"52px 24px 60px",position:"relative",overflow:"hidden"}}>
          <svg viewBox="0 0 1440 60" style={{position:"absolute",bottom:0,left:0,width:"100%",display:"block"}} preserveAspectRatio="none">
            <path d="M0 60 Q360 0 720 40 Q1080 80 1440 20 L1440 60 Z" fill="#FEFDFB"/>
          </svg>
          <div className="relative mx-auto max-w-7xl" style={{zIndex:1}}>
            <motion.div initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
              <ModelBadge/>
              <h1 style={{fontFamily:"Georgia,serif",fontSize:"clamp(2rem,5vw,3rem)",fontWeight:900,color:"white",margin:"0 0 14px",lineHeight:1.1}}>
                Upload & Identify<br/><span style={{color:"#f9a825",fontStyle:"italic"}}>Tomato Leaf Disease</span>
              </h1>
              <p style={{fontFamily:"sans-serif",fontSize:15,color:"rgba(255,255,255,0.75)",maxWidth:520,lineHeight:1.75,margin:0}}>
                our trained <strong style={{color:"#c8e6a0"}}>AGRO AI model</strong> will analyses the leaf image locally with proper image processing. Results translate into <strong style={{color:"#c8e6a0"}}>15+ languages</strong>.
              </p>
            </motion.div>
          </div>
        </section>

        {/* SERVER OFFLINE BANNER */}
        <AnimatePresence>
          {serverOnline===false && (
            <motion.div initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
              style={{background:"#fef2f2",borderBottom:"1.5px solid #fca5a5",padding:"14px 24px",display:"flex",alignItems:"flex-start",gap:14,flexWrap:"wrap"}}>
              <div style={{fontSize:20}}>⚠️</div>
              <div style={{flex:1,minWidth:200}}>
                <div style={{fontFamily:"sans-serif",fontWeight:700,fontSize:14,color:"#991b1b",marginBottom:4}}>Local model server is not running</div>
                <div style={{fontFamily:"sans-serif",fontSize:13,color:"#b91c1c",lineHeight:1.6}}>
                  Open a terminal in your project root and run:{" "}
                  <code style={{background:"#fee2e2",borderRadius:6,padding:"1px 8px",fontFamily:"monospace",fontSize:12}}>python server.py</code>
                  {" "}then click Retry.
                </div>
              </div>
              <button onClick={async()=>{
                setServerOnline(null);
                try{const r=await fetch(`${FLASK_PROXY_URL}/health`,{signal:AbortSignal.timeout(3000)});setServerOnline(r.ok);}
                catch{setServerOnline(false);}
              }} style={{background:"#dc2626",color:"white",border:"none",borderRadius:999,padding:"8px 18px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"sans-serif",whiteSpace:"nowrap"}}>
                Retry Connection
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* UPLOAD + INFO GRID */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">

            {/* LEFT: Upload card */}
            <motion.div initial={{opacity:0,x:-18}} animate={{opacity:1,x:0}} className="glass shadow-soft rounded-[2rem] border border-white/70 p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#2D5016]/70">Local Model Analysis</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-[#1a3a0a]">Upload a tomato leaf image</h2>
              <p className="mt-3 text-sm leading-7 text-[#2C2C2C]/75">Select a clear, well-lit tomato leaf disease photo. our trained AI model identifies the disease instantly.</p>

              <div className="mt-5 space-y-4">
                <label className="flex cursor-pointer flex-col gap-3 rounded-[1.5rem] border border-dashed border-[#2D5016]/20 bg-white/70 p-5 transition hover:bg-white hover:border-[#2D5016]/40">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#1a3a0a]">
                    <Upload className="h-4 w-4 text-[#E63946]"/> Select image
                  </span>
                  <span className="text-sm text-[#2C2C2C]/70">{file?`✅ ${file.name}`:"JPG, PNG, JPEG — clear leaf photo works best"}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e=>{
                    setFile(e.target.files?.[0]||null);
                    setError(""); setResult(null); setDiseaseKey(null);
                    setTranslatedInfo(null); setSelectedLang(null);
                  }}/>
                </label>

                {previewUrl && (
                  <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
                    className="overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-soft relative">
                    <img src={previewUrl} alt="Selected leaf" className="h-64 w-full object-cover"/>
                    {!result && <div style={{position:"absolute",left:0,right:0,height:2,background:"linear-gradient(90deg,transparent,#7FD14F,transparent)",animation:"pred-scan 2s ease-in-out infinite"}}/>}
                  </motion.div>
                )}

                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button type="button" onClick={handleAnalyze} disabled={loading||serverOnline===false}
                    className="inline-flex items-center gap-2 rounded-full bg-[#E63946] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.03] hover:bg-[#C86432] disabled:cursor-not-allowed disabled:opacity-70">
                    {loading?(
                      <><div style={{width:14,height:14,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"white",borderRadius:"50%",animation:"pred-spin 0.8s linear infinite"}}/>{loadingStep||"Analyzing…"}</>
                    ):(
                      <><ArrowRight className="h-4 w-4"/> Analyze Disease</>
                    )}
                  </button>
                  {(result||file)&&(
                    <button onClick={handleReset} className="inline-flex items-center gap-2 rounded-full border border-[#2D5016]/15 bg-white px-5 py-3 text-sm font-semibold text-[#1a3a0a] transition hover:scale-[1.03]">
                      <RefreshCw className="h-4 w-4"/> Reset
                    </button>
                  )}
                </div>

                {error && (
                  <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    ⚠️ {error}
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* RIGHT: info cards */}
            <div className="space-y-5">
              <motion.div initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} transition={{delay:0.1}} className="glass shadow-soft rounded-[2rem] border border-white/70 p-6 sm:p-8">
                <div className="flex items-center gap-3 text-sm font-semibold text-[#1a3a0a]"><Cpu className="h-4 w-4 text-[#2D5016]"/>How it works</div>
                <p className="mt-3 text-sm leading-7 text-[#2C2C2C]/75">Your image is sent to <code className="bg-gray-100 rounded px-1 text-xs">server</code> running locally, which passes it through our trained AI model and returns the disease prediction instantly.</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {["1. Image → Flask","2. Flask → ResNet-18","3. Result → You"].map((s,i)=>(
                    <span key={i} style={{background:"#f0f7e6",border:"1px solid #c8e6a0",borderRadius:999,padding:"4px 12px",fontSize:11,color:"#2D5016",fontFamily:"sans-serif",fontWeight:600}}>{s}</span>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} transition={{delay:0.15}} className="glass shadow-soft rounded-[2rem] border border-white/70 p-6 sm:p-8">
                <div className="flex items-center gap-3 text-sm font-semibold text-[#1a3a0a]"><ShieldCheck className="h-4 w-4 text-[#2FA0D8]"/>100% local & private</div>
                <div className="mt-4 space-y-3 text-sm text-[#2C2C2C]/75">
                  {[["#7FD14F","dark and blur images are rejected"],["#E63946","Full disease details after every prediction"],["#D4A574","Treatment & prevention in 15+ languages"]].map(([c,t])=>(
                    <div key={t} className="flex items-start gap-3"><span className="mt-1 h-2 w-2 rounded-full" style={{background:c}}/>{t}</div>
                  ))}
                </div>
              </motion.div>
              <motion.div initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} transition={{delay:0.2}} className="glass shadow-soft rounded-[2rem] border border-white/70 p-6 sm:p-8">
                <div className="flex items-center gap-3 text-sm font-semibold text-[#1a3a0a]"><Globe className="h-4 w-4 text-[#7c3aed]"/>Multi-language support</div>
                <p className="mt-3 text-sm leading-7 text-[#2C2C2C]/75">After prediction, click <strong>🌐 Translate</strong> to get the full result — symptoms, causes, prevention, treatment — in your language.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {["🇮🇳 Hindi","🇮🇳 Kannada","🇮🇳 Telugu","🇮🇳 Tamil","🇮🇳 Marathi","+ 10 more"].map(l=>(
                    <span key={l} style={{background:"#f5f5f5",borderRadius:999,padding:"4px 10px",fontSize:11,color:"#4a4a47"}}>{l}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* RESULT SECTION */}
        <AnimatePresence>
          {result && diseaseKey && baseInfo && (
            <motion.section id="result-section" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}} transition={{duration:0.6}}
              className="mx-auto max-w-7xl px-4 pb-36 sm:px-6 lg:px-8">

              <AnimatePresence>
                {translateError && (
                  <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
                    style={{background:"#fee2e2",border:"1px solid #fca5a5",borderRadius:16,padding:"14px 20px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between",gap:12,flexWrap:"wrap"}}>
                    <span style={{fontSize:13.5,color:"#c0392b",fontFamily:"sans-serif"}}>⚠️ Translation failed: {translateError}</span>
                    <button onClick={()=>selectedLang&&handleSelectLang(selectedLang)}
                      style={{background:"#c0392b",color:"white",border:"none",borderRadius:999,padding:"6px 16px",fontSize:12,cursor:"pointer",fontWeight:600,fontFamily:"sans-serif"}}>Retry</button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {selectedLang&&selectedLang.code!=="en"&&translatedInfo&&(
                  <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
                    style={{display:"inline-flex",alignItems:"center",gap:10,background:"white",borderRadius:999,padding:"8px 18px",marginBottom:14,border:`1.5px solid ${baseInfo.color}33`,boxShadow:`0 4px 16px ${baseInfo.color}18`}}>
                    <span style={{fontSize:18}}>{selectedLang.flag}</span>
                    <span style={{fontFamily:"sans-serif",fontSize:13,fontWeight:600,color:baseInfo.color}}>Showing results in {selectedLang.native}</span>
                    <button onClick={()=>{setSelectedLang({code:"en",native:"English",flag:"🇬🇧",label:"English"});setTranslatedInfo(null);}}
                      style={{background:`${baseInfo.color}18`,border:"none",borderRadius:999,padding:"2px 10px",fontSize:11,cursor:"pointer",color:baseInfo.color,fontFamily:"sans-serif",fontWeight:600}}>
                      Reset to English
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Result Banner */}
              <div style={{background:`linear-gradient(135deg,${baseInfo.color},${baseInfo.color}cc)`,borderRadius:28,padding:"32px 36px",marginBottom:20,display:"flex",alignItems:"center",gap:20,flexWrap:"wrap",position:"relative",overflow:"hidden"}}>
                <div style={{position:"absolute",right:-20,top:-20,width:140,height:140,borderRadius:"50%",background:"rgba(255,255,255,0.1)"}}/>
                <div style={{fontSize:44}}>{baseInfo.emoji}</div>
                <div style={{flex:1,minWidth:200}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <div style={{fontFamily:"sans-serif",fontSize:10,fontWeight:700,color:"rgba(255,255,255,0.65)",letterSpacing:"0.2em",textTransform:"uppercase"}}>Detection result</div>
                    <div style={{background:"rgba(255,255,255,0.15)",borderRadius:999,padding:"1px 8px",fontSize:9,color:"rgba(255,255,255,0.8)",fontFamily:"sans-serif",display:"flex",alignItems:"center",gap:4}}>
                      <Cpu style={{width:9,height:9}}/> ResNet-18
                    </div>
                  </div>
                  <h2 style={{fontFamily:"Georgia,serif",fontSize:"clamp(1.4rem,3vw,2.2rem)",fontWeight:800,color:"white",margin:"0 0 8px"}}>
                    {displayInfo?.displayName||baseInfo.displayName}
                  </h2>
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    {[displayInfo?.label||baseInfo.label,`${displayInfo?.severity||baseInfo.severity} severity`,`${Math.round((result.probability||0)*100)}% confidence`].map(tag=>(
                      <span key={tag} style={{background:"rgba(255,255,255,0.2)",borderRadius:999,padding:"3px 12px",fontSize:11,fontWeight:700,color:"white",fontFamily:"sans-serif"}}>{tag}</span>
                    ))}
                  </div>
                  <ConfidenceMeter value={result.probability}/>
                </div>
                <button onClick={handleReset}
                  style={{background:"rgba(255,255,255,0.2)",border:"1px solid rgba(255,255,255,0.3)",borderRadius:999,padding:"10px 20px",fontSize:12,fontWeight:600,color:"white",cursor:"pointer",fontFamily:"sans-serif",backdropFilter:"blur(8px)",display:"inline-flex",alignItems:"center",gap:6}}>
                  <RefreshCw style={{width:12,height:12}}/> New Analysis
                </button>
              </div>

              <DiseaseInfoPanel diseaseKey={diseaseKey} overrideInfo={translatedInfo}/>

              {result.all_predictions?.length>1&&(
                <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                  style={{marginTop:20,background:"white",borderRadius:24,padding:"24px 28px",border:"1.5px solid rgba(45,80,22,0.08)",boxShadow:"0 4px 20px rgba(45,80,22,0.06)"}}>
                  <div style={{fontFamily:"sans-serif",fontSize:11,fontWeight:700,color:"#9e9e9e",letterSpacing:"0.18em",textTransform:"uppercase",marginBottom:16}}>Other possibilities</div>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {result.all_predictions.slice(1,4).map((pred,idx)=>{
                      const pKey=normaliseKey(pred.class);
                      const pInfo=DISEASE_DETAILS[pKey]||DISEASE_DETAILS["other"];
                      const pPct=pred.confidence_percent||Math.round((pred.probability||0)*100);
                      return(
                        <div key={idx} style={{display:"flex",alignItems:"center",gap:12}}>
                          <span style={{fontSize:18}}>{pInfo.emoji}</span>
                          <span style={{fontFamily:"sans-serif",fontSize:13,color:"#4a4a47",flex:1}}>{pInfo.displayName}</span>
                          <div style={{width:100,height:6,background:"#f0f0f0",borderRadius:999,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${pPct}%`,background:pInfo.color,borderRadius:999}}/>
                          </div>
                          <span style={{fontFamily:"sans-serif",fontSize:12,fontWeight:700,color:pInfo.color,minWidth:36,textAlign:"right"}}>{pPct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </main>

      {/* FLOATING TRANSLATE BUTTON */}
      <AnimatePresence>
        {result&&diseaseKey&&!translating&&(
          <motion.button
            initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0,opacity:0}}
            transition={{type:"spring",stiffness:280,damping:22}}
            onClick={()=>setShowLangPicker(true)}
            style={{position:"fixed",bottom:28,right:28,zIndex:150,height:56,borderRadius:999,
              background:translatedInfo?`linear-gradient(135deg,${baseInfo?.color},${baseInfo?.color}bb)`:"linear-gradient(135deg,#2D5016,#1a3a0a)",
              border:"3px solid white",
              boxShadow:translatedInfo?`0 8px 32px ${baseInfo?.color}55`:"0 8px 32px rgba(45,80,22,0.45)",
              cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,padding:"0 22px",
              animation:translatedInfo?"none":"translate-pulse 2.5s ease-in-out infinite"}}>
            <Globe style={{width:20,height:20,color:"white"}}/>
            <span style={{color:"white",fontFamily:"sans-serif",fontSize:13,fontWeight:700,whiteSpace:"nowrap"}}>
              {translatedInfo?`${selectedLang?.flag} ${selectedLang?.native}`:"🌐 Translate Results"}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}