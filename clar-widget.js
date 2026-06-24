/*!
 * Clar — el teu ajuntament, en clar · by Appjuntament
 * Widget de cerca de tràmits en llenguatge planer (prototip DEV-01)
 * Integració mínima: <script src="clar-widget.js" data-municipi="Vilaroca" data-lang="ca" defer></script>
 * Atributs opcionals:
 *   data-cataleg="cataleg/municipi.json"  catàleg extern via fetch (o script previ amb window.ClarCataleg)
 *   data-analytics-endpoint="https://…/clar/events"  enviament de mètriques per lots
 *   data-demo="true"  mostra les URLs en lloc de navegar-hi
 * Sense dependències. ca/es. Matching local per sinònims i situacions vitals.
 */
(function () {
  "use strict";

  /* ============================ CATÀLEG ============================
     Camps: id · ca/es {n: nom planer, o: nom oficial, d: descripció, r: què necessites}
     syn: sinònims i paraules (ca+es, normalitzats) · vit: frases de situació vital
     ch: canals [online|cita|presencial] · url (# al prototip)                    */
  var CATALEG = [
    { id:"padro-alta", ca:{n:"Empadronar-te (alta o canvi de domicili)", o:"Alta o modificació al Padró Municipal d'Habitants", d:"Quan véns a viure al municipi o canvies de pis dins del poble.", r:"DNI/NIE i contracte de lloguer o escriptura (o autorització del propietari)."}, es:{n:"Empadronarte (alta o cambio de domicilio)", o:"Alta o modificación en el Padrón Municipal de Habitantes", d:"Cuando vienes a vivir al municipio o cambias de piso dentro del pueblo.", r:"DNI/NIE y contrato de alquiler o escritura (o autorización del propietario)."}, syn:["padro","padron","empadronar","empadronament","empadronamiento","domicili","domicilio","viure","vivir","alta","resident"], vit:["em mudo","me mudo","canvi de pis","cambio de piso","venc a viure","vengo a vivir","acabo de llegar","acabo d'arribar","nueva casa","casa nova","mudanza","mudança"], ch:["cita","online"], url:"#" },
    { id:"padro-volant", ca:{n:"Paper que digui on vius (volant d'empadronament)", o:"Volant individual o col·lectiu d'empadronament", d:"El document que demanen per a escoles, beques, metge o estrangeria.", r:"DNI/NIE. El reps al moment online o a l'OAC."}, es:{n:"Papel que diga dónde vives (volante de empadronamiento)", o:"Volante individual o colectivo de empadronamiento", d:"El documento que piden para escuelas, becas, médico o extranjería.", r:"DNI/NIE. Lo recibes al momento online o en la OAC."}, syn:["volant","volante","certificat","certificado","empadronament","empadronamiento","padro","padron","justificant","justificante","escola","beca","estrangeria","extranjeria"], vit:["necessito un paper que digui on visc","necesito un papel que diga donde vivo","em demanen el padro","me piden el padron","paper del padro","papel del padron"], ch:["online","presencial"], url:"#" },
    { id:"padro-cert", ca:{n:"Certificat d'empadronament (amb segell oficial)", o:"Certificat d'empadronament", d:"Versió amb validesa davant jutjats, notaria o organismes estrangers.", r:"DNI/NIE; si és per a una altra persona, autorització."}, es:{n:"Certificado de empadronamiento (con sello oficial)", o:"Certificado de empadronamiento", d:"Versión con validez ante juzgados, notaría u organismos extranjeros.", r:"DNI/NIE; si es para otra persona, autorización."}, syn:["certificat","certificado","padro","padron","notaria","jutjat","juzgado","herencia","herència"], vit:["certificat oficial de residencia","certificado oficial de residencia"], ch:["online","cita"], url:"#" },
    { id:"convivencia", ca:{n:"Certificat de convivència (qui viu amb tu)", o:"Certificat de convivència", d:"Acredita les persones que conviuen al mateix domicili.", r:"DNI/NIE del sol·licitant."}, es:{n:"Certificado de convivencia (quién vive contigo)", o:"Certificado de convivencia", d:"Acredita las personas que conviven en el mismo domicilio.", r:"DNI/NIE del solicitante."}, syn:["convivencia","convivència","conviure","convivir","parella","pareja","familia","família"], vit:["qui viu amb mi","quien vive conmigo","demostrar que vivim junts","demostrar que vivimos juntos"], ch:["online","presencial"], url:"#" },
    { id:"ibi-pagar", ca:{n:"Pagar l'IBI (impost de la casa)", o:"Liquidació de l'Impost sobre Béns Immobles", d:"El rebut anual per tenir un pis, casa, garatge o local.", r:"Referència cadastral o el rebut. Pots pagar online, al banc o domiciliar-lo."}, es:{n:"Pagar el IBI (impuesto de la casa)", o:"Liquidación del Impuesto sobre Bienes Inmuebles", d:"El recibo anual por tener un piso, casa, garaje o local.", r:"Referencia catastral o el recibo. Puedes pagar online, en el banco o domiciliarlo."}, syn:["ibi","impost","impuesto","contribucio","contribucion","rebut","recibo","casa","pis","piso","cadastre","catastro","pagar"], vit:["vull pagar l'ibi","quiero pagar el ibi","m'ha arribat l'ibi","me ha llegado el ibi","contribucion urbana"], ch:["online","presencial"], url:"#" },
    { id:"domiciliar", ca:{n:"Domiciliar els rebuts municipals", o:"Ordre de domiciliació bancària de tributs", d:"Que l'IBI, escombraries o el gual es paguin sols del compte.", r:"IBAN i DNI/NIE del titular."}, es:{n:"Domiciliar los recibos municipales", o:"Orden de domiciliación bancaria de tributos", d:"Que el IBI, basuras o el vado se paguen solos de la cuenta.", r:"IBAN y DNI/NIE del titular."}, syn:["domiciliar","domiciliacio","domiciliacion","banc","banco","rebuts","recibos","compte","cuenta","iban"], vit:["que es pagui sol","que se pague solo","carregar al compte","cargar en cuenta"], ch:["online"], url:"#" },
    { id:"plusvalua", ca:{n:"Plusvàlua per vendre o heretar un pis", o:"Autoliquidació de l'Impost sobre l'Increment de Valor dels Terrenys (IIVTNU)", d:"L'impost que toca pagar quan vens, hereves o et donen un immoble.", r:"Escriptures i DNI/NIE. Termini: 30 dies hàbils (6 mesos si és herència)."}, es:{n:"Plusvalía por vender o heredar un piso", o:"Autoliquidación del Impuesto sobre el Incremento de Valor de los Terrenos (IIVTNU)", d:"El impuesto que toca pagar cuando vendes, heredas o te donan un inmueble.", r:"Escrituras y DNI/NIE. Plazo: 30 días hábiles (6 meses si es herencia)."}, syn:["plusvalua","plusvalia","vendre","vender","heretar","heredar","herencia","herència","donacio","donacion","iivtnu","escriptura","escritura"], vit:["he venut el pis","he vendido el piso","he heretat","he heredado","ha mort i deixa un pis","herencia de un piso"], ch:["online","cita"], url:"#" },
    { id:"defuncio", ca:{n:"Tràmits per la mort d'un familiar", o:"Serveis funeraris i concessió de drets funeraris (nínxol)", d:"Cementiri, nínxol, canvis de titularitat i orientació sobre la resta de gestions.", r:"Certificat de defunció i DNI del sol·licitant. T'acompanyem pas a pas."}, es:{n:"Trámites por la muerte de un familiar", o:"Servicios funerarios y concesión de derechos funerarios (nicho)", d:"Cementerio, nicho, cambios de titularidad y orientación sobre el resto de gestiones.", r:"Certificado de defunción y DNI del solicitante. Te acompañamos paso a paso."}, syn:["defuncio","defuncion","mort","muerte","morir","cementiri","cementerio","ninxol","nicho","funeraria","enterrament","entierro","titularitat"], vit:["ha mort un familiar","ha muerto un familiar","s'ha mort el meu pare","se ha muerto mi padre","ha mort la meva mare","se ha muerto mi madre","defuncio d'un familiar"], ch:["cita","presencial"], url:"#" },
    { id:"casament", ca:{n:"Casar-te pel civil a l'ajuntament", o:"Sol·licitud de matrimoni civil", d:"Reserva de data, sala i regidor/a per al casament civil.", r:"Expedient del Registre Civil iniciat i DNI dels dos."}, es:{n:"Casarte por lo civil en el ayuntamiento", o:"Solicitud de matrimonio civil", d:"Reserva de fecha, sala y concejal/a para la boda civil.", r:"Expediente del Registro Civil iniciado y DNI de ambos."}, syn:["casament","casamiento","boda","casar","matrimoni","matrimonio","civil","parella","pareja"], vit:["em caso","me caso","ens volem casar","nos queremos casar"], ch:["cita"], url:"#" },
    { id:"naixement", ca:{n:"Has tingut un fill: empadronar el nadó i ajuts", o:"Alta al padró per naixement i prestacions municipals", d:"Empadronar el nadó (sovint automàtic), llar d'infants i ajuts locals.", r:"Llibre de família o certificat de naixement."}, es:{n:"Has tenido un hijo: empadronar al bebé y ayudas", o:"Alta en el padrón por nacimiento y prestaciones municipales", d:"Empadronar al bebé (a menudo automático), guardería y ayudas locales.", r:"Libro de familia o certificado de nacimiento."}, syn:["nadon","nado","bebe","fill","hijo","naixement","nacimiento","neixer","nacer","llar d'infants","guarderia","maternitat","maternidad"], vit:["he tingut un fill","he tenido un hijo","ha nascut","ha nacido","acabem de tenir un bebe","acabamos de tener un bebe"], ch:["online","presencial"], url:"#" },
    { id:"escola-bressol", ca:{n:"Apuntar el nen a la llar d'infants municipal", o:"Preinscripció a l'escola bressol municipal", d:"Sol·licitud de plaça a la llar d'infants (0-3 anys). Període: primavera.", r:"Volant d'empadronament, llibre de família i DNI."}, es:{n:"Apuntar al niño a la guardería municipal", o:"Preinscripción en la escuela infantil municipal", d:"Solicitud de plaza en la guardería (0-3 años). Período: primavera.", r:"Volante de empadronamiento, libro de familia y DNI."}, syn:["llar","bressol","guarderia","escola","escuela","infantil","preinscripcio","preinscripcion","matricula","nen","nino","plaça","plaza"], vit:["apuntar el nen a la guarderia","apuntar al nino a la guarderia","placa de bressol"], ch:["online","presencial"], url:"#" },
    { id:"incidencia", ca:{n:"Avisar d'una cosa espatllada al carrer", o:"Comunicació d'incidències a la via pública", d:"Fanal fos, vorera trencada, forat, contenidor desbordat, senyal caigut…", r:"On és (adreça o foto) i què passa. En fem el seguiment."}, es:{n:"Avisar de algo roto en la calle", o:"Comunicación de incidencias en la vía pública", d:"Farola fundida, acera rota, bache, contenedor desbordado, señal caída…", r:"Dónde está (dirección o foto) y qué pasa. Hacemos el seguimiento."}, syn:["incidencia","avis","aviso","fanal","farola","vorera","acera","forat","bache","socot","clot","contenidor","contenedor","brossa","basura","senyal","senal","espatllat","roto","rota","llum","luz","arbre caigut","queixa carrer"], vit:["farola rota","fanal espatllat","he vist una farola trencada","hi ha un forat al carrer","hay un bache","la vorera esta trencada","la acera esta rota","contenedor lleno","contenidor ple","no funciona la llum del carrer"], ch:["online"], url:"#" },
    { id:"queixa", ca:{n:"Posar una queixa o fer un suggeriment", o:"Instància de queixes i suggeriments", d:"Quan vols que l'ajuntament sàpiga què no funciona o què milloraries.", r:"Explica-ho amb les teves paraules; resposta en 30 dies."}, es:{n:"Poner una queja o hacer una sugerencia", o:"Instancia de quejas y sugerencias", d:"Cuando quieres que el ayuntamiento sepa qué no funciona o qué mejorarías.", r:"Cuéntalo con tus palabras; respuesta en 30 días."}, syn:["queixa","queja","suggeriment","sugerencia","reclamacio","reclamacion","protestar","reclamar"], vit:["vull posar una queixa","quiero poner una queja","vull reclamar","quiero reclamar"], ch:["online","presencial"], url:"#" },
    { id:"instancia", ca:{n:"Presentar un escrit per a qualsevol altra cosa", o:"Instància genèrica (registre electrònic)", d:"Si cap tràmit encaixa amb el que necessites, entra qualsevol sol·licitud per aquí.", r:"Identificació digital (idCAT Mòbil) o presencialment amb DNI."}, es:{n:"Presentar un escrito para cualquier otra cosa", o:"Instancia genérica (registro electrónico)", d:"Si ningún trámite encaja con lo que necesitas, entra cualquier solicitud por aquí.", r:"Identificación digital (idCAT Móvil) o presencialmente con DNI."}, syn:["instancia","instància","generica","generica","escrit","escrito","sol·licitud","solicitud","registre","registro","demanar","pedir"], vit:["vull demanar una cosa que no surt","quiero pedir algo que no aparece","presentar un escrit","presentar un escrito"], ch:["online","presencial"], url:"#" },
    { id:"cita-oac", ca:{n:"Demanar cita amb l'ajuntament (OAC)", o:"Cita prèvia a l'Oficina d'Atenció Ciutadana", d:"Reserva dia i hora i t'estalvies la cua.", r:"Només el DNI/NIE. Tria oficina, dia i franja."}, es:{n:"Pedir cita con el ayuntamiento (OAC)", o:"Cita previa en la Oficina de Atención Ciudadana", d:"Reserva día y hora y te ahorras la cola.", r:"Solo el DNI/NIE. Elige oficina, día y franja."}, syn:["cita","previa","prèvia","hora","oac","atencio","atencion","oficina","reservar","demanar hora","pedir hora"], vit:["vull demanar cita","quiero pedir cita","demanar hora amb l'ajuntament","pedir hora con el ayuntamiento"], ch:["online"], url:"#" },
    { id:"multa", ca:{n:"Pagar o recórrer una multa", o:"Liquidació o al·legacions a sancions de trànsit", d:"Paga amb descompte (50% en 20 dies) o presenta al·legacions.", r:"Número d'expedient o matrícula i DNI."}, es:{n:"Pagar o recurrir una multa", o:"Liquidación o alegaciones a sanciones de tráfico", d:"Paga con descuento (50% en 20 días) o presenta alegaciones.", r:"Número de expediente o matrícula y DNI."}, syn:["multa","sancio","sancion","transit","trafico","recorrer","recurrir","al·legacions","alegaciones","aparcament","aparcamiento","radar"], vit:["m'han posat una multa","me han puesto una multa","recorrer una multa","recurrir una multa"], ch:["online","presencial"], url:"#" },
    { id:"zona-verda", ca:{n:"Aparcar com a resident (zona verda/blava)", o:"Distintiu d'aparcament per a residents", d:"L'adhesiu o alta que et deixa aparcar a la teva zona sense límit.", r:"Estar empadronat i tenir el vehicle al teu nom (o renting justificat)."}, es:{n:"Aparcar como residente (zona verde/azul)", o:"Distintivo de aparcamiento para residentes", d:"La pegatina o alta que te deja aparcar en tu zona sin límite.", r:"Estar empadronado y tener el vehículo a tu nombre (o renting justificado)."}, syn:["aparcar","aparcament","aparcamiento","zona","verda","verde","blava","azul","resident","residente","distintiu","distintivo","cotxe","coche","vehicle","vehiculo"], vit:["on puc aparcar com a veí","aparcar como vecino","targeta d'aparcament de resident"], ch:["online","presencial"], url:"#" },
    { id:"gual", ca:{n:"Demanar o renovar un gual (entrada de garatge)", o:"Llicència de gual permanent", d:"Perquè ningú aparqui davant del teu garatge.", r:"Plànol o foto de l'entrada, IBI del local i DNI."}, es:{n:"Pedir o renovar un vado (entrada de garaje)", o:"Licencia de vado permanente", d:"Para que nadie aparque delante de tu garaje.", r:"Plano o foto de la entrada, IBI del local y DNI."}, syn:["gual","vado","garatge","garaje","entrada","placa","aparcar davant","aparcar delante"], vit:["em bloquegen el garatge","me bloquean el garaje","placa de gual"], ch:["online","cita"], url:"#" },
    { id:"ovp-mudanca", ca:{n:"Tallar el carrer per una mudança o contenidor d'obra", o:"Autorització d'ocupació temporal de la via pública", d:"Reserva d'espai per a camió de mudances, contenidor o bastida.", r:"Dia, hores, adreça i metres. Demana-ho amb 5 dies d'antelació."}, es:{n:"Cortar la calle por una mudanza o contenedor de obra", o:"Autorización de ocupación temporal de la vía pública", d:"Reserva de espacio para camión de mudanzas, contenedor o andamio.", r:"Día, horas, dirección y metros. Pídelo con 5 días de antelación."}, syn:["mudanca","mudanza","camio","camion","contenidor d'obra","contenedor de obra","bastida","andamio","ocupacio","ocupacion","tallar carrer","cortar calle","reserva espai"], vit:["necessito tallar el carrer","necesito cortar la calle","ve el camio de la mudanca","viene el camion de la mudanza"], ch:["online"], url:"#" },
    { id:"obres", ca:{n:"Fer obres a casa (reforma petita)", o:"Comunicació prèvia d'obres menors", d:"Pintar façana, canviar banyera, fer la cuina… avisa abans de començar.", r:"Pressupost de l'obra i croquis senzill. Per a obres grans, llicència."}, es:{n:"Hacer obras en casa (reforma pequeña)", o:"Comunicación previa de obras menores", d:"Pintar fachada, cambiar bañera, hacer la cocina… avisa antes de empezar.", r:"Presupuesto de la obra y croquis sencillo. Para obras grandes, licencia."}, syn:["obres","obras","reforma","reformar","cuina","cocina","bany","bano","faana","fachada","pintar","llicencia","licencia","comunicacio previa","permis","permiso"], vit:["vull fer obres a casa","quiero hacer obras en casa","reformar el pis","reformar el piso","necessito permis d'obres","necesito permiso de obras"], ch:["online","cita"], url:"#" },
    { id:"negoci", ca:{n:"Obrir un negoci o local", o:"Comunicació prèvia d'inici d'activitat econòmica (FUE)", d:"Bar, botiga, perruqueria, taller… el primer pas per obrir.", r:"Segons l'activitat: comunicació, declaració responsable o llicència. T'orientem."}, es:{n:"Abrir un negocio o local", o:"Comunicación previa de inicio de actividad económica (FUE)", d:"Bar, tienda, peluquería, taller… el primer paso para abrir.", r:"Según la actividad: comunicación, declaración responsable o licencia. Te orientamos."}, syn:["negoci","negocio","local","botiga","tienda","bar","restaurant","restaurante","activitat","actividad","autonom","autonomo","empresa","obertura","apertura","fue","llicencia activitat"], vit:["vull obrir un bar","quiero abrir un bar","obro un negoci","abro un negocio","muntar una botiga","montar una tienda"], ch:["cita","online"], url:"#" },
    { id:"terrassa", ca:{n:"Posar taules a fora (terrassa de bar)", o:"Llicència d'ocupació de via pública amb terrassa", d:"Autorització anual per a taules i cadires davant del local.", r:"Plànol de la terrassa, assegurança del local i llicència d'activitat."}, es:{n:"Poner mesas fuera (terraza de bar)", o:"Licencia de ocupación de vía pública con terraza", d:"Autorización anual para mesas y sillas delante del local.", r:"Plano de la terraza, seguro del local y licencia de actividad."}, syn:["terrassa","terraza","taules","mesas","cadires","sillas","bar","vetllador","velador"], vit:["posar taules al carrer","poner mesas en la calle"], ch:["online","cita"], url:"#" },
    { id:"mercat", ca:{n:"Parada al mercat setmanal o ambulant", o:"Autorització de venda no sedentària", d:"Sol·licitud o renovació de parada al mercat del poble.", r:"Alta d'autònoms, assegurança RC i carnet de manipulador si toca."}, es:{n:"Puesto en el mercadillo semanal o ambulante", o:"Autorización de venta no sedentaria", d:"Solicitud o renovación de puesto en el mercadillo del pueblo.", r:"Alta de autónomos, seguro RC y carnet de manipulador si procede."}, syn:["mercat","mercadillo","parada","puesto","ambulant","ambulante","venda","venta","marxant"], vit:["vull una parada al mercat","quiero un puesto en el mercadillo"], ch:["presencial","cita"], url:"#" },
    { id:"gos-cens", ca:{n:"Registrar el teu gos o gat (cens d'animals)", o:"Inscripció al cens municipal d'animals de companyia", d:"Obligatori en tenir un animal: xip, dades teves i de l'animal.", r:"Cartilla veterinària amb el xip i DNI. Gratuït a la majoria de municipis."}, es:{n:"Registrar a tu perro o gato (censo de animales)", o:"Inscripción en el censo municipal de animales de compañía", d:"Obligatorio al tener un animal: chip, tus datos y los del animal.", r:"Cartilla veterinaria con el chip y DNI. Gratuito en la mayoría de municipios."}, syn:["gos","perro","gat","gato","animal","mascota","cens","censo","xip","chip","veterinari","veterinario"], vit:["tinc un gos nou","tengo un perro nuevo","he adoptat un gos","he adoptado un perro","registrar el gat","registrar al gato"], ch:["online","presencial"], url:"#" },
    { id:"gos-ppp", ca:{n:"Llicència per a gos potencialment perillós", o:"Llicència per a la tinença d'animals potencialment perillosos", d:"Obligatòria per a races PPP: antecedents, assegurança i aptitud.", r:"Certificat d'antecedents penals, assegurança RC de 150.000 € i certificat psicotècnic."}, es:{n:"Licencia para perro potencialmente peligroso", o:"Licencia para la tenencia de animales potencialmente peligrosos", d:"Obligatoria para razas PPP: antecedentes, seguro y aptitud.", r:"Certificado de antecedentes penales, seguro RC de 150.000 € y certificado psicotécnico."}, syn:["ppp","perillos","peligroso","pitbull","rottweiler","llicencia gos","licencia perro"], vit:[], ch:["cita"], url:"#" },
    { id:"deixalleria", ca:{n:"Llençar mobles i trastos vells", o:"Servei de recollida de voluminosos i deixalleria", d:"Recollida gratuïta de mobles al carrer (dia assignat) o porta'ls a la deixalleria.", r:"Truca o demana dia online; treu-los la vigília al vespre."}, es:{n:"Tirar muebles y trastos viejos", o:"Servicio de recogida de voluminosos y deixalleria", d:"Recogida gratuita de muebles en la calle (día asignado) o llévalos a la deixalleria.", r:"Llama o pide día online; sácalos la víspera por la noche."}, syn:["mobles","muebles","trastos","voluminosos","sofa","matalas","colchon","nevera","deixalleria","punt verd","punto limpio","llencar","tirar","recollida","recogida","electrodomestic","electrodomestico"], vit:["on llenco un sofa","donde tiro un sofa","vull llençar un matalas","quiero tirar un colchon","recollida de mobles","recogida de muebles"], ch:["online","presencial"], url:"#" },
    { id:"escombraries", ca:{n:"Taxa d'escombraries: alta, canvi o bonificació", o:"Taxa pel servei de gestió de residus municipals", d:"El rebut de la brossa: alta en llogar o comprar, i descomptes per compostatge o deixalleria.", r:"DNI i referència del rebut o contracte."}, es:{n:"Tasa de basuras: alta, cambio o bonificación", o:"Tasa por el servicio de gestión de residuos municipales", d:"El recibo de la basura: alta al alquilar o comprar, y descuentos por compostaje o deixalleria.", r:"DNI y referencia del recibo o contrato."}, syn:["escombraries","basuras","brossa","residus","residuos","taxa","tasa","rebut brossa","recibo basura"], vit:[], ch:["online","presencial"], url:"#" },
    { id:"arbre", ca:{n:"Demanar poda o avisar d'un arbre perillós", o:"Sol·licitud d'actuació sobre l'arbrat públic", d:"Branques que toquen la façana, arrels que aixequen la vorera, arbre sec.", r:"Adreça exacta i, si pots, una foto."}, es:{n:"Pedir poda o avisar de un árbol peligroso", o:"Solicitud de actuación sobre el arbolado público", d:"Ramas que tocan la fachada, raíces que levantan la acera, árbol seco.", r:"Dirección exacta y, si puedes, una foto."}, syn:["arbre","arbol","poda","podar","branques","ramas","arrels","raices","jardineria","jardineria"], vit:["l'arbre toca el meu balco","el arbol toca mi balcon","branques perilloses","ramas peligrosas"], ch:["online"], url:"#" },
    { id:"plaga", ca:{n:"Avisar de rates, paneroles o vespes", o:"Comunicació per al servei de control de plagues", d:"Plagues a la via pública o en equipaments municipals.", r:"On les has vist i des de quan."}, es:{n:"Avisar de ratas, cucarachas o avispas", o:"Comunicación para el servicio de control de plagas", d:"Plagas en la vía pública o en equipamientos municipales.", r:"Dónde las has visto y desde cuándo."}, syn:["rates","ratas","paneroles","cucarachas","vespes","avispas","vespa asiatica","plaga","plagues","plagas","coloms","palomas"], vit:["hi ha rates al carrer","hay ratas en la calle","niu de vespes","nido de avispas"], ch:["online"], url:"#" },
    { id:"soroll", ca:{n:"Queixar-te del soroll (bar, obra, veïns)", o:"Denúncia per molèsties acústiques", d:"Sorolls reiterats de locals, obres fora d'horari o activitats.", r:"Adreça, horaris en què passa i des de quan. Es pot demanar sonometria."}, es:{n:"Quejarte del ruido (bar, obra, vecinos)", o:"Denuncia por molestias acústicas", d:"Ruidos reiterados de locales, obras fuera de horario o actividades.", r:"Dirección, horarios en que ocurre y desde cuándo. Se puede pedir sonometría."}, syn:["soroll","ruido","molesties","molestias","acustica","acustica","musica","veins","vecinos","bar sorollos"], vit:["el bar de baix fa molt soroll","el bar de abajo hace mucho ruido","els veins fan soroll","los vecinos hacen ruido"], ch:["online","presencial"], url:"#" },
    { id:"festa-local", ca:{n:"Reservar una sala o espai municipal", o:"Sol·licitud d'ús d'equipaments municipals", d:"Centre cívic, sala d'actes o plaça per a activitats d'entitats o particulars.", r:"Data, espai, activitat prevista i si cal assegurança."}, es:{n:"Reservar una sala o espacio municipal", o:"Solicitud de uso de equipamientos municipales", d:"Centro cívico, sala de actos o plaza para actividades de entidades o particulares.", r:"Fecha, espacio, actividad prevista y si hace falta seguro."}, syn:["sala","espai","espacio","centre civic","centro civico","reservar","local","acte","acto","festa","fiesta","casal"], vit:["vull reservar el centre civic","quiero reservar el centro civico","una sala per a una activitat"], ch:["online","cita"], url:"#" },
    { id:"esports", ca:{n:"Reservar pista o apuntar-te al gimnàs municipal", o:"Reserva d'instal·lacions esportives municipals", d:"Pàdel, tennis, pavelló, piscina i abonaments del poliesportiu.", r:"Alta d'usuari amb DNI; bonificacions per a joves, majors i famílies."}, es:{n:"Reservar pista o apuntarte al gimnasio municipal", o:"Reserva de instalaciones deportivas municipales", d:"Pádel, tenis, pabellón, piscina y abonos del polideportivo.", r:"Alta de usuario con DNI; bonificaciones para jóvenes, mayores y familias."}, syn:["pista","padel","tennis","tenis","pavello","pabellon","piscina","gimnas","gimnasio","esport","deporte","abonament","abono","poliesportiu","polideportivo"], vit:["reservar pista de padel","vull anar a la piscina","quiero ir a la piscina"], ch:["online","presencial"], url:"#" },
    { id:"biblioteca", ca:{n:"Fer-te el carnet de la biblioteca", o:"Alta al carnet de la Xarxa de Biblioteques", d:"Gratuït; serveix per a préstec, sales d'estudi i activitats.", r:"DNI/NIE i una foto (la fan allà mateix)."}, es:{n:"Hacerte el carnet de la biblioteca", o:"Alta en el carnet de la Red de Bibliotecas", d:"Gratuito; sirve para préstamo, salas de estudio y actividades.", r:"DNI/NIE y una foto (la hacen allí mismo)."}, syn:["biblioteca","carnet","prestec","prestamo","llibres","libros","sala estudi","sala estudio"], vit:[], ch:["presencial","online"], url:"#" },
    { id:"ajut-lloguer", ca:{n:"Ajuts per pagar el lloguer", o:"Sol·licitud d'ajuts municipals a l'habitatge", d:"Ajuts locals i orientació sobre els de la Generalitat (Oficina d'Habitatge).", r:"Contracte de lloguer, ingressos de la unitat familiar i volant de convivència."}, es:{n:"Ayudas para pagar el alquiler", o:"Solicitud de ayudas municipales a la vivienda", d:"Ayudas locales y orientación sobre las de la Generalitat (Oficina de Vivienda).", r:"Contrato de alquiler, ingresos de la unidad familiar y volante de convivencia."}, syn:["lloguer","alquiler","ajut","ayuda","habitatge","vivienda","subvencio lloguer","no puc pagar"], vit:["no puc pagar el lloguer","no puedo pagar el alquiler","ajudes per l'habitatge","ayudas para la vivienda"], ch:["cita"], url:"#" },
    { id:"serveis-socials", ca:{n:"Parlar amb serveis socials", o:"Cita amb l'Equip Bàsic d'Atenció Social (EBAS)", d:"Situacions difícils: econòmiques, familiars, dependència, soledat.", r:"Només demanar cita; la primera visita orienta el cas. Confidencial."}, es:{n:"Hablar con servicios sociales", o:"Cita con el Equipo Básico de Atención Social (EBAS)", d:"Situaciones difíciles: económicas, familiares, dependencia, soledad.", r:"Solo pedir cita; la primera visita orienta el caso. Confidencial."}, syn:["socials","sociales","assistent","asistente","ebas","ajuda","ayuda","dependencia","dependència","gent gran","mayores","soledat","soledad","vulnerabilitat"], vit:["necessito ajuda","necesito ayuda","estic passant un mal moment","estoy pasando un mal momento","ajuda per a la meva avia","ayuda para mi abuela"], ch:["cita"], url:"#" },
    { id:"subvencio-entitats", ca:{n:"Subvenció per a la teva entitat o club", o:"Convocatòria de subvencions a entitats ciutadanes", d:"Ajuts anuals per a activitats d'entitats culturals, esportives i socials.", r:"Estar al registre d'entitats, projecte i pressupost. Convocatòria: 1r trimestre."}, es:{n:"Subvención para tu entidad o club", o:"Convocatoria de subvenciones a entidades ciudadanas", d:"Ayudas anuales para actividades de entidades culturales, deportivas y sociales.", r:"Estar en el registro de entidades, proyecto y presupuesto. Convocatoria: 1er trimestre."}, syn:["subvencio","subvencion","entitat","entidad","club","associacio","asociacion","ajut entitats"], vit:[], ch:["online"], url:"#" },
    { id:"bonificacions", ca:{n:"Descomptes en impostos (família nombrosa, plaques solars…)", o:"Bonificacions fiscals en tributs municipals", d:"Reduccions a l'IBI, vehicles o escombraries segons la teva situació.", r:"Títol de família nombrosa, certificat d'instal·lació solar o el que pertoqui."}, es:{n:"Descuentos en impuestos (familia numerosa, placas solares…)", o:"Bonificaciones fiscales en tributos municipales", d:"Reducciones en el IBI, vehículos o basuras según tu situación.", r:"Título de familia numerosa, certificado de instalación solar o lo que corresponda."}, syn:["bonificacio","bonificacion","descompte","descuento","familia nombrosa","familia numerosa","plaques","placas","solars","solares","hibrid","hibrido","electric","electrico"], vit:["tinc familia nombrosa","tengo familia numerosa","he posat plaques solars","he puesto placas solares"], ch:["online","cita"], url:"#" },
    { id:"vehicle-impost", ca:{n:"Impost del cotxe (IVTM): pagar, alta o baixa", o:"Impost sobre Vehicles de Tracció Mecànica", d:"El rebut anual del vehicle i què fer si el vens o el dones de baixa.", r:"Permís de circulació i DNI; per baixa, certificat de desballestament."}, es:{n:"Impuesto del coche (IVTM): pagar, alta o baja", o:"Impuesto sobre Vehículos de Tracción Mecánica", d:"El recibo anual del vehículo y qué hacer si lo vendes o lo das de baja.", r:"Permiso de circulación y DNI; para baja, certificado de desguace."}, syn:["ivtm","vehicle","vehiculo","cotxe","coche","moto","impost cotxe","impuesto coche","circulacio","circulacion","desballestament","desguace"], vit:["he venut el cotxe","he vendido el coche","pagar l'impost del cotxe","pagar el impuesto del coche"], ch:["online"], url:"#" },
    { id:"idcat", ca:{n:"Identitat digital per tramitar des de casa (idCAT Mòbil)", o:"Alta del sistema d'identificació idCAT Mòbil", d:"Amb el mòbil i sense certificats: el primer pas per fer-ho tot online.", r:"DNI/NIE, targeta sanitària i un mòbil. 5 minuts, gratuït."}, es:{n:"Identidad digital para tramitar desde casa (idCAT Móvil)", o:"Alta del sistema de identificación idCAT Móvil", d:"Con el móvil y sin certificados: el primer paso para hacerlo todo online.", r:"DNI/NIE, tarjeta sanitaria y un móvil. 5 minutos, gratuito."}, syn:["idcat","identitat","identidad","digital","certificat digital","certificado digital","clave","firma","signatura","tramitar online"], vit:["com m'identifico online","como me identifico online","no tinc certificat digital","no tengo certificado digital"], ch:["online","presencial"], url:"#" }
  ];

  /* Fora d'àmbit municipal: orientació amable en lloc de carreró sense sortida */
  var FORA = [
    { syn:["dni","passaport","pasaporte","renovar dni"], ca:{n:"Renovar el DNI o passaport", d:"Això és de la Policia Nacional, no de l'ajuntament. Demana cita a citapreviadnie.es. Et caldrà el volant d'empadronament: aquest sí que te'l fem nosaltres."}, es:{n:"Renovar el DNI o pasaporte", d:"Esto es de la Policía Nacional, no del ayuntamiento. Pide cita en citapreviadnie.es. Necesitarás el volante de empadronamiento: ese sí te lo hacemos nosotros."} },
    { syn:["targeta sanitaria","tarjeta sanitaria","metge","medico","cap","catsalut"], ca:{n:"Targeta sanitària o metge de capçalera", d:"Això ho porta CatSalut: tramita-ho al teu CAP o a La Meva Salut. Si et demanen el padró, el volant te'l fem nosaltres."}, es:{n:"Tarjeta sanitaria o médico de cabecera", d:"Esto lo lleva CatSalut: tramítalo en tu CAP o en La Meva Salut. Si te piden el padrón, el volante te lo hacemos nosotros."} },
    { syn:["atur","paro","sepe","subsidi","subsidio"], ca:{n:"Atur i subsidis", d:"Això és del SEPE (estatal) i del SOC (Generalitat). L'ajuntament t'hi pot orientar des de Promoció Econòmica."}, es:{n:"Paro y subsidios", d:"Esto es del SEPE (estatal) y del SOC (Generalitat). El ayuntamiento puede orientarte desde Promoción Económica."} },
    { syn:["nie","estrangeria","extranjeria","arrelament","arraigo"], ca:{n:"NIE i tràmits d'estrangeria", d:"Això és de l'Oficina d'Estrangeria. Per a l'informe d'arrelament social, però, sí que comences a l'ajuntament: demana cita amb serveis socials."}, es:{n:"NIE y trámites de extranjería", d:"Esto es de la Oficina de Extranjería. Para el informe de arraigo social, en cambio, sí empiezas en el ayuntamiento: pide cita con servicios sociales."} }
  ];

  /* ===================== CATÀLEG EXTERN (v0.2) =====================
     Un municipi pot: (a) substituir tot el catàleg (tramits:[...]),
     (b) partir del builtin i personalitzar: base:"builtin" + override:[{id,url,...}] + extra:[...].
     URLs amb plantilla: {seu} {cita} {incidencies} es resolen amb cat.urls.            */
  var ACTIVE = { municipi: null, urls: {}, tramits: CATALEG };

  function resolveUrl(url, urls) {
    if (!url) return "#";
    return url.replace(/\{(\w+)\}/g, function (m, k) { return (urls && urls[k]) || m; });
  }

  function setCataleg(cat) {
    if (!cat) return ACTIVE;
    var urls = cat.urls || {};
    var tramits;
    if (cat.tramits && cat.tramits.length) {
      tramits = cat.tramits.slice();
    } else {
      tramits = CATALEG.map(function (t) { return t; });
      if (cat.override && cat.override.length) {
        var byId = {};
        for (var i = 0; i < cat.override.length; i++) byId[cat.override[i].id] = cat.override[i];
        tramits = tramits.map(function (t) {
          var o = byId[t.id];
          if (!o) return t;
          var merged = {};
          for (var k in t) merged[k] = t[k];
          for (var k2 in o) if (k2 !== "id") merged[k2] = o[k2];
          merged.id = t.id;
          return merged;
        });
      }
      if (cat.extra && cat.extra.length) tramits = tramits.concat(cat.extra);
    }
    ACTIVE = { municipi: cat.municipi || null, urls: urls, tramits: tramits };
    return ACTIVE;
  }

  /* ============================ I18N ============================ */
  var T = {
    ca: { btn:"Què necessites?", title:"Clar", subtitle:"El teu ajuntament, en clar", placeholder:"Escriu-ho amb les teves paraules…", hint:"Per exemple: «em mudo», «farola espatllada», «vull pagar l'IBI»", chips:["Em mudo","He tingut un fill","Una farola espatllada","Pagar l'IBI","Demanar cita"], official:"oficialment:", needs:"Què et caldrà", go:"Fes-ho ara", cite:"Demana cita", also:"També et pot servir", none:"No trobo cap tràmit amb això… però no et deixem penjat:", noneCta:"Truca al 010 o presenta una instància genèrica", foraTag:"No és de l'ajuntament, però t'ho expliquem", channels:{online:"Online",cita:"Amb cita",presencial:"Presencial"}, close:"Tancar", clear:"Esborrar", poweredBy:"per" },
    es: { btn:"¿Qué necesitas?", title:"Clar", subtitle:"Tu ayuntamiento, en claro", placeholder:"Escríbelo con tus palabras…", hint:"Por ejemplo: «me mudo», «farola rota», «quiero pagar el IBI»", chips:["Me mudo","He tenido un hijo","Una farola rota","Pagar el IBI","Pedir cita"], official:"oficialmente:", needs:"Qué necesitarás", go:"Hazlo ahora", cite:"Pide cita", also:"También te puede servir", none:"No encuentro ningún trámite con eso… pero no te dejamos colgado:", noneCta:"Llama al 010 o presenta una instancia genérica", foraTag:"No es del ayuntamiento, pero te lo explicamos", channels:{online:"Online",cita:"Con cita",presencial:"Presencial"}, close:"Cerrar", clear:"Borrar", poweredBy:"por" }
  };

  /* ============================ MOTOR ============================ */
  var STOP = ["el","la","els","les","un","una","uns","unes","de","del","dels","d","l","i","o","a","al","als","en","per","que","com","amb","es","se","em","me","et","te","ho","lo","mi","mis","mes","meu","meva","vull","quiero","necessito","necesito","voldria","querria","fer","hacer","puc","puedo","com","como","on","donde","tinc","tengo","he","ha","hay","hi","una","y","u","si","no","mas","més","molt","muy","para","pel","pels"];

  function norm(s) {
    return (s || "").toLowerCase()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9çñ\s]/g, " ")
      .replace(/\s+/g, " ").trim();
  }
  function tokens(s) {
    return norm(s).split(" ").filter(function (t) { return t.length > 1 && STOP.indexOf(t) === -1; });
  }

  function scoreItem(item, qNorm, qToks, lang) {
    var s = 0, i, j;
    // situacions vitals: el match més fort
    for (i = 0; i < (item.vit || []).length; i++) {
      var v = norm(item.vit[i]);
      if (!v) continue;
      if (qNorm.indexOf(v) !== -1 || (qNorm.length > 3 && v.indexOf(qNorm) !== -1)) { s += 60; break; }
      var vToks = tokens(v), hits = 0;
      for (j = 0; j < vToks.length; j++) if (qToks.indexOf(vToks[j]) !== -1) hits++;
      if (vToks.length && hits >= Math.max(1, vToks.length - 1) && hits >= 2) s += 35;
    }
    // sinònims
    for (i = 0; i < (item.syn || []).length; i++) {
      var syn = norm(item.syn[i]);
      if (syn.indexOf(" ") !== -1) { if (qNorm.indexOf(syn) !== -1) s += 22; continue; }
      for (j = 0; j < qToks.length; j++) {
        var t = qToks[j];
        if (t === syn) { s += 16; }
        else if (t.length >= 4 && syn.length >= 4 && (syn.indexOf(t) === 0 || t.indexOf(syn) === 0)) { s += 7; }
      }
    }
    // nom planer i oficial
    var L = item[lang] || item.ca;
    var nToks = tokens(L.n), oToks = tokens(L.o || "");
    for (j = 0; j < qToks.length; j++) {
      if (nToks.indexOf(qToks[j]) !== -1) s += 9;
      if (oToks.indexOf(qToks[j]) !== -1) s += 4;
    }
    return s;
  }

  function search(query, lang) {
    var qNorm = norm(query), qToks = tokens(query);
    if (!qNorm || qNorm.length < 2) return { results: [], fora: null };
    var scored = [], LIST = ACTIVE.tramits;
    for (var i = 0; i < LIST.length; i++) {
      var s = scoreItem(LIST[i], qNorm, qToks, lang);
      if (s >= 14) scored.push({ item: LIST[i], score: s });
    }
    scored.sort(function (a, b) { return b.score - a.score; });
    // fora d'àmbit
    var fora = null;
    for (var f = 0; f < FORA.length; f++) {
      for (var k = 0; k < FORA[f].syn.length; k++) {
        var fs = norm(FORA[f].syn[k]);
        if (qNorm.indexOf(fs) !== -1) { fora = FORA[f]; break; }
      }
      if (fora) break;
    }
    return { results: scored.slice(0, 5), fora: fora };
  }

  /* ========================= ANALYTICS (v0.2) =========================
     - Esdeveniments en memòria + persistència localStorage (clar_analytics_v1, màx 500).
     - Si el script porta data-analytics-endpoint, s'envien en lots via sendBeacon/fetch.
     - Sempre s'emet l'event DOM "clar:event" per a panells locals (demo).            */
  var LS_KEY = "clar_analytics_v1";
  var ENDPOINT = null, TOKEN = null;
  var analytics = { searches: [], clicks: [], pending: [] };

  function loadStored() {
    try {
      var raw = (typeof localStorage !== "undefined") && localStorage.getItem(LS_KEY);
      if (!raw) return;
      var arr = JSON.parse(raw);
      for (var i = 0; i < arr.length; i++) analytics[arr[i].t === "search" ? "searches" : "clicks"].push(arr[i]);
    } catch (e) {}
  }
  function persist() {
    try {
      if (typeof localStorage === "undefined") return;
      var all = analytics.searches.concat(analytics.clicks);
      all.sort(function (a, b) { return a.ts - b.ts; });
      localStorage.setItem(LS_KEY, JSON.stringify(all.slice(-500)));
    } catch (e) {}
  }
  function flush() {
    if (!ENDPOINT || !analytics.pending.length) return;
    var batch = JSON.stringify({ municipi: ACTIVE.municipi, token: TOKEN, events: analytics.pending.splice(0) });
    try {
      if (typeof navigator !== "undefined" && navigator.sendBeacon) navigator.sendBeacon(ENDPOINT, batch);
      else if (typeof fetch !== "undefined") fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: batch, keepalive: true });
    } catch (e) {}
  }
  var flushTimer = null;
  function track(type, data, meta) {
    var ev = { t: type, q: data, ts: Date.now() };
    if (meta) { if (meta.r != null) ev.r = meta.r; if (meta.cita != null) ev.cita = meta.cita; }
    analytics[type === "search" ? "searches" : "clicks"].push(ev);
    analytics.pending.push(ev);
    persist();
    if (ENDPOINT) { clearTimeout(flushTimer); flushTimer = setTimeout(flush, 3000); }
    try { document.dispatchEvent(new CustomEvent("clar:event", { detail: ev })); } catch (e) {}
  }

  /* ============================ UI ============================ */
  var MUNICIPI = "el teu municipi", lang = "ca", DEMO = false;
  if (typeof document !== "undefined") {
    var scriptTag = document.currentScript || (function () { var ss = document.getElementsByTagName("script"); return ss[ss.length - 1]; })();
    MUNICIPI = (scriptTag && scriptTag.getAttribute("data-municipi")) || MUNICIPI;
    lang = (scriptTag && scriptTag.getAttribute("data-lang")) === "es" ? "es" : "ca";
    DEMO = (scriptTag && scriptTag.getAttribute("data-demo")) === "true";
    ENDPOINT = (scriptTag && scriptTag.getAttribute("data-analytics-endpoint")) || null;
    TOKEN = (scriptTag && scriptTag.getAttribute("data-analytics-token")) || null;
    // Catàleg extern: window.ClarCataleg (script previ) o data-cataleg (fetch JSON, requereix servidor)
    if (typeof window !== "undefined" && window.ClarCataleg) {
      setCataleg(window.ClarCataleg);
      if (ACTIVE.municipi) MUNICIPI = ACTIVE.municipi;
    } else {
      var catUrl = scriptTag && scriptTag.getAttribute("data-cataleg");
      if (catUrl && typeof fetch !== "undefined") {
        fetch(catUrl).then(function (r) { return r.json(); }).then(function (j) {
          setCataleg(j);
          if (ACTIVE.municipi) MUNICIPI = ACTIVE.municipi;
        }).catch(function () { /* es manté el builtin */ });
      }
    }
    loadStored();
  }

  var css = [
    ".clar-fab{position:fixed;right:18px;bottom:18px;z-index:99990;display:flex;align-items:center;gap:9px;background:#0f5c3a;color:#fff;border:none;border-radius:999px;padding:13px 20px;font:700 15px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 24px rgba(15,92,58,.35);transition:transform .15s}",
    ".clar-fab:hover{transform:scale(1.04)}",
    ".clar-fab .clar-spark{width:20px;height:20px;border-radius:50%;background:#fff;color:#0f5c3a;display:inline-flex;align-items:center;justify-content:center;font-weight:900;font-size:13px}",
    ".clar-panel{position:fixed;right:18px;bottom:84px;z-index:99991;width:392px;max-width:calc(100vw - 24px);max-height:min(640px,calc(100vh - 110px));background:#fff;border-radius:18px;box-shadow:0 18px 60px rgba(10,30,20,.3);display:none;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;border:1px solid #dde5df}",
    ".clar-panel.open{display:flex}",
    ".clar-head{background:linear-gradient(135deg,#0f5c3a,#1e8a5a);color:#fff;padding:16px 18px 14px}",
    ".clar-head-top{display:flex;align-items:center;gap:8px}",
    ".clar-head h2{margin:0;font-size:19px;font-weight:800;letter-spacing:-.01em}",
    ".clar-head .clar-sub{margin:1px 0 0;font-size:12px;opacity:.85}",
    ".clar-langs{margin-left:auto;display:flex;gap:4px}",
    ".clar-langs button{background:rgba(255,255,255,.15);border:none;color:#fff;font:700 11px/1 system-ui;border-radius:6px;padding:5px 8px;cursor:pointer}",
    ".clar-langs button.on{background:#fff;color:#0f5c3a}",
    ".clar-x{background:none;border:none;color:#fff;font-size:18px;cursor:pointer;padding:4px 6px;margin-left:2px;opacity:.85}",
    ".clar-searchbox{position:relative;margin-top:12px}",
    ".clar-searchbox input{width:100%;border:none;border-radius:11px;padding:13px 38px 13px 14px;font:15px system-ui;outline:3px solid transparent;box-sizing:border-box;color:#1b2620 !important;-webkit-text-fill-color:#1b2620;background:#fff !important;caret-color:#1b2620}",
    ".clar-searchbox input::placeholder{color:#8a958d !important;-webkit-text-fill-color:#8a958d;opacity:1}",
    ".clar-searchbox input:focus{outline-color:rgba(255,255,255,.45)}",
    ".clar-clear{position:absolute;right:8px;top:50%;transform:translateY(-50%);background:#eef0ef;border:none;border-radius:50%;width:24px;height:24px;font-size:12px;cursor:pointer;color:#555;display:none}",
    ".clar-hint{font-size:11.5px;opacity:.8;margin:8px 2px 0}",
    ".clar-body{padding:13px 15px;overflow-y:auto;flex:1;background:#f6f8f7}",
    ".clar-chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:6px}",
    ".clar-chips button{background:#fff;border:1px solid #d7e0da;border-radius:999px;padding:7px 13px;font:600 12.5px system-ui;color:#17241c;cursor:pointer}",
    ".clar-chips button:hover{border-color:#1e8a5a;color:#0f5c3a}",
    ".clar-card{background:#fff;border:1px solid #e0e6e1;border-radius:13px;padding:13px 15px;margin-bottom:10px}",
    ".clar-card h3{margin:0 0 2px;font-size:14.5px;font-weight:800;color:#17241c;line-height:1.3}",
    ".clar-official{font-size:11px;color:#8a958d;margin:0 0 6px;font-style:italic}",
    ".clar-desc{font-size:12.5px;color:#39463f;margin:0 0 8px;line-height:1.45}",
    ".clar-needs{font-size:12px;background:#f0f6f2;border-radius:8px;padding:7px 10px;color:#2c5240;margin:0 0 9px}",
    ".clar-needs b{display:block;font-size:10px;text-transform:uppercase;letter-spacing:.06em;color:#1e8a5a;margin-bottom:2px}",
    ".clar-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap}",
    ".clar-ch{font-size:10.5px;font-weight:700;border-radius:6px;padding:2px 8px;background:#eef0ef;color:#555}",
    ".clar-ch.online{background:#e7f4ee;color:#1e8a5a}",
    ".clar-cta{margin-left:auto;background:#0f5c3a;color:#fff;border:none;border-radius:9px;padding:8px 14px;font:700 12.5px system-ui;cursor:pointer}",
    ".clar-cta:hover{background:#1e8a5a}",
    ".clar-fora{background:#fdf6e8;border:1px solid #ecd9ae;border-radius:13px;padding:12px 15px;margin-bottom:10px}",
    ".clar-fora .clar-tag{font-size:10px;font-weight:800;color:#9a6b07;text-transform:uppercase;letter-spacing:.05em}",
    ".clar-fora h3{margin:3px 0 4px;font-size:14px;font-weight:800}",
    ".clar-fora p{margin:0;font-size:12.5px;color:#5c4a1e;line-height:1.45}",
    ".clar-none{background:#fff;border:1px dashed #cfd8d1;border-radius:13px;padding:14px 15px;font-size:13px;color:#39463f}",
    ".clar-none a{color:#0f5c3a;font-weight:700}",
    ".clar-foot{padding:8px 15px;background:#fff;border-top:1px solid #eceeec;font-size:10.5px;color:#9aa49d;text-align:center}",
    ".clar-foot b{color:#0f5c3a}",
    "@media(max-width:480px){.clar-panel{right:8px;left:8px;width:auto;bottom:76px}.clar-fab{right:12px;bottom:12px}}"
  ].join("\n");

  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function buildUI() {
    var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

    var fab = el("button", "clar-fab"); fab.setAttribute("aria-haspopup", "dialog");
    var panel = el("div", "clar-panel"); panel.setAttribute("role", "dialog"); panel.setAttribute("aria-modal", "false"); panel.setAttribute("aria-label", "Clar");

    var head = el("div", "clar-head");
    var headTop = el("div", "clar-head-top");
    var titleWrap = el("div", null);
    var h2 = el("h2", null); var sub = el("p", "clar-sub");
    titleWrap.appendChild(h2); titleWrap.appendChild(sub);
    var langs = el("div", "clar-langs");
    var bCa = el("button", null, "CA"), bEs = el("button", null, "ES");
    langs.appendChild(bCa); langs.appendChild(bEs);
    var xBtn = el("button", "clar-x", "✕");
    headTop.appendChild(titleWrap); headTop.appendChild(langs); headTop.appendChild(xBtn);
    var sBox = el("div", "clar-searchbox");
    var input = document.createElement("input"); input.type = "search"; input.setAttribute("autocomplete", "off");
    var clearB = el("button", "clar-clear", "✕");
    sBox.appendChild(input); sBox.appendChild(clearB);
    var hint = el("p", "clar-hint");
    head.appendChild(headTop); head.appendChild(sBox); head.appendChild(hint);

    var body = el("div", "clar-body");
    var foot = el("div", "clar-foot");

    panel.appendChild(head); panel.appendChild(body); panel.appendChild(foot);
    document.body.appendChild(fab); document.body.appendChild(panel);

    var open = false;
    function setOpen(v) { open = v; panel.classList.toggle("open", v); fab.setAttribute("aria-expanded", String(v)); if (v) { input.focus(); render(""); } }
    fab.addEventListener("click", function () { setOpen(!open); });
    xBtn.addEventListener("click", function () { setOpen(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && open) setOpen(false); });

    function applyLang() {
      var t = T[lang];
      fab.innerHTML = '<span class="clar-spark">✓</span> ' + t.btn;
      h2.textContent = t.title; sub.textContent = t.subtitle + " · " + MUNICIPI;
      input.placeholder = t.placeholder; hint.textContent = t.hint;
      xBtn.setAttribute("aria-label", t.close); clearB.setAttribute("aria-label", t.clear);
      bCa.className = lang === "ca" ? "on" : ""; bEs.className = lang === "es" ? "on" : "";
      foot.innerHTML = "Clar <b>·</b> " + t.poweredBy + " <b>Appjuntament</b> — prototip DEV-02";
      render(input.value);
    }
    bCa.addEventListener("click", function () { lang = "ca"; applyLang(); });
    bEs.addEventListener("click", function () { lang = "es"; applyLang(); });

    var debounce;
    input.addEventListener("input", function () {
      clearB.style.display = input.value ? "block" : "none";
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        render(input.value);
        if (tokens(input.value).length) {
          var out = search(input.value, lang);
          var top = out.results[0];
          track("search", input.value, { r: out.results.length, cita: !!(top && top.item.ch && top.item.ch.indexOf("cita") !== -1) });
        }
      }, 250);
    });
    clearB.addEventListener("click", function () { input.value = ""; clearB.style.display = "none"; render(""); input.focus(); });

    function chipRow() {
      var t = T[lang], row = el("div", "clar-chips");
      t.chips.forEach(function (c) {
        var b = el("button", null, esc(c));
        b.addEventListener("click", function () {
          input.value = c; clearB.style.display = "block"; render(c);
          var out = search(c, lang), top = out.results[0];
          track("search", c + " [chip]", { r: out.results.length, cita: !!(top && top.item.ch && top.item.ch.indexOf("cita") !== -1) });
        });
        row.appendChild(b);
      });
      return row;
    }

    function card(item) {
      var t = T[lang], L = item[lang] || item.ca;
      var c = el("div", "clar-card");
      var chs = (item.ch || []).map(function (ch) { return '<span class="clar-ch ' + ch + '">' + esc(t.channels[ch] || ch) + "</span>"; }).join("");
      var cta = item.ch && item.ch[0] === "cita" ? t.cite : t.go;
      c.innerHTML =
        "<h3>" + esc(L.n) + "</h3>" +
        '<p class="clar-official">' + t.official + " " + esc(L.o) + "</p>" +
        '<p class="clar-desc">' + esc(L.d) + "</p>" +
        '<div class="clar-needs"><b>' + t.needs + "</b>" + esc(L.r) + "</div>" +
        '<div class="clar-meta">' + chs + '<button class="clar-cta">' + esc(cta) + "</button></div>";
      c.querySelector(".clar-cta").addEventListener("click", function () {
        track("click", item.id);
        var real = resolveUrl(item.url, ACTIVE.urls);
        if (real && real !== "#" && real.indexOf("{") === -1) {
          if (DEMO) alert("[Demo] Aquí s'obriria:\n" + real);
          else window.open(real, "_blank", "noopener");
        } else {
          alert("[Prototip] Tràmit sense URL configurada: " + L.n);
        }
      });
      return c;
    }

    function render(q) {
      var t = T[lang];
      body.innerHTML = "";
      if (!q || !norm(q)) { body.appendChild(chipRow()); return; }
      var out = search(q, lang);
      if (out.fora) {
        var f = el("div", "clar-fora");
        var FL = out.fora[lang] || out.fora.ca;
        f.innerHTML = '<span class="clar-tag">' + t.foraTag + "</span><h3>" + esc(FL.n) + "</h3><p>" + esc(FL.d) + "</p>";
        body.appendChild(f);
      }
      if (out.results.length) {
        out.results.forEach(function (r, i) {
          if (i === 1) { var also = el("p", null); also.style.cssText = "font-size:11px;color:#8a958d;margin:2px 2px 6px;font-weight:700;text-transform:uppercase;letter-spacing:.05em"; also.textContent = t.also; body.appendChild(also); }
          body.appendChild(card(r.item));
        });
      } else if (!out.fora) {
        var none = el("div", "clar-none", esc(t.none) + '<br><a href="#">' + esc(t.noneCta) + "</a>");
        body.appendChild(none);
      }
    }

    applyLang();
  }

  /* ============================ EXPORT / INIT ============================ */
  var api = { search: search, norm: norm, tokens: tokens, cataleg: CATALEG, fora: FORA, analytics: analytics,
    setCataleg: setCataleg, resolveUrl: resolveUrl, getActive: function () { return ACTIVE; }, version: "0.3.0-dev03" };
  if (typeof window !== "undefined") {
    window.Clar = api;
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildUI);
    else buildUI();
  }
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
/* fi Clar v0.2.0 · Appjuntament */
