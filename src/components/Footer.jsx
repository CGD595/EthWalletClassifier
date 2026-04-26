import EthGlyph from './EthGlyph';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <EthGlyph size={18} />
          <span>Ethereum Wallet Classifier</span>
        </div>
        <div className="footer-mid">
          Gyalpozhing College of Information Technology · Big Data Project 2026
        </div>
        <div className="footer-right">
          <span>Apache Spark 3.5.1</span>
          <span className="dot-sep">·</span>
          <span>112 CPU Cores</span>
          <span className="dot-sep">·</span>
          <span>800GB RAM</span>
        </div>
      </div>
    </footer>
  );
}
