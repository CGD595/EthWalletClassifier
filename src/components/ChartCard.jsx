export default function ChartCard({ title, caption, kicker, children }) {
  return (
    <div className="plotly-card">
      {(title || kicker) && (
        <div className="plotly-head">
          {kicker && <div className="plotly-kicker">{kicker}</div>}
          {title  && <div className="plotly-title">{title}</div>}
        </div>
      )}
      <div className="chart-svg-wrap">{children}</div>
      {caption && <div className="plotly-caption">{caption}</div>}
    </div>
  );
}
