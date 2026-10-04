const t=require("./tracts.json");
// [nombre, lat, lon, peso, atendida]
const S=[["Austin",30.285,-97.745,2.6,1],["Round Rock",30.508,-97.679,1,1],["Cedar Park",30.505,-97.820,1,1],["Georgetown",30.633,-97.678,1.3,1],
["Pflugerville",30.439,-97.620,1,1],["Leander",30.579,-97.853,1.1,1],["Lakeway",30.364,-97.980,1.1,1],["Bee Cave",30.300,-97.945,.9,1],
["West Lake Hills",30.297,-97.802,.55,1],["Dripping Springs",30.190,-98.087,1.4,1],["Buda",30.085,-97.840,1.1,1],["Kyle",29.989,-97.877,1.1,1],
["Manor",30.341,-97.557,1.2,1],["Hutto",30.543,-97.546,1,1],
["Taylor",30.571,-97.409,1.4,0],["San Marcos",29.883,-97.941,1.4,0],["Jarrell",30.82,-97.60,1.4,0],["Liberty Hill",30.665,-97.922,1.1,0],["Lago Vista",30.46,-97.99,1,0],["Wimberley",29.997,-98.098,1.3,0]];
const C=Math.cos(30.3*Math.PI/180);
t.features=t.features.filter(f=>["453","491","209"].includes(f.properties.COUNTYFP));
for(const f of t.features){const {cx,cy}=f.properties;let best,bd=1e9;
  for(const [n,la,lo,w] of S){const d=Math.hypot((cx-lo)*C,cy-la)/w;if(d<bd){bd=d;best=n;}}
  if(best==="Kyle"&&cx<-97.92){bd=1e9;for(const [n,la,lo,w] of S){if(n==="Kyle")continue;const d=Math.hypot((cx-lo)*C,cy-la)/w;if(d<bd){bd=d;best=n;}}}
  f.properties={zone:best};}
require("fs").writeFileSync("tracts-z.json",JSON.stringify(t));
require("fs").writeFileSync("seeds.json",JSON.stringify(S));
console.log(t.features.length,"tracts");
