/* Oinarriak: azterketako unitate-kontzentrazioak eta mol-frakzioa. */
(function(g){
'use strict';
const bi=g.Estudio.b,b=(eu,es)=>bi(es,eu),A=g.AZ_ADD;

A('2019-20-o-1',{status:'ok',steps:[
 b('<b>a)</b> Helburuko kaltzio kloruroa: n = 0,200 mol·L⁻¹ · 3,00 L = 0,600 mol. 25,0 g CaCl₂·2H₂O-k 25,0/147 = 0,1701 mol CaCl₂ dauzka.','<b>a)</b> Cloruro de calcio objetivo: n = 0,200 mol·L⁻¹ · 3,00 L = 0,600 mol. Los 25,0 g de CaCl₂·2H₂O contienen 25,0/147 = 0,1701 mol de CaCl₂.'),
 b('Falta 0,600−0,1701=0,4299 mol CaCl₂. Masa anhidro purua = 0,4299·111 = 47,72 g; % 80ko gatz komertzialaren masa = 47,72/0,80 = <b>59,7 g</b>.','Faltan 0,600−0,1701=0,4299 mol de CaCl₂. Masa anhidra pura = 0,4299·111 = 47,72 g; masa de sal comercial al 80 % = 47,72/0,80 = <b>59,7 g</b>.'),
 b('<b>b)</b> Azken disoluzioaren masa = 3000 mL·1,02 g/mL = 3060 g. Aktibo den CaCl₂-ren masa = 0,600·111 = 66,6 g; gatz anhidro komertzialeko ez-purutasuna = 59,7·0,20 = 11,94 g.','<b>b)</b> Masa de disolución final = 3000 mL·1,02 g/mL = 3060 g. Masa de CaCl₂ activo = 0,600·111 = 66,6 g; impureza de la sal anhidra comercial = 59,7·0,20 = 11,94 g.'),
 b('Disolbatzailearen ura = 3060−66,6−11,94 = 2981,5 g = 2,9815 kg. (Hidratoaren kristalizazio-ura ere ur horren barruan dago.)','Masa de agua disolvente = 3060−66,6−11,94 = 2981,5 g = 2,9815 kg. (El agua de cristalización del hidrato forma parte de esa masa de agua.)'),
 b('Molalitatea: m = 0,600 mol/2,9815 kg = <b>0,201 mol·kg⁻¹</b>.','Molalidad: m = 0,600 mol/2,9815 kg = <b>0,201 mol·kg⁻¹</b>.')],res:b('a) 59,7 g CaCl₂ anhidro komertzial; b) m=0,201 mol·kg⁻¹ (emaitza ofizialekin bat dator).','a) 59,7 g de CaCl₂ anhidro comercial; b) m=0,201 mol·kg⁻¹ (coincide con los resultados oficiales).')});

A('2019-20-e-10',{status:'ok',steps:[
 b('Oinarri gisa disoluzioaren 1,000 mol hartzen dut: x(etanol)=0,050, beraz n(etanol)=0,050 mol eta n(ura)=0,950 mol.','Tomo como base 1,000 mol de disolución: x(etanol)=0,050, por tanto n(etanol)=0,050 mol y n(agua)=0,950 mol.'),
 b('m(etanol)=0,050·46,1=2,305 g; m(ura)=0,950·18,0=17,10 g. Disoluzioaren masa osoa=19,405 g.','m(etanol)=0,050·46,1=2,305 g; m(agua)=0,950·18,0=17,10 g. La masa total de disolución es 19,405 g.'),
 b('Etanol likidoaren bolumena: V(etanol)=2,305/0,789=2,921 mL. Disoluzioaren bolumena dentsitatearekin: V(disoluzio)=19,405/0,987=19,66 mL.','Volumen de etanol líquido: V(etanol)=2,305/0,789=2,921 mL. Volumen de disolución a partir de la densidad: V(disolución)=19,405/0,987=19,66 mL.'),
 b('% v/v=100·2,921/19,66=<b>14,86 %</b>. Ehunekoak osagaien bolumen likidoa eta disoluzioaren bolumena alderatzen ditu; ez da frakzio molarraren berdina.','% v/v=100·2,921/19,66=<b>14,86 %</b>. El porcentaje compara el volumen líquido del componente con el volumen de disolución; no es igual a la fracción molar.')],res:b('14,86 % v/v etanol (soluzio ofizialarekin bat dator).','14,86 % v/v de etanol (coincide con la solución oficial).')});
})(window);
