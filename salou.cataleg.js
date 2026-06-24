/* Catàleg Clar · Ajuntament de Salou — versió DEMO (2026-06-24)
   Patró: base "builtin" (39 tràmits estàndard) + override d'URLs reals + tràmits propis.
   URLs preses de la web real de Salou (www.salou.cat, Plone/ecityclic) i la seu SIAC
   (seu.salou.cat/siac). Per a la demo apunten a les SECCIONS reals de tràmits; els enllaços
   profunds exactes de cada procediment (seu SIAC ?idProc=...) es poden afinar abans de produir.
   No conté dades personals. */
(function (root) {
  var SEU   = "https://seu.salou.cat/siac/default.aspx";
  var CITA  = "https://www.salou.cat/ca/cita-previa";
  var INCID = "https://www.salou.cat/ca/tramits-municipals/ciutat-i-carrers";
  var T_PADRO   = "https://www.salou.cat/ca/tramits-municipals/familia-habitatge-i-padro";
  var T_TRIBUTS = "https://www.salou.cat/ca/tramits-municipals/impostos-i-tributs";
  var T_PAGA    = "https://www.salou.cat/ca/ajuntament/atencio-a-la-ciutadania/pagament-on-line-de-tributs-municipals";
  var T_LLIC    = "https://www.salou.cat/ca/tramits-municipals/llicencies-i-permisos";
  var T_EMPR    = "https://www.salou.cat/ca/tramits-municipals/empreses-i-consum";
  var T_EDU     = "https://www.salou.cat/ca/tramits-municipals/educacio";
  var T_ESPORT  = "https://www.salou.cat/ca/tramits-municipals/esport-lleure-i-joventut";
  var T_SOCIAL  = "https://www.salou.cat/ca/tramits-municipals/benestar-social-i-dona";
  var NETEJA    = "https://www.salou.cat/ca/la-ciutat-per-temes/neteja-i-manteniment-urba";
  var QUEIXA    = "https://www.salou.cat/ca/ajuntament/atencio-a-la-ciutadania/servei-de-queixes-suggeriments-i-propostes";
  var FUNER     = "https://www.salou.cat/ca/la-ciutat-per-temes/serveis-funeraris";
  var BIBLIO    = "https://www.salou.cat/ca/la-ciutat-per-temes/biblioteca";
  var CARPETA   = "https://www.salou.cat/ca/ajuntament/atencio-a-la-ciutadania/la-meva-bustia-carpeta-ciutadana";
  var HUT       = "https://www.salou.cat/ca/tramits-municipals/serveis-per-a-activitats-empresarials-i-habitatges-dus-turistic";
  var RODATGE   = "https://www.salou.cat/ca/ajuntament/comunicacio/permis-denregistrament-a-salou";

  var cataleg = {
    municipi: "Salou",
    base: "builtin",
    urls: { seu: SEU, cita: CITA, incidencies: INCID },
    override: [
      { id: "padro-alta",    url: T_PADRO },
      { id: "padro-volant",  url: T_PADRO },
      { id: "padro-cert",    url: T_PADRO },
      { id: "convivencia",   url: T_PADRO },
      { id: "naixement",     url: T_PADRO },
      { id: "ibi-pagar",     url: T_PAGA },
      { id: "domiciliar",    url: T_PAGA },
      { id: "plusvalua",     url: T_TRIBUTS },
      { id: "vehicle-impost",url: T_TRIBUTS },
      { id: "bonificacions", url: T_TRIBUTS },
      { id: "multa",         url: T_TRIBUTS },
      { id: "cita-oac",      url: CITA },
      { id: "instancia",     url: SEU },
      { id: "idcat",         url: SEU },
      { id: "casament",      url: SEU },
      { id: "queixa",        url: QUEIXA },
      { id: "incidencia",    url: INCID },
      { id: "arbre",         url: INCID },
      { id: "soroll",        url: INCID },
      { id: "plaga",         url: INCID },
      { id: "deixalleria",   url: NETEJA },
      { id: "escombraries",  url: NETEJA },
      { id: "defuncio",      url: FUNER },
      { id: "escola-bressol",url: T_EDU },
      { id: "esports",       url: T_ESPORT },
      { id: "biblioteca",    url: BIBLIO },
      { id: "ajut-lloguer",  url: T_SOCIAL },
      { id: "serveis-socials",url: T_SOCIAL },
      { id: "subvencio-entitats", url: T_SOCIAL },
      { id: "obres",         url: T_LLIC },
      { id: "gual",          url: T_LLIC },
      { id: "zona-verda",    url: INCID },
      { id: "ovp-mudanca",   url: INCID },
      { id: "negoci",        url: T_EMPR },
      { id: "terrassa",      url: T_EMPR },
      { id: "mercat",        url: T_EMPR }
    ],
    extra: [
      {
        id: "hut-turistic",
        ca: { n: "Donar d'alta un habitatge d'ús turístic (HUT)", o: "Comunicació d'habitatge d'ús turístic i activitats empresarials", d: "Per llogar un pis a turistes a Salou cal comunicar-ho i tenir el número de registre.", r: "Dades del pis, cèdula d'habitabilitat i identificació del titular." },
        es: { n: "Dar de alta una vivienda de uso turístico (HUT)", o: "Comunicación de vivienda de uso turístico y actividades empresariales", d: "Para alquilar un piso a turistas en Salou hay que comunicarlo y tener el número de registro.", r: "Datos del piso, cédula de habitabilidad e identificación del titular." },
        syn: ["hut","turistic","turistico","lloguer turistic","alquiler turistico","apartament turistic","apartamento turistico","vut","pis turistic","airbnb","vivenda turistica"],
        vit: ["vull llogar el pis a turistes","quiero alquilar el piso a turistas","donar d'alta un apartament turistic","registrar un piso turistico"],
        ch: ["online","cita"],
        url: HUT
      },
      {
        id: "permis-rodatge",
        ca: { n: "Demanar permís per gravar o rodar a Salou", o: "Permís d'enregistrament a la via pública", d: "Per fer fotos o vídeos professionals, rodatges o sessions a espais públics de Salou.", r: "Dates, ubicació, equip i assegurança de responsabilitat civil." },
        es: { n: "Pedir permiso para grabar o rodar en Salou", o: "Permiso de grabación en la vía pública", d: "Para hacer fotos o vídeos profesionales, rodajes o sesiones en espacios públicos de Salou.", r: "Fechas, ubicación, equipo y seguro de responsabilidad civil." },
        syn: ["rodatge","rodaje","gravar","grabar","filmar","video","foto","sessio fotografica","sesion fotografica","permis enregistrament","filming"],
        vit: ["vull gravar un video a salou","quiero rodar en salou","fer fotos professionals al carrer","permiso para grabar en la playa"],
        ch: ["online","cita"],
        url: RODATGE
      },
      {
        id: "carpeta-ciutadana",
        ca: { n: "Consultar les meves dades i tràmits (carpeta ciutadana)", o: "La meva bústia · Carpeta ciutadana", d: "Veure els teus expedients, notificacions i dades del padró sense anar a l'OAC.", r: "Identificació digital (idCAT Mòbil, certificat o Cl@ve)." },
        es: { n: "Consultar mis datos y trámites (carpeta ciudadana)", o: "Mi buzón · Carpeta ciudadana", d: "Ver tus expedientes, notificaciones y datos del padrón sin ir a la OAC.", r: "Identificación digital (idCAT Móvil, certificado o Cl@ve)." },
        syn: ["carpeta","bustia","buzon","expedients","expedientes","notificacions","notificaciones","les meves dades","mis datos","consultar padro","consultar padron","estat tramit","estado tramite"],
        vit: ["vull consultar les meves dades","quiero consultar mis datos","com va el meu tramit","como va mi tramite","veure els meus expedients","consultar el padro online"],
        ch: ["online"],
        url: CARPETA
      }
    ]
  };
  if (root) root.ClarCataleg = cataleg;
  if (typeof module !== "undefined" && module.exports) module.exports = cataleg;
})(typeof window !== "undefined" ? window : null);
