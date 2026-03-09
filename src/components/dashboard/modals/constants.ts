export const NETWORKS = [
  { id: "mtn", name: "MTN" },
  { id: "airtel", name: "Airtel" },
  { id: "glo", name: "Glo" },
  { id: "9mobile", name: "9mobile" },
] as const;

export type NetworkId = (typeof NETWORKS)[number]["id"];

/** Backend Smeplug network_id: 1=MTN, 2=Airtel, 3=9Mobile, 4=Glo. Used for executeTransaction(airtime/data). */
export const NETWORK_TO_BACKEND_ID: Record<NetworkId, string> = {
  mtn: "1",
  airtel: "2",
  "9mobile": "3",
  glo: "4",
};

/** Base path for network logos (public/images/network). Files: mtn.png, airtel.png, glo.png, 9mobile.png */
export function getNetworkImageUrl(networkId: NetworkId): string {
  return `/images/network/${networkId}.png`;
}

/** Resolve network image URL from display name (e.g. "MTN", "Airtel") for History and other screens. */
export function getNetworkImageUrlFromName(name: string): string | null {
  if (!name || typeof name !== "string") return null;
  const id = NETWORKS.find((n) => n.name.toLowerCase() === name.toLowerCase())?.id;
  return id ? getNetworkImageUrl(id) : null;
}

/** Infer network from description (e.g. "MTN • 080..." or "Airtel" at start). Used when API does not send network. */
export function inferNetworkFromDescription(description: string | undefined): string | null {
  if (!description || typeof description !== "string") return null;
  const d = description.trim();
  for (const n of NETWORKS) {
    if (d.toLowerCase().startsWith(n.name.toLowerCase())) return n.name;
    if (d.toLowerCase().includes(` ${n.name.toLowerCase()} `)) return n.name;
    if (d.toLowerCase().includes(` • ${n.name}`)) return n.name;
  }
  return null;
}

/** Dial codes to set up share pin per network (airtime to cash) */
export const SHARE_PIN_DIAL_CODES: Record<NetworkId, string> = {
  mtn: "*321*4#",
  airtel: "*321*4#",
  glo: "*321*4#",
  "9mobile": "*321*4#",
};

export const DATA_PLAN_CATEGORIES = [
  { id: "awoof", label: "Awoof" },
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "Weekly" },
  { id: "monthly", label: "Monthly" },
  { id: "others", label: "Others" },
] as const;

export type DataPlanCategoryId = (typeof DATA_PLAN_CATEGORIES)[number]["id"];

export interface DataPlanItem {
  id: string;
  name: string;
  amount: string;
  validity: string;
  category: DataPlanCategoryId;
}

export const DATA_PLANS: Record<NetworkId, DataPlanItem[]> = {
  mtn: [
    { id: "m1", name: "100MB", amount: "₦50", validity: "1 day", category: "awoof" },
    { id: "m2", name: "500MB", amount: "₦200", validity: "30 days", category: "monthly" },
    { id: "m3", name: "1GB", amount: "₦300", validity: "30 days", category: "monthly" },
    { id: "m4", name: "2GB", amount: "₦500", validity: "30 days", category: "monthly" },
    { id: "m5", name: "5GB", amount: "₦1,200", validity: "30 days", category: "monthly" },
    { id: "m6", name: "10GB", amount: "₦2,000", validity: "30 days", category: "monthly" },
    { id: "m7", name: "200MB", amount: "₦100", validity: "1 day", category: "daily" },
    { id: "m8", name: "1GB", amount: "₦350", validity: "7 days", category: "weekly" },
    { id: "m9", name: "Night 1GB", amount: "₦150", validity: "12hrs", category: "others" },
  ],
  airtel: [
    { id: "a1", name: "100MB", amount: "₦50", validity: "1 day", category: "awoof" },
    { id: "a2", name: "500MB", amount: "₦200", validity: "30 days", category: "monthly" },
    { id: "a3", name: "1GB", amount: "₦300", validity: "30 days", category: "monthly" },
    { id: "a4", name: "2GB", amount: "₦500", validity: "30 days", category: "monthly" },
    { id: "a5", name: "5GB", amount: "₦1,200", validity: "30 days", category: "monthly" },
    { id: "a6", name: "250MB", amount: "₦100", validity: "1 day", category: "daily" },
    { id: "a7", name: "1GB", amount: "₦350", validity: "7 days", category: "weekly" },
  ],
  glo: [
    { id: "g1", name: "100MB", amount: "₦45", validity: "1 day", category: "awoof" },
    { id: "g2", name: "500MB", amount: "₦180", validity: "30 days", category: "monthly" },
    { id: "g3", name: "1GB", amount: "₦280", validity: "30 days", category: "monthly" },
    { id: "g4", name: "2GB", amount: "₦480", validity: "30 days", category: "monthly" },
    { id: "g5", name: "200MB", amount: "₦90", validity: "1 day", category: "daily" },
    { id: "g6", name: "1GB", amount: "₦320", validity: "7 days", category: "weekly" },
  ],
  "9mobile": [
    { id: "e1", name: "100MB", amount: "₦48", validity: "1 day", category: "awoof" },
    { id: "e2", name: "500MB", amount: "₦190", validity: "30 days", category: "monthly" },
    { id: "e3", name: "1GB", amount: "₦290", validity: "30 days", category: "monthly" },
    { id: "e4", name: "2GB", amount: "₦490", validity: "30 days", category: "monthly" },
    { id: "e5", name: "200MB", amount: "₦95", validity: "1 day", category: "daily" },
    { id: "e6", name: "1GB", amount: "₦340", validity: "7 days", category: "weekly" },
  ],
};

// Electricity (discos)
export const DISCOS = [
  { id: "ekedc", name: "EKEDC" },
  { id: "ikedc", name: "IKEDC" },
  { id: "kedco", name: "KEDCO" },
  { id: "phed", name: "PHED" },
  { id: "eedc", name: "EEDC" },
  { id: "ibedc", name: "IBEDC" },
  { id: "kaedco", name: "KAEDCO" },
  { id: "abuja", name: "Abuja Electric" },
  { id: "jos", name: "JED" },
] as const;

export type DiscoId = (typeof DISCOS)[number]["id"];

// TV providers and bouquets
export const TV_PROVIDERS = [
  { id: "dstv", name: "DSTV" },
  { id: "gotv", name: "GOtv" },
  { id: "startimes", name: "Startimes" },
] as const;

export type TvProviderId = (typeof TV_PROVIDERS)[number]["id"];

export interface TvBouquet {
  id: string;
  name: string;
  amount: string;
}

export const TV_BOUQUETS: Record<TvProviderId, TvBouquet[]> = {
  dstv: [
    { id: "padi", name: "DStv Padi", amount: "₦2,500" },
    { id: "yanga", name: "DStv Yanga", amount: "₦4,500" },
    { id: "confam", name: "DStv Confam", amount: "₦7,400" },
    { id: "compact", name: "DStv Compact", amount: "₦10,500" },
    { id: "compact-plus", name: "DStv Compact Plus", amount: "₦16,600" },
    { id: "premium", name: "DStv Premium", amount: "₦21,000" },
  ],
  gotv: [
    { id: "lite", name: "GOtv Lite", amount: "₦1,300" },
    { id: "jinja", name: "GOtv Jinja", amount: "₦2,700" },
    { id: "jolli", name: "GOtv Jolli", amount: "₦3,600" },
    { id: "max", name: "GOtv Max", amount: "₦5,700" },
    { id: "supa", name: "GOtv Supa", amount: "₦8,400" },
  ],
  startimes: [
    { id: "nova", name: "Nova", amount: "₦1,300" },
    { id: "basic", name: "Basic", amount: "₦2,500" },
    { id: "smart", name: "Smart", amount: "₦4,000" },
    { id: "classic", name: "Classic", amount: "₦6,500" },
    { id: "super", name: "Super", amount: "₦9,000" },
  ],
};

// Betting operators
export const BETTING_OPERATORS = [
  { id: "bet9ja", name: "Bet9ja" },
  { id: "1xbet", name: "1xBet" },
  { id: "betking", name: "BetKing" },
  { id: "nairabet", name: "Nairabet" },
  { id: "merrybet", name: "Merrybet" },
] as const;

export type BettingOperatorId = (typeof BETTING_OPERATORS)[number]["id"];
