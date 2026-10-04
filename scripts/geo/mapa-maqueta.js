  (function(){
    document.documentElement.classList.add("js-map");
    const TONE={"Austin":"#7A3E1D","Round Rock":"#B8692F","Cedar Park":"#9c5a2c","Leander":"#C98B4F","Georgetown":"#8a4a22","Pflugerville":"#C98B4F","Hutto":"#6b361a","Manor":"#B8692F","Lakeway":"#C98B4F","Bee Cave":"#B8692F","West Lake Hills":"#D49A5E","Dripping Springs":"#9c5a2c","Buda":"#C98B4F","Kyle":"#8a4a22"};
    const NUDGE={"West Lake Hills":[0,0,"sm"],"Bee Cave":[0,0,"sm"],"Austin":[0,24]};
    let svg=`<svg viewBox="0 0 ${GEO.W} ${GEO.H}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Mapa de los condados de Travis, Williamson y Hays con las zonas que atiende DHC">`;
    svg+=GEO.counties.map(c=>`<path class="county" d="${c.d}"/>`).join("");
    svg+=`<path class="shadow" d="${GEO.outline}" transform="translate(6 8)"/>`;
    let k=0;
    GEO.zones.slice().sort((a,b)=>a.on-b.on).forEach(z=>{
      const fill=z.on?(TONE[z.n]||"#9c5a2c"):"#DCD0BE", delay=(z.on?(k++)*0.06:0).toFixed(2)+"s";
      svg+=`<g class="city ${z.on?"":"off"}" data-city="${z.n}" style="--d:${delay}"><path d="${z.d}" fill="${fill}"/></g>`;
    });
    svg+=`<path class="outline" d="${GEO.outline}"/>`;
    GEO.zones.forEach(z=>{
      const [dx,dy,sz]=NUDGE[z.n]||[0,0]; const words=z.n.split(" ");
      const lines=words.length>1&&z.n.length>9?[words.slice(0,Math.ceil(words.length/2)).join(" "),words.slice(Math.ceil(words.length/2)).join(" ")]:[z.n];
      const lh=sz?12:16, y0=z.l[1]+dy-(lines.length-1)*lh/2+5;
      svg+=`<text class="zl ${z.on?"":"off"} ${sz||""}" data-for="${z.n}" x="${z.l[0]+dx}" y="${y0}" text-anchor="middle">${lines.map((t,i)=>`<tspan x="${z.l[0]+dx}" dy="${i?lh:0}">${t}</tspan>`).join("")}</text>`;
    });
    const [ax,ay]=GEO.base;
    svg+=`<path d="M${ax} ${ay-10}l2.9 6 6.6.9-4.8 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.8-4.6 6.6-.9z" fill="#F2B66D" stroke="#141210" stroke-width="1.2"/>`;
    svg+=`<g transform="translate(${GEO.W-40} 40)" font-family="Barlow, sans-serif" fill="#8a7f72"><path d="M0 -16 L6 2 L0 -2 L-6 2Z"/><text y="16" font-size="11" text-anchor="middle" font-weight="600">N</text></g>`;
    svg+=`<g transform="translate(${GEO.W-150} ${GEO.H-26})" font-family="Barlow, sans-serif" font-size="10" fill="#8a7f72"><line x1="0" y1="0" x2="${(10/69*800).toFixed(1)}" y2="0" stroke="#8a7f72" stroke-width="2"/><text x="0" y="-6">10 millas</text></g></svg>`;
    const map=document.getElementById("areasMap"); map.innerHTML=svg;
    const list=document.getElementById("cityList");
    list.innerHTML=GEO.zones.filter(z=>z.on).sort((a,b)=>a.n==="Austin"?-1:b.n==="Austin"?1:a.n.localeCompare(b.n)).map(z=>`<li><button type="button" data-city="${z.n}">${z.n}</button></li>`).join("");
    const hl=(n,on)=>{map.querySelector(`.city[data-city="${n}"]`)?.classList.toggle("on",on);list.querySelector(`button[data-city="${n}"]`)?.classList.toggle("on",on);};
    for(const [el,sel] of [[list,"button"],[map,".city:not(.off)"]]){
      el.addEventListener("pointerover",e=>{const t=e.target.closest(sel);if(t)hl(t.dataset.city,true);});
      el.addEventListener("pointerout",e=>{const t=e.target.closest(sel);if(t)hl(t.dataset.city,false);});
    }
    list.addEventListener("focusin",e=>{const b=e.target.closest("button");if(b)hl(b.dataset.city,true);});
    list.addEventListener("focusout",e=>{const b=e.target.closest("button");if(b)hl(b.dataset.city,false);});
    const sec=document.getElementById("zonas");
    if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>{if(es.some(x=>x.isIntersecting)){sec.classList.add("lit");io.disconnect();}},{threshold:.25});io.observe(sec);} else sec.classList.add("lit");
  })();
