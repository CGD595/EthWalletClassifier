import ChartCard from '../ChartCard';
import { ChartMonthlyTrend, ChartStatusType, ChartGasAnalysis, ChartDefi, ChartActivitySpan } from '../charts/Charts';

export default function DataPage() {
  return (
    <section className="page data">
      <div className="model-inner">
        <div className="page-head">
          <div className="page-kicker">/04 · Exploratory data analysis</div>
          <h2 className="page-title">Data insights</h2>
          <p className="page-sub">Six exploratory views over the 3.1B-transaction dataset — temporal rhythms, status mixes, gas behaviour, DeFi participation, and activity span.</p>
        </div>
        <div className="data-grid">
          <ChartCard kicker="EDA · 02b" title="Monthly transaction trend" caption="Aggregated monthly volume — adoption curve, bull-cycle peaks, and the long tail of base activity.">
            <ChartMonthlyTrend />
          </ChartCard>
          <ChartCard kicker="EDA · 03" title="Status × transaction type" caption="Mix of success/fail outcomes broken down by transaction type. Failed-trader signal lives in this chart.">
            <ChartStatusType />
          </ChartCard>
          <ChartCard kicker="EDA · 04" title="Gas analysis" caption="Gas-price and gas-used distributions. Bots cluster tight; retail wallets scatter wide.">
            <ChartGasAnalysis />
          </ChartCard>
          <ChartCard kicker="EDA · 05" title="DeFi participation" caption="Share of wallets that ever interacted with a DeFi protocol — input to Contract Call Rate (35.7% feature importance).">
            <ChartDefi />
          </ChartCard>
          <ChartCard kicker="EDA · 06" title="Activity span" caption="How long wallets remain active. Long-term Holder vs Dormant subcategories derived from this distribution.">
            <ChartActivitySpan />
          </ChartCard>
        </div>
      </div>
    </section>
  );
}
