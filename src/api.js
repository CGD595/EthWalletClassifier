export const API = "http://103.133.217.77:5000";

export const DEMO_WALLETS = {
  "0xea674fdde714fd979de3edf0f56aa9716b898ec8": {
    klass:"smart",sub:"Bot/Exchange",txCount:45654080,successRate:99.99,failRate:0.01,
    ethSent:10615882,span:3542,activeDays:3401,uniqueReceivers:8429104,contractRate:12.4,erc20Rate:88.2,
    why:"Extremely high transaction volume (45.6M) combined with a near-perfect success rate (99.99%) and a 3,542-day activity span. This signature is characteristic of automated infrastructure — exchange hot wallets, MEV bots, or settlement engines — not human traders.",
  },
  "0x52bc44d5378309ee2abf1539bf71de1b7d7be3b5": {
    klass:"smart",sub:"DeFi Power User",txCount:18384838,successRate:99.99,failRate:0.01,
    ethSent:4899529,span:2735,activeDays:2611,uniqueReceivers:1248301,contractRate:91.7,erc20Rate:76.4,
    why:"91.7% contract-call rate combined with sustained activity over 2,735 days indicates deep, repeated interaction with DeFi protocols. The model weighted Contract Call Rate (35.7% importance) and ERC20 Rate (25.9%) most heavily here.",
  },
  "0x28c6c06298d514db089934071355292781e0c28": {
    klass:"smart",sub:"Whale",txCount:14526526,successRate:99.89,failRate:0.11,
    ethSent:196627939,span:1684,activeDays:1602,uniqueReceivers:4912458,contractRate:22.8,erc20Rate:84.1,
    why:"196.6M ETH in cumulative outflow places this wallet in the top 0.0001% by volume. High ERC20 rate (84.1%) alongside whale-tier ETH movement suggests an institutional custody address.",
  },
};

export function apiToResult(data) {
  const isSmart = data.behaviour === "Smart Money";
  const successRate = parseFloat((data.success_rate || 0).toFixed(2));
  const contractRate = parseFloat((data.contract_call_rate || 0).toFixed(1));
  const erc20Rate    = parseFloat((data.erc20_rate || 0).toFixed(1));
  const activeDays   = data.active_days || 0;
  const txCount      = data.tx_count || 0;

  let why = "";
  if (isSmart) {
    if (contractRate > 60)
      why = `${contractRate}% contract-call rate signals deep protocol engagement — the top feature (weight 35.7%). Combined with ${erc20Rate}% ERC-20 rate over ${activeDays.toLocaleString()} active days, this wallet consistently interacts with DeFi infrastructure.`;
    else if (erc20Rate > 50)
      why = `${erc20Rate}% ERC-20 rate (importance 25.9%) indicates heavy token-ecosystem participation. ${txCount.toLocaleString()} transactions and ${successRate}% success rate over ${activeDays.toLocaleString()} days demonstrate deliberate, experienced on-chain behaviour.`;
    else
      why = `${txCount.toLocaleString()} transactions across ${activeDays.toLocaleString()} active days with ${successRate}% success rate. Contract Call Rate ${contractRate}% and ERC-20 Rate ${erc20Rate}% collectively push this wallet into the Smart Money class.`;
  } else {
    if (txCount <= 5)
      why = `Only ${txCount} transactions recorded. Wallets with 1–5 transactions and minimal contract interaction (${contractRate}% here) are classified as casual or one-time users.`;
    else
      why = `${contractRate}% contract-call rate and ${erc20Rate}% ERC-20 rate — below the Smart Money threshold. ${txCount.toLocaleString()} transactions over ${activeDays.toLocaleString()} active days with ${successRate}% success rate: Inexperienced Money profile.`;
  }

  return {
    klass: isSmart ? "smart" : "inexp",
    sub: data.subcategory || (isSmart ? "Smart Money" : "Inexperienced Money"),
    txCount,
    successRate,
    failRate: parseFloat((100 - successRate).toFixed(2)),
    ethSent: "N/A",
    span: activeDays,
    activeDays,
    uniqueReceivers: data.unique_contracts || 0,
    contractRate,
    erc20Rate,
    why,
  };
}

export const fmt = (n) => {
  if (n === "N/A") return "N/A";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + "K";
  return n.toLocaleString();
};
export const fmtFull = (n) => (typeof n === "number" ? n.toLocaleString() : n);
export const isValidAddr = (s) => /^0x[a-fA-F0-9]{1,42}$/.test(s.trim());
