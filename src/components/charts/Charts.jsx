const COLORS = {
  smart:"#1f77b4",smart2:"#2a8fd1",inexp:"#d62728",inexp2:"#e44141",
  text:"#e6e8ee",text2:"#9099ab",text3:"#5d667a",grid:"#252a36",bg:"#161922",bg2:"#12141c",
};

function ChartFrame({width=720,height=360,children}){
  return(
    <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" style={{display:"block"}}>
      {children}
    </svg>
  );
}
function GridLines({x=56,y=24,w=640,h=292,ticks=5}){
  return <g>{[...Array(ticks+1)].map((_,i)=>{
    const cy=y+(h*i)/ticks;
    return <line key={i} x1={x} y1={cy} x2={x+w} y2={cy} stroke={COLORS.grid} strokeWidth="1" strokeDasharray={i===ticks?"0":"2 4"}/>;
  })}</g>;
}

export function ChartWalletActivity(){
  const bins=[{range:"1",v:142.0},{range:"2-5",v:68.4},{range:"6-20",v:28.7},{range:"21-100",v:12.1},{range:"101-1k",v:4.3},{range:"1k-10k",v:1.1},{range:"10k-100k",v:0.32},{range:"100k-1M",v:0.064},{range:">1M",v:0.012}];
  const W=720,H=340,pl=56,pr=24,pt=24,pb=60,cw=W-pl-pr,ch=H-pt-pb,max=Math.log10(150),bw=cw/bins.length;
  return(<ChartFrame width={W} height={H}>
    <GridLines x={pl} y={pt} w={cw} h={ch} ticks={5}/>
    {[0,1,2].map(p=>{const v=Math.pow(10,p),cy=pt+ch-(Math.log10(v)/max)*ch;return(<text key={p} x={pl-10} y={cy+4} textAnchor="end" fill={COLORS.text3} fontSize="10" fontFamily="JetBrains Mono,monospace">{v<10?v:v+"M"}</text>);})}
    {bins.map((b,i)=>{const h=b.v>0?(Math.log10(b.v+1)/max)*ch:0,x=pl+i*bw+4,y=pt+ch-h;return(<g key={b.range}><rect x={x} y={y} width={bw-8} height={h} fill={COLORS.smart} opacity={0.85} rx="2"/><rect x={x} y={y} width={bw-8} height={3} fill={COLORS.smart2} rx="1"/><text x={x+(bw-8)/2} y={H-pb+16} textAnchor="middle" fill={COLORS.text2} fontSize="10" fontFamily="JetBrains Mono,monospace">{b.range}</text><text x={x+(bw-8)/2} y={y-6} textAnchor="middle" fill={COLORS.text} fontSize="10" fontFamily="JetBrains Mono,monospace">{b.v<1?b.v.toFixed(2):b.v.toFixed(1)}M</text></g>);})}
    <text x={pl} y={H-8} fill={COLORS.text3} fontSize="10" fontFamily="JetBrains Mono,monospace">Transaction count (log bins)</text>
  </ChartFrame>);
}

export function ChartActivityOverTime(){
  const points=[];const months=120;
  for(let i=0;i<months;i++){const t=i/months;let v=Math.pow(t,2.4)*100;if(t>0.5&&t<0.72)v+=Math.sin((t-0.5)/0.22*Math.PI)*130;if(t>0.72&&t<0.82)v-=25;if(t>0.82)v=95+Math.sin(t*40)*6+(t-0.82)*30;v+=Math.sin(i*0.7)*4;points.push(Math.max(0,v));}
  const W=720,H=340,pl=56,pr=24,pt=24,pb=44,cw=W-pl-pr,ch=H-pt-pb,max=Math.max(...points);
  const path=points.map((v,i)=>{const x=pl+(i/(months-1))*cw,y=pt+ch-(v/max)*ch;return`${i===0?"M":"L"}${x.toFixed(1)} ${y.toFixed(1)}`;}).join(" ");
  const area=path+` L${pl+cw} ${pt+ch} L${pl} ${pt+ch} Z`;
  return(<ChartFrame width={W} height={H}>
    <defs><linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={COLORS.smart} stopOpacity="0.5"/><stop offset="100%" stopColor={COLORS.smart} stopOpacity="0.02"/></linearGradient></defs>
    <GridLines x={pl} y={pt} w={cw} h={ch} ticks={4}/>
    {[0,0.25,0.5,0.75,1].map((f,i)=>(<text key={i} x={pl-10} y={pt+ch-f*ch+4} textAnchor="end" fill={COLORS.text3} fontSize="10" fontFamily="JetBrains Mono,monospace">{Math.round(f*max)}M</text>))}
    {["2016","2018","2020","2022","2024"].map((y,i)=>(<text key={y} x={pl+(i/4)*cw} y={H-pb+18} textAnchor="middle" fill={COLORS.text2} fontSize="10" fontFamily="JetBrains Mono,monospace">{y}</text>))}
    <path d={area} fill="url(#areaG)"/><path d={path} fill="none" stroke={COLORS.smart2} strokeWidth="2"/>
  </ChartFrame>);
}

export function ChartMonthlyTrend(){
  const months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const data=months.map((m,i)=>60+Math.sin(i/2)*22+(i%3)*8);
  const W=720,H=320,pl=56,pr=24,pt=24,pb=44,cw=W-pl-pr,ch=H-pt-pb,max=Math.max(...data)*1.1,bw=cw/data.length;
  return(<ChartFrame width={W} height={H}>
    <GridLines x={pl} y={pt} w={cw} h={ch} ticks={4}/>
    {data.map((v,i)=>{const h=(v/max)*ch,x=pl+i*bw+6,y=pt+ch-h;return(<g key={i}><rect x={x} y={y} width={bw-12} height={h} fill={COLORS.smart} opacity="0.85" rx="2"/><text x={x+(bw-12)/2} y={H-pb+18} textAnchor="middle" fill={COLORS.text2} fontSize="10" fontFamily="JetBrains Mono,monospace">{months[i]}</text></g>);})}
  </ChartFrame>);
}

export function ChartStatusType(){
  const types=[{name:"Transfer (ETH)",success:92,fail:8},{name:"ERC20",success:88,fail:12},{name:"Contract call",success:78,fail:22},{name:"Swap",success:71,fail:29},{name:"NFT mint",success:64,fail:36},{name:"Bridge",success:81,fail:19}];
  const W=720,H=340,pl=110,pr=80,pt=20,pb=44,cw=W-pl-pr,ch=H-pt-pb,bh=ch/types.length-8;
  return(<ChartFrame width={W} height={H}>
    {types.map((t,i)=>{const y=pt+i*(bh+8),sw=(t.success/100)*cw,fw=(t.fail/100)*cw;return(<g key={t.name}><text x={pl-10} y={y+bh/2+4} textAnchor="end" fill={COLORS.text2} fontSize="11">{t.name}</text><rect x={pl} y={y} width={sw} height={bh} fill={COLORS.smart} rx="2"/><rect x={pl+sw} y={y} width={fw} height={bh} fill={COLORS.inexp} opacity="0.85" rx="2"/><text x={pl+sw/2} y={y+bh/2+4} textAnchor="middle" fill="#fff" fontSize="10" fontFamily="JetBrains Mono,monospace">{t.success}%</text><text x={pl+sw+fw+8} y={y+bh/2+4} fill={COLORS.inexp2} fontSize="10" fontFamily="JetBrains Mono,monospace">{t.fail}%</text></g>);})}
    <g transform={`translate(${pl},${H-18})`}><rect x="0" y="0" width="10" height="10" fill={COLORS.smart} rx="2"/><text x="16" y="9" fill={COLORS.text2} fontSize="10" fontFamily="JetBrains Mono,monospace">Success</text><rect x="80" y="0" width="10" height="10" fill={COLORS.inexp} rx="2"/><text x="96" y="9" fill={COLORS.text2} fontSize="10" fontFamily="JetBrains Mono,monospace">Fail</text></g>
  </ChartFrame>);
}

export function ChartGasAnalysis(){
  const points=[];const rng=(seed)=>{let s=seed;return()=>(s=(s*9301+49297)%233280)/233280;};const r1=rng(1),r2=rng(7);
  for(let i=0;i<80;i++)points.push({x:20+r1()*18,y:60+r1()*30,c:"smart"});
  for(let i=0;i<120;i++)points.push({x:30+r2()*60,y:90+r2()*110,c:"inexp"});
  const W=720,H=340,pl=56,pr=24,pt=24,pb=44,cw=W-pl-pr,ch=H-pt-pb;
  return(<ChartFrame width={W} height={H}>
    <GridLines x={pl} y={pt} w={cw} h={ch} ticks={5}/>
    {points.map((p,i)=>(<circle key={i} cx={pl+(p.x/100)*cw} cy={pt+ch-(p.y/200)*ch} r="3" fill={p.c==="smart"?COLORS.smart:COLORS.inexp} opacity="0.55"/>))}
    <text x={pl+cw/2} y={H-6} textAnchor="middle" fill={COLORS.text3} fontSize="10" fontFamily="JetBrains Mono,monospace">Gas price (gwei)</text>
    <g transform={`translate(${W-pr-140},${pt+8})`}><rect x="-8" y="-8" width="148" height="44" fill={COLORS.bg2} stroke={COLORS.grid} rx="6"/><circle cx="4" cy="6" r="4" fill={COLORS.smart} opacity="0.7"/><text x="14" y="9" fill={COLORS.text2} fontSize="10" fontFamily="JetBrains Mono,monospace">Bot/Exchange</text><circle cx="4" cy="22" r="4" fill={COLORS.inexp} opacity="0.7"/><text x="14" y="25" fill={COLORS.text2} fontSize="10" fontFamily="JetBrains Mono,monospace">Retail</text></g>
  </ChartFrame>);
}

export function ChartDefi(){
  const W=720,H=340,cx=W/2-80,cy=H/2,r=110,ir=70;
  const slices=[{label:"Never interacted",v:71.4,c:"#3a4150"},{label:"1–5 contracts",v:18.2,c:COLORS.smart},{label:"6–50 contracts",v:7.8,c:COLORS.smart2},{label:"50+ contracts",v:2.6,c:"#67c0e3"}];
  const total=slices.reduce((s,x)=>s+x.v,0);let acc=-Math.PI/2;
  const arcs=slices.map((s)=>{const a0=acc,a1=acc+(s.v/total)*Math.PI*2;acc=a1;const big=a1-a0>Math.PI?1:0;const x0=cx+Math.cos(a0)*r,y0=cy+Math.sin(a0)*r,x1=cx+Math.cos(a1)*r,y1=cy+Math.sin(a1)*r,xi0=cx+Math.cos(a1)*ir,yi0=cy+Math.sin(a1)*ir,xi1=cx+Math.cos(a0)*ir,yi1=cy+Math.sin(a0)*ir;return{d:`M${x0} ${y0} A${r} ${r} 0 ${big} 1 ${x1} ${y1} L${xi0} ${yi0} A${ir} ${ir} 0 ${big} 0 ${xi1} ${yi1} Z`,...s};});
  return(<ChartFrame width={W} height={H}>
    {arcs.map((a,i)=>(<path key={i} d={a.d} fill={a.c} stroke={COLORS.bg} strokeWidth="2"/>))}
    <text x={cx} y={cy-6} textAnchor="middle" fill={COLORS.text} fontSize="22" fontFamily="JetBrains Mono,monospace" fontWeight="500">28.6%</text>
    <text x={cx} y={cy+14} textAnchor="middle" fill={COLORS.text3} fontSize="10" fontFamily="JetBrains Mono,monospace" letterSpacing="0.08em">DEFI ACTIVE</text>
    <g transform={`translate(${W-240},60)`}>{slices.map((s,i)=>(<g key={s.label} transform={`translate(0,${i*32})`}><rect x="0" y="0" width="12" height="12" fill={s.c} rx="2"/><text x="20" y="10" fill={COLORS.text} fontSize="12">{s.label}</text><text x="20" y="24" fill={COLORS.text3} fontSize="10" fontFamily="JetBrains Mono,monospace">{s.v.toFixed(1)}%</text></g>))}</g>
  </ChartFrame>);
}

export function ChartActivitySpan(){
  const bins=[{r:"0",v:38,c:"inexp"},{r:"1-7d",v:24,c:"inexp"},{r:"8-30d",v:13,c:"inexp"},{r:"31-90d",v:8,c:"inexp"},{r:"91-180d",v:5,c:"mid"},{r:"181-365d",v:4.5,c:"mid"},{r:"1-2y",v:3.8,c:"smart"},{r:"2-5y",v:2.9,c:"smart"},{r:"5y+",v:0.8,c:"smart"}];
  const W=720,H=340,pl=56,pr=24,pt=24,pb=60,cw=W-pl-pr,ch=H-pt-pb,max=40,bw=cw/bins.length;
  const colorOf={smart:COLORS.smart,inexp:COLORS.inexp,mid:"#7a6db0"};
  return(<ChartFrame width={W} height={H}>
    <GridLines x={pl} y={pt} w={cw} h={ch} ticks={4}/>
    {bins.map((b,i)=>{const h=(b.v/max)*ch,x=pl+i*bw+4,y=pt+ch-h;return(<g key={b.r}><rect x={x} y={y} width={bw-8} height={h} fill={colorOf[b.c]} opacity="0.85" rx="2"/><text x={x+(bw-8)/2} y={H-pb+16} textAnchor="middle" fill={COLORS.text2} fontSize="10" fontFamily="JetBrains Mono,monospace">{b.r}</text><text x={x+(bw-8)/2} y={y-6} textAnchor="middle" fill={COLORS.text} fontSize="10" fontFamily="JetBrains Mono,monospace">{b.v}%</text></g>);})}
  </ChartFrame>);
}

export function ChartSubcategory(){
  const subs=[{name:"One-timer / Casual",v:78.4,c:"inexp"},{name:"Dormant Wallet",v:14.6,c:"inexp"},{name:"Failed Trader",v:5.8,c:"inexp"},{name:"DeFi Power User",v:0.72,c:"smart"},{name:"Long-term Holder",v:0.31,c:"smart"},{name:"Whale",v:0.14,c:"smart"},{name:"Bot/Exchange",v:0.03,c:"smart"}];
  const W=720,H=360,pl=150,pr=80,pt=20,pb=30,cw=W-pl-pr,ch=H-pt-pb,bh=ch/subs.length-6,max=80;
  return(<ChartFrame width={W} height={H}>
    {subs.map((s,i)=>{const y=pt+i*(bh+6),w=Math.max(2,(s.v/max)*cw),color=s.c==="smart"?COLORS.smart:COLORS.inexp;return(<g key={s.name}><text x={pl-10} y={y+bh/2+4} textAnchor="end" fill={COLORS.text2} fontSize="11">{s.name}</text><rect x={pl} y={y} width={cw} height={bh} fill={COLORS.bg2} rx="2"/><rect x={pl} y={y} width={w} height={bh} fill={color} opacity="0.9" rx="2"/><text x={pl+w+8} y={y+bh/2+4} fill={COLORS.text} fontSize="11" fontFamily="JetBrains Mono,monospace">{s.v<1?s.v.toFixed(2):s.v.toFixed(1)}%</text></g>);})}
  </ChartFrame>);
}

export function ChartFeatureImportance(){
  const feats=[{name:"Contract Call Rate",v:35.7},{name:"ERC20 Rate",v:25.9},{name:"Unique Receivers",v:7.9},{name:"Transaction Count",v:6.0},{name:"Active Days",v:5.5},{name:"Activity Span",v:4.8},{name:"Success Rate",v:4.1},{name:"Total ETH Sent",v:3.6},{name:"Fail Rate",v:2.7},{name:"Avg Tx Value",v:1.8}];
  const W=720,H=460,pl=150,pr=60,pt=20,pb=40,cw=W-pl-pr,ch=H-pt-pb,bh=ch/feats.length-4,max=40;
  return(<ChartFrame width={W} height={H}>
    {[0,10,20,30,40].map(v=>(<g key={v}><line x1={pl+(v/max)*cw} y1={pt} x2={pl+(v/max)*cw} y2={pt+ch} stroke={COLORS.grid} strokeDasharray="2 4"/><text x={pl+(v/max)*cw} y={H-pb+18} textAnchor="middle" fill={COLORS.text3} fontSize="10" fontFamily="JetBrains Mono,monospace">{v}%</text></g>))}
    {feats.map((f,i)=>{const y=pt+i*(bh+4),w=(f.v/max)*cw,top5=i<5;return(<g key={f.name}><text x={pl-10} y={y+bh/2+4} textAnchor="end" fill={top5?COLORS.text:COLORS.text2} fontSize="11" fontWeight={top5?500:400}>{f.name}</text><rect x={pl} y={y} width={w} height={bh} fill={top5?COLORS.smart:"#3a4150"} opacity={top5?0.95:0.7} rx="2"/><text x={pl+w+8} y={y+bh/2+4} fill={top5?COLORS.text:COLORS.text3} fontSize="11" fontFamily="JetBrains Mono,monospace">{f.v.toFixed(1)}%</text></g>);})}
  </ChartFrame>);
}

export function ChartConfusion(){
  const cells=[{r:0,c:0,v:3142891,label:"True positive",color:COLORS.smart,tone:0.95},{r:0,c:1,v:21743,label:"False negative",color:COLORS.inexp,tone:0.35},{r:1,c:0,v:15108,label:"False positive",color:COLORS.inexp,tone:0.3},{r:1,c:1,v:48440606,label:"True negative",color:COLORS.smart,tone:0.95}];
  const W=720,H=460,pl=140,pr=40,pt=60,pb=40,cw=W-pl-pr,ch=H-pt-pb,cellW=cw/2,cellH=ch/2;
  return(<ChartFrame width={W} height={H}>
    <text x={pl+cellW/2} y={pt-28} textAnchor="middle" fill={COLORS.text3} fontSize="11" fontFamily="JetBrains Mono,monospace" letterSpacing="0.06em">PREDICTED SMART</text>
    <text x={pl+cellW+cellW/2} y={pt-28} textAnchor="middle" fill={COLORS.text3} fontSize="11" fontFamily="JetBrains Mono,monospace" letterSpacing="0.06em">PREDICTED INEXP.</text>
    <text x={pl-12} y={pt+cellH/2+4} textAnchor="end" fill={COLORS.text3} fontSize="11" fontFamily="JetBrains Mono,monospace">ACTUAL SMART</text>
    <text x={pl-12} y={pt+cellH+cellH/2+4} textAnchor="end" fill={COLORS.text3} fontSize="11" fontFamily="JetBrains Mono,monospace">ACTUAL INEXP.</text>
    {cells.map((c,i)=>{const x=pl+c.c*cellW+4,y=pt+c.r*cellH+4,w=cellW-8,h=cellH-8;return(<g key={i}><rect x={x} y={y} width={w} height={h} fill={c.color} opacity={c.tone} rx="8"/><text x={x+w/2} y={y+h/2-6} textAnchor="middle" fill="#fff" fontSize="22" fontFamily="JetBrains Mono,monospace" fontWeight="500">{c.v.toLocaleString()}</text><text x={x+w/2} y={y+h/2+18} textAnchor="middle" fill="#fff" opacity="0.75" fontSize="11" fontFamily="JetBrains Mono,monospace" letterSpacing="0.08em">{c.label.toUpperCase()}</text></g>);})}
  </ChartFrame>);
}

export function ChartModelPerf(){
  const tiles=[{label:"Accuracy",v:99.30,max:100,suffix:"%"},{label:"AUC-ROC",v:0.9997,max:1,suffix:""},{label:"F1 Score",v:0.9930,max:1,suffix:""},{label:"Precision",v:99.52,max:100,suffix:"%"},{label:"Recall",v:99.31,max:100,suffix:"%"}];
  const W=720,H=460,pad=16,cols=2,rows=3,tileW=(W-pad*(cols+1))/cols,tileH=(H-pad*(rows+1))/rows;
  return(<ChartFrame width={W} height={H}>
    {tiles.map((t,i)=>{const col=i%cols,row=Math.floor(i/cols),x=pad+col*(tileW+pad),y=pad+row*(tileH+pad),pct=t.v/t.max,barW=(tileW-32)*pct;return(<g key={t.label}><rect x={x} y={y} width={tileW} height={tileH} fill={COLORS.bg2} stroke={COLORS.grid} rx="10"/><text x={x+16} y={y+24} fill={COLORS.text3} fontSize="11" fontFamily="JetBrains Mono,monospace" letterSpacing="0.08em">{t.label.toUpperCase()}</text><text x={x+16} y={y+64} fill={COLORS.text} fontSize="32" fontFamily="JetBrains Mono,monospace" fontWeight="500">{t.max===1?t.v.toFixed(4):t.v.toFixed(2)}{t.suffix}</text><rect x={x+16} y={y+tileH-26} width={tileW-32} height="4" fill={COLORS.grid} rx="2"/><rect x={x+16} y={y+tileH-26} width={barW} height="4" fill={COLORS.smart} rx="2"/></g>);})}
    <g transform={`translate(${pad},${pad+2*(tileH+pad)})`}><rect x="0" y="0" width={W-pad*2} height={tileH} fill={COLORS.bg2} stroke={COLORS.grid} rx="10"/><text x="16" y="24" fill={COLORS.text3} fontSize="11" fontFamily="JetBrains Mono,monospace" letterSpacing="0.08em">TRAINING DETAIL</text><text x="16" y="56" fill={COLORS.text} fontSize="14">500 trees · max depth 24 · Gini split</text><text x="16" y="80" fill={COLORS.text2} fontSize="12" fontFamily="JetBrains Mono,monospace">Trained on 206,481,392 wallets · 4h 12m on 112 cores</text></g>
  </ChartFrame>);
}

export function ChartCluster2D(){
  const rng=(seed)=>{let s=seed;return()=>(s=(s*9301+49297)%233280)/233280;};
  const groups=[{name:"One-timer/Casual",color:COLORS.inexp,count:220,cx:0.72,cy:0.55,sx:0.10,sy:0.10},{name:"Dormant",color:"#a14b59",count:80,cx:0.62,cy:0.72,sx:0.06,sy:0.06},{name:"Failed Trader",color:"#e07b62",count:60,cx:0.55,cy:0.42,sx:0.05,sy:0.05},{name:"Long-term Holder",color:"#5d8fc2",count:40,cx:0.32,cy:0.34,sx:0.04,sy:0.04},{name:"DeFi Power User",color:COLORS.smart,count:35,cx:0.22,cy:0.5,sx:0.04,sy:0.04},{name:"Whale",color:"#67c0e3",count:20,cx:0.18,cy:0.22,sx:0.03,sy:0.03},{name:"Bot/Exchange",color:"#a8def5",count:15,cx:0.1,cy:0.12,sx:0.025,sy:0.025}];
  const W=720,H=480,pl=56,pr=24,pt=24,pb=44,cw=W-pl-pr,ch=H-pt-pb,r=rng(42);
  return(<ChartFrame width={W} height={H}>
    <GridLines x={pl} y={pt} w={cw} h={ch} ticks={4}/>
    {groups.map((g)=>{const pts=[];for(let i=0;i<g.count;i++){const dx=(r()+r()-1)*g.sx,dy=(r()+r()-1)*g.sy;pts.push({x:g.cx+dx,y:g.cy+dy});}return(<g key={g.name}>{pts.map((p,i)=>(<circle key={i} cx={pl+p.x*cw} cy={pt+p.y*ch} r="3" fill={g.color} opacity="0.7"/>))}</g>);})}
    <text x={pl+cw/2} y={H-8} textAnchor="middle" fill={COLORS.text3} fontSize="10" fontFamily="JetBrains Mono,monospace">PC1 (52.4% variance)</text>
    <g transform={`translate(${W-pr-170},${pt+8})`}><rect x="-10" y="-10" width="180" height={groups.length*18+16} fill={COLORS.bg2} stroke={COLORS.grid} rx="6" opacity="0.95"/>{groups.map((g,i)=>(<g key={g.name} transform={`translate(0,${i*18})`}><circle cx="2" cy="4" r="4" fill={g.color}/><text x="14" y="8" fill={COLORS.text2} fontSize="10">{g.name}</text></g>))}</g>
  </ChartFrame>);
}

export function ChartClusterProfiles(){
  const features=["Contract","ERC20","Receivers","Tx Count","Days","Span"];
  const clusters=[{name:"Bot/Exchange",values:[0.30,0.95,0.99,0.99,0.95,0.99],color:"#a8def5"},{name:"Whale",values:[0.40,0.85,0.85,0.65,0.55,0.45],color:"#67c0e3"},{name:"DeFi Power User",values:[0.95,0.80,0.65,0.55,0.70,0.75],color:COLORS.smart},{name:"Long-term Holder",values:[0.20,0.55,0.20,0.18,0.40,0.92],color:"#5d8fc2"},{name:"Failed Trader",values:[0.45,0.40,0.20,0.18,0.25,0.30],color:"#e07b62"},{name:"Dormant",values:[0.05,0.10,0.04,0.05,0.08,0.15],color:"#a14b59"},{name:"One-timer/Casual",values:[0.02,0.18,0.02,0.01,0.02,0.02],color:COLORS.inexp}];
  const W=720,H=480,pl=160,pr=24,pt=50,pb=30,cw=W-pl-pr,ch=H-pt-pb,colW=cw/features.length,rowH=ch/clusters.length-4;
  const colorAt=(v,base)=>`rgba(${parseInt(base.slice(1,3),16)},${parseInt(base.slice(3,5),16)},${parseInt(base.slice(5,7),16)},${0.15+v*0.8})`;
  return(<ChartFrame width={W} height={H}>
    {features.map((f,i)=>(<text key={f} x={pl+i*colW+colW/2} y={pt-14} textAnchor="middle" fill={COLORS.text3} fontSize="10" fontFamily="JetBrains Mono,monospace" letterSpacing="0.06em">{f.toUpperCase()}</text>))}
    {clusters.map((c,ri)=>{const y=pt+ri*(rowH+4);return(<g key={c.name}><text x={pl-10} y={y+rowH/2+4} textAnchor="end" fill={COLORS.text2} fontSize="11">{c.name}</text>{c.values.map((v,ci)=>{const x=pl+ci*colW+2;return(<g key={ci}><rect x={x} y={y} width={colW-4} height={rowH} fill={colorAt(v,c.color)} rx="3"/><text x={x+(colW-4)/2} y={y+rowH/2+4} textAnchor="middle" fill={v>0.5?"#fff":COLORS.text3} fontSize="10" fontFamily="JetBrains Mono,monospace">{v.toFixed(2)}</text></g>);})}</g>);})}
  </ChartFrame>);
}
