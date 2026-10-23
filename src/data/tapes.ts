export type ArchiveCategoryFilter = "all" | "web" | "creative" | "ml" | "games";

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface ProjectHighlight {
  title: string;
  detail: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
  tag?: string;
}

export interface ProjectShot {
  title: string;
  tag: string;
  caption: string;
  mediaUrl?: string;
  accent?: string;
}

export interface TapeProject {
  id: string;
  code: string;
  title: string;
  headline: string;
  year: number;
  category: string;
  categoryFilter: ArchiveCategoryFilter;
  role: string;
  client: string;
  system: string;
  tags: string[];
  summary: string;
  description?: string;
  story: string;
  color: string;
  wearSeed: number;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  metrics?: ProjectMetric[];
  problem?: {
    headline: string;
    description: string;
  };
  architecture?: {
    headline: string;
    description: string;
    highlights: ProjectHighlight[];
  };
  features?: ProjectFeature[];
  takeaways?: string[];
  shots: ProjectShot[];
  meta: {
    duration: string;
    format: string;
    channel: string;
    quality: string;
  };
}

export const ARCHIVE_CATEGORIES: { id: ArchiveCategoryFilter; label: string }[] = [
  { id: "all", label: "ALL EPISODES" },
  { id: "creative", label: "SEASON 1 (10 SHARDS)" },
];

export const TAPE_PROJECTS: TapeProject[] = [
  {
    "id": "ep-01",
    "code": "EP.01",
    "title": "LET YOU DOWN",
    "headline": "A kid from Santo Domingo with zero eddies and a military Sandevistan.",
    "year": 2076,
    "category": "BRAINDANCE SHARD",
    "categoryFilter": "creative",
    "role": "David & Gloria Martinez",
    "client": "Franz Ferdinand: This Fffire",
    "system": "Studio Trigger · CDPR · Hiroyuki Imaishi",
    "tags": [
      "Sandevistan",
      "Santo Domingo",
      "Arasaka Academy",
      "Gloria Martinez"
    ],
    "summary": "David Martinez's world shatters on a rain-slicked highway in Santo Domingo. A stray gang bullet tears through his mother's cheap sedan, leaving him with an empty bank account, a jar of ashes, and an experimental military Sandevistan spine.",
    "story": "A sudden nosebleed, the world grinding to a dead halt, and a blue sonic blur through the hallway. David slips under Katsuo's jab and drives his fist clean through the jaw of Arasaka's golden boy, cracking his skull against the lockers.",
    "color": "#0a0414",
    "wearSeed": 2076014,
    "image": "/projects/Cyberpunk Edgerunners_ Let You Down.png",
    "metrics": [
      {
        "label": "HARDWARE",
        "value": "Sandevistan Mk.V"
      },
      {
        "label": "NEURAL STRESS",
        "value": "Critical Peak"
      },
      {
        "label": "BOUNTY",
        "value": "Arasaka Red"
      },
      {
        "label": "TARGET",
        "value": "Katsuo Hospitalized"
      }
    ],
    "problem": {
      "headline": "The Inciting Incident: Blood on the Santo Domingo Freeway.",
      "description": "A sudden highway shootout leaves Gloria mortally wounded. At the underfunded municipal clinic, lack of trauma insurance means zero care. Evicted and alone, David refuses to pawn Gloria's salvaged military Sandevistan, choosing instead to bolt it onto his spine."
    },
    "architecture": {
      "headline": "Climax: The Sandevistan Hallway Retribution.",
      "description": "Mourning in silence and cornered by corporate bullies, David confronts Katsuo Tanaka in the academy corridor. One tap of his neural reflex triggers the forbidden military overdrive.",
      "highlights": [
        {
          "title": "Zero-Latency Neural Warp",
          "detail": "Time dilates to a standstill as David accelerates past human perception, leaving trailing chromatic afterimages across the hallway."
        },
        {
          "title": "One-Punch Skull Fracture",
          "detail": "A kinetic strike shatters Katsuo's reinforced jaw, humiliating Arasaka's golden elite and marking David as a fugitive."
        }
      ]
    },
    "takeaways": [
      "I'm doing this for you, David. I know you're gonna make it to the top of Arasaka Tower. (Gloria Martinez)",
      "In Night City, grief is an unaffordable luxury; chrome is the only currency that speaks."
    ],
    "shots": [
      {
        "title": "THE SANTO DOMINGO FREEWAY",
        "tag": "INCIDENT",
        "caption": "Gloria Martinez moments before the fatal crossfire on the highway.",
        "mediaUrl": "/edgerunners/ep-01/shot-01-incident.webp"
      },
      {
        "title": "BACK-ALLEY CYBERWARE",
        "tag": "HARDWARE",
        "caption": "The experimental military Sandevistan wired into Doc's operating bench.",
        "mediaUrl": "/edgerunners/ep-01/shot-02-cyberware.webp"
      },
      {
        "title": "ACADEMY STANDOFF",
        "tag": "CLIMAX",
        "caption": "David confronting Katsuo Tanaka seconds before the Sandevistan activation.",
        "mediaUrl": "/edgerunners/ep-01/shot-03-climax.webp"
      },
      {
        "title": "ARASAKA ACADEMY MONOLITH",
        "tag": "WIDE PANORAMA",
        "caption": "The towering corporate complex casting its shadow over Santo Domingo.",
        "mediaUrl": "/edgerunners/ep-01/shot-04-panoramic.webp"
      }
    ],
    "meta": {
      "duration": "24:12",
      "format": "BD SHARD",
      "channel": "S1.EP01",
      "quality": "1080P MASTER"
    }
  },
  {
    "id": "ep-02",
    "code": "EP.02",
    "title": "LIKE A BOY",
    "headline": "Pickpocketing on the NCART line. The girl with dreams of the Moon.",
    "year": 2076,
    "category": "BRAINDANCE SHARD",
    "categoryFilter": "creative",
    "role": "David Martinez & Lucy",
    "client": "Rosa Walton: I Really Want to Stay at Your House",
    "system": "Studio Trigger · CDPR · Hiroyuki Imaishi",
    "tags": [
      "Lucy",
      "The Moon",
      "Braindance",
      "NCART Metro"
    ],
    "summary": "Running military chrome without immunosuppressants pushes David to the brink of collapse. On the NCART train line, he crosses paths with Lucy, an enigmatic netrunner slicing corporate shards. After an adrenaline-fueled heist, she jacks him into an illicit BD simulation of the Moon.",
    "story": "Drifting together over gray lunar dust in dead silence. While sirens scream fifty stories below on the streets, Lucy whispers her dream of escaping Night City forever.",
    "color": "#0f0e0a",
    "wearSeed": 2076023,
    "image": "/projects/Vintage Cyberpunk Edgerunners VHS Poster.png",
    "metrics": [
      {
        "label": "SHARD HEIST",
        "value": "14 Encrypted Shards"
      },
      {
        "label": "SIMULATION",
        "value": "Lunar Surface 1.0"
      },
      {
        "label": "NETRUNNER",
        "value": "Lucyna Kushinada"
      },
      {
        "label": "ALERT",
        "value": "Maine Squad Tracking"
      }
    ],
    "problem": {
      "headline": "The Setup: A Blood Pact on the NCART Metro.",
      "description": "Suffering intense neural backlash from consecutive Sandevistan activations, David stumbles onto the morning metro. He catches Lucy slicing data shards from Arasaka suits and uses his burst speed to aid her escape, striking an equal profit-sharing pact as street partners."
    },
    "architecture": {
      "headline": "Climax: The Lunar Braindance Sanctuary.",
      "description": "Taking David back to her high-rise flat, Lucy jacks him into an unauthorized braindance wreath, transporting both of them to the silent expanse of the Moon.",
      "highlights": [
        {
          "title": "Zero-Gravity Sanctuary",
          "detail": "A breathtaking contrast to Night City's neon grime, bathing David and Lucy in cold lunar sunlight."
        },
        {
          "title": "The Solemn Promise",
          "detail": "Hearing Lucy's dream of never returning to earth, David promises he will buy her a one-way ticket to the Moon."
        }
      ]
    },
    "takeaways": [
      "The Moon is quiet. No Arasaka, no corporations, no noise. Just peace. (Lucy)",
      "In a city where everyone sells their soul for chrome, a shared dream is the most dangerous contraband."
    ],
    "shots": [
      {
        "title": "EDGE RUNNER JACKET",
        "tag": "SETUP",
        "caption": "David donning Gloria's oversized paramedic jacket on the streets.",
        "mediaUrl": "/edgerunners/ep-02/shot-01-incident.webp"
      },
      {
        "title": "LUCYNA KUSHINADA",
        "tag": "CHARACTER",
        "caption": "The enigmatic netrunner introducing David to the underworld.",
        "mediaUrl": "/edgerunners/ep-02/shot-02-character.webp"
      },
      {
        "title": "LUNAR ROVER BD",
        "tag": "CLIMAX",
        "caption": "Cruising the virtual lunar surface together in Lucy's flat.",
        "mediaUrl": "/edgerunners/ep-02/shot-03-climax.webp"
      },
      {
        "title": "LUNAR PANORAMA",
        "tag": "DREAM",
        "caption": "Earth rising over the crater horizon during the braindance sequence.",
        "mediaUrl": "/edgerunners/ep-02/shot-04-panoramic.webp"
      }
    ],
    "meta": {
      "duration": "23:48",
      "format": "BD SHARD",
      "channel": "S1.EP02",
      "quality": "1080P MASTER"
    }
  },
  {
    "id": "ep-03",
    "code": "EP.03",
    "title": "SMOOTH CRIMINAL",
    "headline": "Ambushed by Maine's crew. A trial by fire on the industrial highway.",
    "year": 2076,
    "category": "BRAINDANCE SHARD",
    "categoryFilter": "creative",
    "role": "Maine, Dorio, Kiwi, Pilar & David",
    "client": "The Armed: Night City Aliens",
    "system": "Studio Trigger · CDPR · Hiroyuki Imaishi",
    "tags": [
      "Maine",
      "Dorio",
      "Gorilla Arms",
      "Highway Heist"
    ],
    "summary": "Lucy delivers David straight into the crosshairs of Maine's merc crew, who originally paid Gloria for the Sandevistan. Instead of having his spine ripped out on an operating table, David proves his cyberware tolerance and earns a trial run on a high-risk transport heist.",
    "story": "Pumping lead through the windshield at eighty miles an hour. David drops from the flatbed directly onto Kuznetsov's limousine, tearing open the biometric safe with his bare hands while Maine provides heavy suppression.",
    "color": "#140507",
    "wearSeed": 2076032,
    "image": "/projects/Cyberpunk Edgerunners_ Smooth Criminal.png",
    "metrics": [
      {
        "label": "CREW LEADER",
        "value": "Maine Syndicate"
      },
      {
        "label": "OPERATION",
        "value": "Kuznetsov Transport"
      },
      {
        "label": "SANDY BURSTS",
        "value": "7 Overdrives"
      },
      {
        "label": "STATUS",
        "value": "Recruited as Runner"
      }
    ],
    "problem": {
      "headline": "The Confrontation: Debt Paid in Blood and Chrome.",
      "description": "Cornered in an abandoned shipping lot, David faces Maine's hulking gorilla arms. Rather than surrender Gloria's cyberware, David negotiates an ultimatum: let him work off the cost of the implant as the crew's speed runner."
    },
    "architecture": {
      "headline": "Climax: The Kuznetsov Vehicle Interception.",
      "description": "The crew ambushes Arasaka director Maxim Kuznetsov on the outer highway. David activates his Sandevistan under heavy fire to retrieve the classified navigation data shard.",
      "highlights": [
        {
          "title": "High-Speed Car-Surfing",
          "detail": "David sprints across moving vehicle rooftops under automatic rifle fire, using bullet-time reflexes to bypass defense drones."
        },
        {
          "title": "Safe Crack Under Fire",
          "detail": "Slicing through the limousine bulkhead seconds before the escort convoy closes the perimeter."
        }
      ]
    },
    "takeaways": [
      "You got chrome, kid. But out here, chrome don't mean shit without output. (Maine)",
      "Survival in a merc crew isn't about avoiding fire; it's about moving faster than the trigger pull."
    ],
    "shots": [
      {
        "title": "SMOOTH CRIMINAL",
        "tag": "INCIDENT",
        "caption": "The crew cornering David in the abandoned industrial district.",
        "mediaUrl": "/edgerunners/ep-03/shot-01-incident.webp"
      },
      {
        "title": "FREIGHT STATION RENDEZVOUS",
        "tag": "MEETING",
        "caption": "David facing down Maine in the abandoned shipping district.",
        "mediaUrl": "/edgerunners/ep-03/shot-02-character.webp"
      },
      {
        "title": "MAINE'S ARM CANNON",
        "tag": "LEADER",
        "caption": "Maine locking and loading his heavy cyberware cannons.",
        "mediaUrl": "/edgerunners/ep-03/shot-03-climax.webp"
      },
      {
        "title": "PILAR'S NIGHT CITY PERIMETER",
        "tag": "CREW",
        "caption": "Pilar providing optical reconnaissance before the convoy assault.",
        "mediaUrl": "/edgerunners/ep-03/shot-04-panoramic.webp"
      }
    ],
    "meta": {
      "duration": "24:05",
      "format": "BD SHARD",
      "channel": "S1.EP03",
      "quality": "1080P MASTER"
    }
  },
  {
    "id": "ep-04",
    "code": "EP.04",
    "title": "LUCKY YOU",
    "headline": "Chaos with Rebecca, Maelstrom labs, and the deadly cost of street life.",
    "year": 2076,
    "category": "BRAINDANCE SHARD",
    "categoryFilter": "creative",
    "role": "Rebecca, Pilar, Lucy & David",
    "client": "Mastiff: Acid Breaker",
    "system": "Studio Trigger · CDPR · Hiroyuki Imaishi",
    "tags": [
      "Rebecca",
      "Maelstrom",
      "Shotgun Carnage",
      "Pilar"
    ],
    "summary": "Fully initiated into Maine's crew, David partners with the trigger-happy solo Rebecca for a lethal raid on a Maelstrom weapons laboratory. But Night City delivers a brutal reminder that death lurks in every alley when Pilar crosses paths with a street cyberpsycho.",
    "story": "Guns blazing, spent brass bouncing off concrete, and Rebecca laughing hysterically as she empties a drum magazine into chrome-faced cyberpsychos. Then a flash of light outside the bodega, and Pilar is gone before anyone can draw iron.",
    "color": "#0e1307",
    "wearSeed": 2076042,
    "image": "/projects/Lucky You Edgerunners VHS Poster.png",
    "metrics": [
      {
        "label": "HEAVY SOLO",
        "value": "Rebecca (Carnage)"
      },
      {
        "label": "MAELSTROM LOSS",
        "value": "24 Hostiles Flatlined"
      },
      {
        "label": "CREW CASUALTY",
        "value": "Pilar KIA"
      },
      {
        "label": "ALERT LEVEL",
        "value": "NCPD Code Red"
      }
    ],
    "problem": {
      "headline": "The Infiltration: Storming the Maelstrom Den.",
      "description": "The crew needs navigation data hidden inside a heavily fortified Maelstrom chop shop. David and Rebecca breach through the ceiling while Lucy cuts the security ICE from a distance."
    },
    "architecture": {
      "headline": "Climax: Bloodshed Outside the Bodega.",
      "description": "Celebrating their successful run with cheap synth-beer, Pilar mocks an unstable vagrant urinating in the alley. The man's oculars flash red as cyberpsychosis claims him in an instant.",
      "highlights": [
        {
          "title": "Point-Blank Headshot",
          "detail": "A hidden wrist-mounted blaster vaporizes Pilar without warning, spraying gore across Rebecca and David."
        },
        {
          "title": "David's Reflex Execution",
          "detail": "Overriding his panic, David triggers his Sandevistan to flank and execute the cyberpsycho before more crew fall."
        }
      ]
    },
    "takeaways": [
      "Hands off the merch, choom. Next warning comes through your skull. (Rebecca)",
      "In Night City, you can survive twenty military shootouts and still die outside a liquor store."
    ],
    "shots": [
      {
        "title": "LUCKY YOU",
        "tag": "INCIDENT",
        "caption": "The crew gearing up in the underground safehouse.",
        "mediaUrl": "/edgerunners/ep-04/shot-01-incident.webp"
      },
      {
        "title": "REBECCA: DUAL WEAPONS",
        "tag": "GUNNER",
        "caption": "Rebecca dual-wielding high-caliber pistols with lethal joy.",
        "mediaUrl": "/edgerunners/ep-04/shot-02-character.webp"
      },
      {
        "title": "REBECCA & DAVID STANDOFF",
        "tag": "CLIMAX",
        "caption": "David and Rebecca holding the choke point during the Maelstrom raid.",
        "mediaUrl": "/edgerunners/ep-04/shot-03-climax.webp"
      },
      {
        "title": "NCART PLATFORM ESCAPE",
        "tag": "ESCAPE",
        "caption": "The crew boarding the monorail under high-alert lockdown.",
        "mediaUrl": "/edgerunners/ep-04/shot-04-panoramic.webp"
      }
    ],
    "meta": {
      "duration": "23:55",
      "format": "BD SHARD",
      "channel": "S1.EP04",
      "quality": "1080P MASTER"
    }
  },
  {
    "id": "ep-05",
    "code": "EP.05",
    "title": "ALL EYEZ ON ME",
    "headline": "The dark art of braindance tuning. Trapped in Jimmy Kurosaki's nightmare.",
    "year": 2076,
    "category": "BRAINDANCE SHARD",
    "categoryFilter": "creative",
    "role": "Jimmy Kurosaki, David, Faraday & Lucy",
    "client": "Dawid Podsiadło: Where Did Your Love Go",
    "system": "Studio Trigger · CDPR · Hiroyuki Imaishi",
    "tags": [
      "Jimmy Kurosaki",
      "Braindance",
      "Faraday",
      "Psychosis Loop"
    ],
    "summary": "Hired by the shadowy four-eyed fixer Faraday, the crew tracks legendary BD tuner Jimmy Kurosaki, who has been splicing classified Arasaka behavioral research. But JK turns the tables on David, jacking him into an uncalibrated death-state simulation.",
    "story": "Convulsing in the technician's chair as the neuro-wreath burns into his cortex. David experiences the dying screams of James Norris over and over, feeling cyberpsychosis scrape against the inside of his skull until the crew kicks down the reinforced blast doors.",
    "color": "#150503",
    "wearSeed": 2076052,
    "image": "/projects/Cyberpunk Edgerunners_ All Eyez on Me.png",
    "metrics": [
      {
        "label": "BD TUNER",
        "value": "Jimmy Kurosaki"
      },
      {
        "label": "FIXER",
        "value": "Faraday (Santo)"
      },
      {
        "label": "NEURAL DAMAGE",
        "value": "Extreme Seizure"
      },
      {
        "label": "INTEL SECURED",
        "value": "Arasaka Tanaka Shard"
      }
    ],
    "problem": {
      "headline": "The Ambush: Walking into the BD Tuner's Parlor.",
      "description": "Tracking JK to a high-end commercial recording studio, David moves ahead to secure the console. He is blinded by an EMP flash and trapped in an operating harness before the squad can breach."
    },
    "architecture": {
      "headline": "Climax: The Torture Loop and Extraction.",
      "description": "JK subjects David to the unfiltered death memories of cyberpsychos to prove his philosophy that all chromed humans end in madness.",
      "highlights": [
        {
          "title": "Sensory Overload Shock",
          "detail": "Neurochemical synapses redlining as phantom bullet wounds and neural rot flood David's brain in real time."
        },
        {
          "title": "Faraday's Cold Handshake",
          "detail": "Maine captures JK alive and delivers the unencrypted Tanaka data directly to fixer Faraday, sealing their fateful contract."
        }
      ]
    },
    "takeaways": [
      "You want reality, Martinez? In this city, raw reality is whatever I edit into the shard. (Jimmy Kurosaki)",
      "A braindance can kill just as cleanly as a hollow-point bullet; all it takes is the right frequency."
    ],
    "shots": [
      {
        "title": "ALL EYEZ ON ME",
        "tag": "INCIDENT",
        "caption": "Night City's illicit Braindance broadcast frequency glowing in the dark.",
        "mediaUrl": "/edgerunners/ep-05/shot-01-incident.webp"
      },
      {
        "title": "FARADAY'S PRIVATE SUITE",
        "tag": "FIXER",
        "caption": "Four-eyed fixer Faraday outlining the Tanaka extraction contract.",
        "mediaUrl": "/edgerunners/ep-05/shot-02-character.webp"
      },
      {
        "title": "PSYCHOSIS RECALL",
        "tag": "CLIMAX",
        "caption": "JK's illegal BD rig forcing David to relive the cyberpsycho death memory.",
        "mediaUrl": "/edgerunners/ep-05/shot-03-climax.webp"
      },
      {
        "title": "MAXTAC INTERVENTION",
        "tag": "AFTERMATH",
        "caption": "The sensory shockwaves of the trauma team and MaxTac firing line.",
        "mediaUrl": "/edgerunners/ep-05/shot-04-panoramic.webp"
      }
    ],
    "meta": {
      "duration": "24:18",
      "format": "BD SHARD",
      "channel": "S1.EP05",
      "quality": "1080P MASTER"
    }
  },
  {
    "id": "ep-06",
    "code": "EP.06",
    "title": "GIRL ON FIRE",
    "headline": "Maine's tragic cyberpsychosis. Blood, ash, and the fall of a legend.",
    "year": 2076,
    "category": "BRAINDANCE SHARD",
    "categoryFilter": "creative",
    "role": "Maine, Dorio, David & Kiwi",
    "client": "Gazelle Twin: History",
    "system": "Studio Trigger · CDPR · Hiroyuki Imaishi",
    "tags": [
      "Cyberpsychosis",
      "Maine",
      "Dorio",
      "MaxTac Siege"
    ],
    "summary": "Maine's chrome addiction reaches a catastrophic breaking point during an executive interrogation. As trauma team and MaxTac converge on the safehouse, Dorio falls in the crossfire, sending Maine into a terminal berserker rage that ends in a blinding explosion.",
    "story": "Hallucinating endless desert sand while heavy machine-gun fire tears the walls apart. Maine stacks dead corporate bodies and fuel barrels into a funeral pyre, shoving David toward the exit with his last shred of humanity.",
    "color": "#190510",
    "wearSeed": 2076062,
    "image": "/projects/Cyberpunk Girl on Fire VHS Poster.png",
    "metrics": [
      {
        "label": "PSYCHOSIS STAGE",
        "value": "Terminal Level 5"
      },
      {
        "label": "CASUALTIES",
        "value": "Maine & Dorio KIA"
      },
      {
        "label": "TACTICAL THREAT",
        "value": "MaxTac Gunship Strike"
      },
      {
        "label": "SUCCESSION",
        "value": "David Inherits Crew"
      }
    ],
    "problem": {
      "headline": "The Breakdown: A Commander Lost to the Glitch.",
      "description": "Trapped inside the abandoned electrical facility with an unconscious Tanaka, Maine's cyberware overheats. He strikes Kiwi in a blind delirium, compromising their digital firewall and alerting Arasaka tactical units."
    },
    "architecture": {
      "headline": "Climax: The Last Stand of Maine.",
      "description": "With Dorio shot dead before his eyes, Maine awakens from his stupor only to embrace total annihilation against the incoming MaxTac squad.",
      "highlights": [
        {
          "title": "Fuel Pyre Detonation",
          "detail": "Maine empties his heavy arm cannons into stacked fuel drums, obliterating himself, the Arasaka strike team, and the entire facility."
        },
        {
          "title": "The Torch Passed",
          "detail": "David escapes through the burning rubble, clutching Maine's discarded arm chrome as his new purpose crystallizes."
        }
      ]
    },
    "takeaways": [
      "Run, David. Run and don't stop. You're the one who makes it out. (Maine)",
      "Night City doesn't bury legends; it turns them into scrap and sells the copper by the pound."
    ],
    "shots": [
      {
        "title": "MAINE & DORIO",
        "tag": "INCIDENT",
        "caption": "The final quiet moment in the safehouse before the cognitive breakdown.",
        "mediaUrl": "/edgerunners/ep-06/shot-01-incident.webp"
      },
      {
        "title": "DORIO IN POSITION",
        "tag": "PROTECTION",
        "caption": "Dorio providing cover fire against incoming corporate squads.",
        "mediaUrl": "/edgerunners/ep-06/shot-02-character.webp"
      },
      {
        "title": "ARM CANNON OVERDRIVE",
        "tag": "CLIMAX",
        "caption": "Maine unleashing his heavy gorilla cannons into the facility.",
        "mediaUrl": "/edgerunners/ep-06/shot-03-climax.webp"
      },
      {
        "title": "PERIMETER SHIELD FALLS",
        "tag": "AFTERMATH",
        "caption": "Kiwi witnessing the defensive firewall collapse under MaxTac assault.",
        "mediaUrl": "/edgerunners/ep-06/shot-04-panoramic.webp"
      }
    ],
    "meta": {
      "duration": "25:02",
      "format": "BD SHARD",
      "channel": "S1.EP06",
      "quality": "1080P MASTER"
    }
  },
  {
    "id": "ep-07",
    "code": "EP.07",
    "title": "STRONGER",
    "headline": "Chrome-plated captain. David rises to the pinnacle of Night City's underworld.",
    "year": 2076,
    "category": "BRAINDANCE SHARD",
    "categoryFilter": "creative",
    "role": "David Martinez (Leader), Lucy, Rebecca & Falco",
    "client": "Tomb Mold: Flesh & Iron",
    "system": "Studio Trigger · CDPR · Hiroyuki Imaishi",
    "tags": [
      "Time Skip",
      "Quadra V-Tech",
      "Afterlife Elite",
      "Full Chrome"
    ],
    "summary": "Months after Maine's death, David has transformed his physical form into a monolithic chromed warlord. Leading Rebecca, Kiwi, and wheelman Falco, he commands the most lethal merc cell in Night City, drowning his impending cyberpsychosis in massive immunosuppressant cocktails.",
    "story": "Tearing down the freeway at two hundred miles per hour in his custom gold Quadra. David fires forearm missile barrages without blinking, tearing rival mercenary convoys to shreds while his doctor warns him that his nervous system is hanging by a single wire.",
    "color": "#0c1409",
    "wearSeed": 2076072,
    "image": "/projects/Cyberpunk Edgerunners_ Stronger Episode 07.png",
    "metrics": [
      {
        "label": "CHROME MASS",
        "value": "+340% Total Body"
      },
      {
        "label": "SUPPRESSANT DOSE",
        "value": "8 Injections / Day"
      },
      {
        "label": "REPUTATION",
        "value": "Afterlife Top Bracket"
      },
      {
        "label": "WHEELMAN",
        "value": "Falco Recruited"
      }
    ],
    "problem": {
      "headline": "The Burden: Walking the Edge of Sanity.",
      "description": "Taking up Maine's contracts, David takes more chrome than any human should survive. Despite winning every firefight, his hands begin to develop the telltale tremors of terminal neural decay."
    },
    "architecture": {
      "headline": "Climax: The Highway Convoy Annihilation.",
      "description": "Hired to eliminate a rival corporate transport crew, David showcases the sheer overwhelming firepower of his chromed physique.",
      "highlights": [
        {
          "title": "Micro-Missile Salvo",
          "detail": "Shoulder pods deploy and saturate the roadway with thermal explosives, deleting five armored interceptors in three seconds."
        },
        {
          "title": "Lucy's Deep-Net Wall",
          "detail": "While David burns chrome on the streets, Lucy stays isolated in the shadows, quietly assassinating Arasaka agents hunting him."
        }
      ]
    },
    "takeaways": [
      "I'm built different, Doc. You said it yourself. Give me more immunosuppressants. (David Martinez)",
      "The stronger you become in Night City, the faster the clock counts down to zero."
    ],
    "shots": [
      {
        "title": "STRONGER",
        "tag": "EPISODE",
        "caption": "David leading the crew with a monolithic chromed military frame.",
        "mediaUrl": "/edgerunners/ep-07/shot-01-incident.webp"
      },
      {
        "title": "LUCY'S RETREAT",
        "tag": "ISOLATION",
        "caption": "Lucy burning through ICE layers in seclusion to wipe David's data trace.",
        "mediaUrl": "/edgerunners/ep-07/shot-02-character.webp"
      },
      {
        "title": "ARASAKA MEMORY",
        "tag": "FLASHBACK",
        "caption": "The haunting flashback of young Lucy fleeing Arasaka's deep-net facilities.",
        "mediaUrl": "/edgerunners/ep-07/shot-03-climax.webp"
      },
      {
        "title": "NIGHT CITY HORIZON",
        "tag": "LEADER",
        "caption": "David commanding the operation overlooking the sprawling neon skyline.",
        "mediaUrl": "/edgerunners/ep-07/shot-04-panoramic.webp"
      }
    ],
    "meta": {
      "duration": "24:30",
      "format": "BD SHARD",
      "channel": "S1.EP07",
      "quality": "1080P MASTER"
    }
  },
  {
    "id": "ep-08",
    "code": "EP.08",
    "title": "STAY",
    "headline": "The digital net closes. A secret war to protect the one you love.",
    "year": 2076,
    "category": "BRAINDANCE SHARD",
    "categoryFilter": "creative",
    "role": "Lucy, David, Kiwi & Faraday",
    "client": "Rosa Walton: I Really Want to Stay at Your House",
    "system": "Studio Trigger · CDPR · Hiroyuki Imaishi",
    "tags": [
      "Deep Net",
      "ICE Breaker",
      "Betrayal",
      "Faraday's Trap"
    ],
    "summary": "Lucy operates in total secrecy, burning Arasaka netrunners before they can uncover David's compatibility with the prototype Cyberskeleton. But fixer Faraday and Arasaka detect the pattern, turning Kiwi against the crew and springing a trap that takes Lucy hostage.",
    "story": "A quiet apartment, cold neon reflecting on polished glass, and David begging Lucy to stop running away. When he returns from a routine hit, the door is kicked off its hinges, and Lucy's netrunner wreath lies broken in a puddle of water.",
    "color": "#1a0a03",
    "wearSeed": 2076082,
    "image": "/projects/Cyberpunk Edgerunners_ Stay Orange.png",
    "metrics": [
      {
        "label": "NETRUNNERS DEAD",
        "value": "4 Arasaka Analysts"
      },
      {
        "label": "ICE BREACH",
        "value": "Compromised by Kiwi"
      },
      {
        "label": "COLLUSION",
        "value": "Faraday & Arasaka"
      },
      {
        "label": "HOSTAGE",
        "value": "Lucyna Kushinada"
      }
    ],
    "problem": {
      "headline": "The Shadow War: Lucy's Desperate Cover-Up.",
      "description": "Refusing to tell David about Arasaka's interest in him, Lucy hunts down every analyst looking into the Tanaka files. Her ruthless deep-net assassinations trigger high-level corporate alarms."
    },
    "architecture": {
      "headline": "Climax: Kiwi's Calculated Betrayal.",
      "description": "Faraday corners Kiwi with an offer of corporate immunity. Together, they lure Lucy into a false extraction meeting, tasing her into submission.",
      "highlights": [
        {
          "title": "Monowire Server Decapitation",
          "detail": "Lucy uses her glowing monowire to shred an entire corporate server rack before being ambushed by Faraday's assault squad."
        },
        {
          "title": "The Empty Bed",
          "detail": "David discovers Lucy missing and realizes the walls of Night City have finally closed around them."
        }
      ]
    },
    "takeaways": [
      "I can't let them find you. Not Arasaka, not anyone. That's why I have to kill them first. (Lucy)",
      "The secrets we keep to protect each other are the exact wedges that tear us apart."
    ],
    "shots": [
      {
        "title": "STAY",
        "tag": "EPISODE",
        "caption": "Lucy submerged in the chilling deep-net ice tub.",
        "mediaUrl": "/edgerunners/ep-08/shot-01-incident.webp"
      },
      {
        "title": "CORPORATE TOWERS",
        "tag": "DISTRICT",
        "caption": "Arasaka corporate district looming over the deep-net war.",
        "mediaUrl": "/edgerunners/ep-08/shot-02-character.webp"
      },
      {
        "title": "HIGHWAY PATROL",
        "tag": "SURVEILLANCE",
        "caption": "Corporate agents moving through Night City under the cover of dusk.",
        "mediaUrl": "/edgerunners/ep-08/shot-03-climax.webp"
      },
      {
        "title": "THE EMPTY RENDEZVOUS",
        "tag": "ABDUCTION",
        "caption": "David searching the freight station for traces of Lucy.",
        "mediaUrl": "/edgerunners/ep-08/shot-04-panoramic.webp"
      }
    ],
    "meta": {
      "duration": "24:14",
      "format": "BD SHARD",
      "channel": "S1.EP08",
      "quality": "1080P MASTER"
    }
  },
  {
    "id": "ep-09",
    "code": "EP.09",
    "title": "HUMANITY",
    "headline": "The prototype cyberskeleton. A highway war against Militech and Arasaka.",
    "year": 2076,
    "category": "BRAINDANCE SHARD",
    "categoryFilter": "creative",
    "role": "David Martinez, Rebecca, Falco & Faraday",
    "client": "Health: Major Crimes",
    "system": "Studio Trigger · CDPR · Hiroyuki Imaishi",
    "tags": [
      "Cyberskeleton",
      "Anti-Gravity",
      "Militech War",
      "Highway Battle"
    ],
    "summary": "Desperate to rescue Lucy from Faraday's claws, David knowingly steps into Arasaka's ultimate mouse trap: the experimental Cyberskeleton. Bolted into the anti-gravity frame, he unleashes cataclysmic destructive force across the badlands highway, obliterating entire Militech divisions.",
    "story": "Hovering fifty feet above the asphalt with multi-jointed hydraulic appendages ripping through steel. David pulls tanks out of the dirt with localized gravity wells and slams them into each other like toy cars, bleeding from every orifice as his humanity slips away.",
    "color": "#04091a",
    "wearSeed": 2076092,
    "image": "/projects/Distressed Cyberpunk Humanity VHS Cover.png",
    "metrics": [
      {
        "label": "SUPERWEAPON",
        "value": "Arasaka Cyberskeleton"
      },
      {
        "label": "GRAVITY WEAPONRY",
        "value": "Magnetic Pulse Cannons"
      },
      {
        "label": "MILITECH SQUAD",
        "value": "2 Battalions Crushed"
      },
      {
        "label": "SANITY THRESHOLD",
        "value": "2% Remaining"
      }
    ],
    "problem": {
      "headline": "The Bait: Stepping into the Devil's Armor.",
      "description": "Faraday broadcasts footage of Lucy held hostage at gunpoint, ordering David to secure the prototype Arasaka Cyberskeleton. Knowing it is suicide, David dons the armor anyway."
    },
    "architecture": {
      "headline": "Climax: The Badlands Convoy Massacre.",
      "description": "Militech mobilizes heavy battle armor to capture the rogue skeleton. David and Falco turn the open desert interstate into an apocalyptic graveyard.",
      "highlights": [
        {
          "title": "Magnetic Gravitational Crush",
          "detail": "David compresses three Militech heavy gunships into compact metal spheres and hurls them into the pursuing convoy."
        },
        {
          "title": "Rebecca's Desperate Triage",
          "detail": "Rebecca repeatedly injects immunosuppressants directly into David's neck as cyberpsychotic delusions threaten to take him over."
        }
      ]
    },
    "takeaways": [
      "You're going to use me as bait? Then watch what happens when the cage breaks. (David Martinez)",
      "When you trade your humanity for godlike power, you become a monster just in time to watch everything burn."
    ],
    "shots": [
      {
        "title": "HUMANITY",
        "tag": "EPISODE",
        "caption": "The titan frame rising above the badlands dust.",
        "mediaUrl": "/edgerunners/ep-09/shot-01-incident.webp"
      },
      {
        "title": "PROTOTYPE CYBERSKELETON",
        "tag": "SUPERWEAPON",
        "caption": "The multi-limbed gravitational exoskeleton locked onto David's spine.",
        "mediaUrl": "/edgerunners/ep-09/shot-02-character.webp"
      },
      {
        "title": "FALCO'S HIGHWAY WAR",
        "tag": "HIGHWAY",
        "caption": "Falco steering the armored carrier through a storm of anti-tank artillery.",
        "mediaUrl": "/edgerunners/ep-09/shot-03-climax.webp"
      },
      {
        "title": "MILITECH ARMOR CRUSH",
        "tag": "DESTRUCTION",
        "caption": "Heavy Militech missile batteries pulverized by gravitational compression.",
        "mediaUrl": "/edgerunners/ep-09/shot-04-panoramic.webp"
      }
    ],
    "meta": {
      "duration": "25:40",
      "format": "BD SHARD",
      "channel": "S1.EP09",
      "quality": "1080P MASTER"
    }
  },
  {
    "id": "ep-10",
    "code": "EP.10",
    "title": "MY MOON MY MAN",
    "headline": "The final stand at Arasaka Tower. Adam Smasher, a promise kept, and the Moon.",
    "year": 2076,
    "category": "BRAINDANCE SHARD",
    "categoryFilter": "creative",
    "role": "David Martinez, Lucy, Rebecca & Adam Smasher",
    "client": "Rosa Walton: I Really Want to Stay at Your House",
    "system": "Studio Trigger · CDPR · Hiroyuki Imaishi",
    "tags": [
      "Arasaka Tower",
      "Adam Smasher",
      "The Moon",
      "Final Climax"
    ],
    "summary": "Crashing through the glass zenith of Arasaka Tower, David frees Lucy and executes Faraday. But Night City's ultimate nightmare drops from the sky: Adam Smasher. With Rebecca crushed and his cyberware burning out, David makes his final stand so Lucy can escape to the stars.",
    "story": "A blinding flash of Sandevistan versus Sandevistan high above Night City. David smiles through blood-stained teeth as Smasher tears his mechanical limbs apart. In the quiet aftermath, Lucy walks alone across the white dust of the Moon, feeling the warm ghost of David's sunlight on her skin.",
    "color": "#100e08",
    "wearSeed": 2076102,
    "image": "/projects/My Moon My Man VHS Poster.png",
    "metrics": [
      {
        "label": "FINAL BATTLE",
        "value": "Arasaka Tower Plaza"
      },
      {
        "label": "CASUALTIES",
        "value": "David & Rebecca KIA"
      },
      {
        "label": "NIGHTMARE",
        "value": "Adam Smasher Victorious"
      },
      {
        "label": "LUNAR TICKET",
        "value": "Delivered to Lucy"
      }
    ],
    "problem": {
      "headline": "The Climax: Storming the Top of the World.",
      "description": "David hurls himself into Arasaka Tower's penthouse, rescuing Lucy from Faraday's grasp and fulfilling his mother's prophecy of reaching the top of Arasaka Tower."
    },
    "architecture": {
      "headline": "The End: Smasher's Arrival and the Promise Kept.",
      "description": "Arasaka deploys their ultimate weapon. Adam Smasher drops like a meteor, flattening Rebecca instantly and ripping David's exoskeleton apart piece by piece.",
      "highlights": [
        {
          "title": "The Final Kiss",
          "detail": "Suspended in mid-air above the skyscrapers, David hands Lucy to Falco and gives her one last kiss before activating his remaining Sandevistan burst."
        },
        {
          "title": "Walking on the Moon",
          "detail": "Lucy stands in Apollo silence beneath the radiant blue sphere of Earth, carrying David's memory forever."
        }
      ]
    },
    "takeaways": [
      "I'm sorry. I couldn't take you to the Moon myself. But you're going, Lucy. You're going. (David Martinez)",
      "In the end, you don't beat Night City; you just decide what you are willing to die for."
    ],
    "shots": [
      {
        "title": "DAVID'S FINAL SMILE",
        "tag": "EPISODE",
        "caption": "David facing down Adam Smasher with zero regrets high above Night City.",
        "mediaUrl": "/edgerunners/ep-10/shot-01-incident.webp"
      },
      {
        "title": "GETAWAY PROTOCOL",
        "tag": "ESCAPE",
        "caption": "Falco and Rebecca executing the emergency evacuation maneuver.",
        "mediaUrl": "/edgerunners/ep-10/shot-02-character.webp"
      },
      {
        "title": "ORBITAL ASCENT",
        "tag": "LUNAR SHUTTLE",
        "caption": "The civilian lunar transport leaving Earth's atmosphere.",
        "mediaUrl": "/edgerunners/ep-10/shot-03-climax.webp"
      },
      {
        "title": "THE MOON",
        "tag": "MOON",
        "caption": "Lucy standing alone beneath the radiant blue Earth in lunar silence.",
        "mediaUrl": "/edgerunners/ep-10/shot-04-panoramic.webp"
      }
    ],
    "meta": {
      "duration": "26:10",
      "format": "BD SHARD",
      "channel": "S1.EP10",
      "quality": "1080P MASTER"
    }
  }
];
