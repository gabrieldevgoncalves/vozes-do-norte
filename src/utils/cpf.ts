export function normalizeCPF(v: string) { return (v || "").replace(/\D/g, ""); }
export function isValidCPF(v: string) {
const c = normalizeCPF(v);
if (c.length !== 11 || /(\d)\1{10}/.test(c)) return false;
let d1 = 0, d2 = 0;
for (let i = 0; i < 9; i++) { const n = +c[i]; d1 += n*(10-i); d2 += n*(11-i); }
d1 = (d1*10) % 11; if (d1 === 10) d1 = 0;
d2 = ((d2 + d1*2)*10) % 11; if (d2 === 10) d2 = 0;
return d1 === +c[9] && d2 === +c[10];
}