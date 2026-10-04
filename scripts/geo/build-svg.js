const fs=require("fs");const Z=require("./zones-l.json"),O=require("./outline.json"),CO=require("./counties2.json"),S=require("./seeds.json");
const LON0=-98.32,LON1=-97.10,LAT0=29.72,LAT1=30.93,K=800,C=Math.cos(30.3*Math.PI/180);
const X=l=>(l-LON0)*K*C,Y=l=>(LAT1-l)*K,r=v=>Math.round(v*10)/10;
const W=Math.round(X(LON1)),H=Math.round(Y(LAT0));
const rings=g=>g.type==="Polygon"?g.coordinates:g.coordinates.flat();
const d=g=>rings(g).map(rg=>"M"+rg.map(([lo,la])=>r(X(lo))+","+r(Y(la))).join("L")+"Z").join("");
const served=Object.fromEntries(S.map(s=>[s[0],s[4]]));
const out={W,H,
 zones:Z.features.map(f=>({n:f.properties.zone,on:served[f.properties.zone],d:d(f.geometry),l:[r(X(f.properties.lx)),r(Y(f.properties.ly))]})),
 outline:d((O.geometries||O.features.map(f=>f.geometry))[0]),
 counties:CO.features.map(f=>({n:f.properties.NAME,d:d(f.geometry)})),
 base:[r(X(-97.743)),r(Y(30.267))]};
fs.writeFileSync("geo-data2.js","const GEO="+JSON.stringify(out)+";");
console.log(W,H,(fs.statSync("geo-data2.js").size/1024).toFixed(1)+"KB",out.zones.map(z=>z.n).join(", "));
