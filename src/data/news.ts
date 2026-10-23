export interface NewsBulletin {
  id: string;
  source: string;
  timestamp: string;
  category: "BREAKING" | "CRIME" | "CORPORATE" | "WEATHER" | "CULTURE";
  headline: string;
  body: string;
}

export const N54_HEADLINES: string[] = [
  "N54 SPECIAL: SANTO DOMINGO HIGHWAY PURSUIT TERMINATES WITH EXPERIMENTAL SPEEDWARE DETONATION",
  "ARASAKA COUNTER-INTEL DENIES ORBITAL CARRIER INTERCEPT OVER CORONADO BAY",
  "TRAUMA TEAM INTERNATIONAL SUSPENDS TIER-4 COVERAGE ACROSS PACIFICA COMBAT ZONE",
  "MILITECH CONTRACTOR FARADAY REPORTED UNACCOUNTED FOR FOLLOWING PLAZA DISPATCH",
  "NCPD DISPATCH: 14 INDEPENDENT APPREHENSIONS LOGGED BY MAX-TAC ALPHA DIVISION",
  "BIO-TECHNICA HARVEST CONVOY LOSS RECORDED NEAR FLATS KILOMETER 18",
  "AFTERLIFE FIXER ROGUE AMENDIARES ISSUES RESTRICTED CONTRACT QUOTA FOR CITY CENTER",
  "WEATHER WARNING: ACID RAIN PH LEVEL 3.2 DETECTED ACROSS WATSON INDUSTRIAL CORRIDOR",
  "LUNAR TOURISM CORP: TICKETS TO TYCHO RESORT CRATER SURPASS 250,000 ED RECORD",
];

export const N54_BULLETINS: NewsBulletin[] = [
  {
    id: "n54-01",
    source: "N54 NIGHTLY LIVE",
    timestamp: "23:42:19 NCST",
    category: "BREAKING",
    headline: "MASSIVE CATACLYSM AT ARASAKA TOWER COMMERCE CENTER",
    body: "An unidentified rogue cyberpsycho wielding experimental Arasaka gravity exoskeleton technology caused catastrophic structural failure across 40 floors of the central corporate tower. MAX-TAC heavy division deployed alongside corporate special forces. Civilian access strictly quarantined.",
  },
  {
    id: "n54-02",
    source: "WNS DISPATCH",
    timestamp: "21:15:04 NCST",
    category: "CRIME",
    headline: "SANTO DOMINGO GANG CARRIER AMBUSH TERMINATES IN FLAMES",
    body: "Gunfire between unidentified mercenary operatives and corporate convoys shut down Route 101 for four hours. Local municipal EMT units evacuated after secondary detonations tore through roadside power conduits.",
  },
  {
    id: "n54-03",
    source: "ARASAKA SECURITY BULLETIN",
    timestamp: "18:02:40 NCST",
    category: "CORPORATE",
    headline: "COUNTER-INTELLIGENCE PROTOCOL LEVEL BLACK ISSUED",
    body: "Sub-net security breaches detected in regional training terminals. Unauthorized deep-dive access into classified relational data resulted in immediate neural purge protocols. Arasaka reminds citizens that proprietary data retrieval is punishable by terminal forfeiture.",
  },
  {
    id: "n54-04",
    source: "NIGHT CITY ENVIRONMENTAL",
    timestamp: "14:20:12 NCST",
    category: "WEATHER",
    headline: "ACID PRECIPITATION WARNING OVER WATSON & HEYWOOD",
    body: "Heavy particulate discharge from industrial refineries combined with coastal stormfronts has elevated precipitation toxicity. Pedestrians advised to wear sealed respiratory gear and protective coats. Cyberware joints subject to accelerated galvanic corrosion.",
  },
  {
    id: "n54-05",
    source: "ORBITAL AIR COMMUNICATIONS",
    timestamp: "09:44:55 NCST",
    category: "CULTURE",
    headline: "TYCHO BASIN LUNAR COLONY ANNOUNCES SECOND EXPANSION PHASE",
    body: "One-way and round-trip passenger shuttles departing Night City spaceport report sold-out rosters through third quarter. Starting fare remains steady at 250,000 eurodollars per seat.",
  },
];

