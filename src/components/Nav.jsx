import EthGlyph from './EthGlyph';

export default function Nav({ page, setPage }) {
  const items = [
    { id: 'hero',       label: 'Overview'  },
    { id: 'classifier', label: 'Classifier' },
    { id: 'model',      label: 'Model'     },
    { id: 'data',       label: 'Data'      },
    { id: 'clusters',   label: 'Clusters'  },
    { id: 'guide',      label: 'Guide'     },
  ];
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button className="brand" onClick={() => setPage('hero')}>
          <EthGlyph size={22} />
          <span>WalletClassifier<span className="brand-dot">.</span></span>
        </button>
        <div className="nav-links">
          {items.map(it => (
            <button
              key={it.id}
              className={'nav-link ' + (page === it.id ? 'active' : '')}
              onClick={() => setPage(it.id)}
            >
              {it.label}
            </button>
          ))}
        </div>
        <div className="nav-meta">
          <span className="status-dot" /> model v3.2 · live
        </div>
      </div>
    </nav>
  );
}
