(() => {
  'use strict';

  // Lot conservator: numai itemi cu raspuns factual neechivoc, verificat independent.
  // Arhiva oficiala SNPAP confirma existenta grilei de raspuns la Istorie 2012.
  // Transcrierea publica este folosita numai pentru recuperarea enuntului si variantelor,
  // nu ca autoritate pentru cheia de raspuns. Modulul ramane in staging pana la
  // confruntarea directa cu documentul oficial final.
  const source = number => `SNPAP Târgu Ocna – Admitere 2012, Istoria românilor, întrebarea ${number}; arhiva oficială confirmă publicarea grilei de răspuns, iar enunțul și variantele au fost confruntate cu transcrierea publică a testului 2012.`;

  window.registerQuestionBatch([
    [
      '2012-ist-002',
      'istorie',
      'stat-modern',
      'Convenția de la Balta Liman, care a reintrodus în Țările Române regimul politic regulamentar, a fost semnată între statele:',
      ['Franța și Anglia', 'Prusia și Sardinia', 'Rusia și Turcia', 'Rusia și Franța'],
      2,
      source(2),
      'Convenția de la Balta Liman din 1849 a fost încheiată între Imperiul Rus și Imperiul Otoman.'
    ],
    [
      '2012-ist-005',
      'istorie',
      'autonomii-institutii',
      'Descălecatul lui Bogdan are loc în anul:',
      ['1354', '1277', '1359', '1279'],
      2,
      source(5),
      'Bogdan I a trecut din Maramureș în Moldova și a înlăturat dominația maghiară în jurul anului 1359.'
    ],
    [
      '2012-ist-006',
      'istorie',
      'autonomii-institutii',
      'Thema Paristrion a fost întemeiată de către:',
      ['slavi', 'bizantini', 'tătari', 'maghiari'],
      1,
      source(6),
      'Paristrion/Paradunavon a fost o themă bizantină organizată la Dunărea de Jos în secolul al X-lea.'
    ],
    [
      '2012-ist-009',
      'istorie',
      'concert-european',
      'Convențiile politice și militare care stabileau condițiile intrării României în Primul Război Mondial au fost semnate la data de:',
      ['27 septembrie 1914', '15 august 1916', '17 iulie 1917', '4 august 1916'],
      3,
      source(9),
      'Convențiile cu Antanta au fost semnate la București la 4/17 august 1916; în cronologia românească a epocii data este 4 august 1916.'
    ],
    [
      '2012-ist-010',
      'istorie',
      'stat-modern',
      'Regimul fanariot a fost instaurat în Moldova în anul:',
      ['1716', '1821', '1711', '1774'],
      2,
      source(10),
      'Regimul fanariot a fost instaurat în Moldova în 1711, după înlăturarea lui Dimitrie Cantemir.'
    ],
    [
      '2012-ist-013',
      'istorie',
      'concert-european',
      'Pactul de neagresiune din 23 august 1939 a fost încheiat între:',
      ['România și Germania', 'Germania și U.R.S.S.', 'Germania și Franța', 'Franța și Italia'],
      1,
      source(13),
      'Pactul Ribbentrop–Molotov din 23 august 1939 a fost încheiat între Germania nazistă și U.R.S.S.'
    ],
    [
      '2012-ist-017',
      'istorie',
      'concert-european',
      'Primul Război Balcanic a avut loc între statele:',
      ['Bulgaria, Serbia, Grecia și Muntenegru împotriva Turciei', 'Bulgaria, Macedonia, Serbia și Grecia împotriva Turciei', 'România, Macedonia, Serbia și Turcia împotriva Bulgariei', 'Bulgaria, Serbia, Grecia și Macedonia împotriva României'],
      0,
      source(17),
      'În Primul Război Balcanic, Liga Balcanică — Bulgaria, Serbia, Grecia și Muntenegru — a luptat împotriva Imperiului Otoman.'
    ],
    [
      '2012-ist-018',
      'istorie',
      'stat-modern',
      'Bazele Partidului Național Liberal au fost puse la data de:',
      ['3 februarie 1880', '24 mai 1875', '15 august 1863', '1 decembrie 1864'],
      1,
      source(18),
      'Partidul Național Liberal a fost constituit la 24 mai 1875.'
    ],
    [
      '2012-ist-025',
      'istorie',
      'stat-modern',
      'Monstruoasa coaliție s-a coagulat în jurul ideii de:',
      ['adoptare a unei Constituții', 'înlocuirea lui Cuza cu un prinț străin', 'introducerea votului universal', 'modificarea articolului 7 din Constituție'],
      1,
      source(25),
      'Alianța dintre conservatori și liberalii radicali urmărea înlăturarea lui Alexandru Ioan Cuza și aducerea unui principe străin.'
    ],
    [
      '2012-ist-029',
      'istorie',
      'stat-modern',
      'În 1821, s-a declanșat:',
      ['Războiul de Independență', 'Revoluția pașoptistă', 'Primul Război Balcanic', 'mișcarea condusă de Tudor Vladimirescu'],
      3,
      source(29),
      'În 1821 a avut loc mișcarea revoluționară condusă în Țara Românească de Tudor Vladimirescu.'
    ],
    [
      '2012-ist-030',
      'istorie',
      'autonomii-institutii',
      'Prima reședință a Țării Românești a fost:',
      ['Târgoviște', 'Câmpulung', 'Curtea de Argeș', 'Drobeta'],
      1,
      source(30),
      'Câmpulung este considerată prima reședință domnească a Țării Românești.'
    ],
    [
      '2012-ist-033',
      'istorie',
      'autonomii-institutii',
      'Conform documentelor din secolul al XIII-lea, țăranii erau numiți:',
      ['majores terrae', 'rumâni', 'rustici', 'moșneni'],
      2,
      source(33),
      'În izvoarele medievale latine, termenul „rustici” desemna țăranii.'
    ],
    [
      '2012-ist-034',
      'istorie',
      'autonomii-institutii',
      'Ana Comnena îi pomenește într-o scriere pe:',
      ['Jupan Gheorghe, Petru, Asan', 'Tatos, Ioniță Calotan, Satza', 'Tatos, Seslav, Satza', 'Gelu, Glad, Jupan Gheorghe'],
      2,
      source(34),
      'În Alexiada, Ana Comnena menționează conducători locali de la Dunărea de Jos precum Tatos, Seslav și Satza.'
    ],
    [
      '2012-ist-037',
      'istorie',
      'constitutii',
      'Potrivit Constituției din 1866, din punct de vedere administrativ, principalele unități în care era împărțit teritoriul țării erau:',
      ['județele, plășile și comunele', 'satele, comunele și orașele', 'ținuturile, plășile și districtele', 'județele, scaunele și comitatele'],
      0,
      source(37),
      'Constituția din 1866 prevedea împărțirea teritoriului în județe, plăși și comune.'
    ],
    [
      '2012-ist-038',
      'istorie',
      'constitutii',
      'În anul 1864 a fost emis:',
      ['Tratatul de la Paris', 'Convenția de la Paris', 'Statutul Dezvoltător al Convenției de la Paris', 'Regulamentul Organic'],
      2,
      source(38),
      'Statutul Dezvoltător al Convenției de la Paris a fost adoptat în 1864, după plebiscitul organizat de Alexandru Ioan Cuza.'
    ],
    [
      '2012-ist-040',
      'istorie',
      'autonomii-institutii',
      'În centrul și răsăritul Europei, ultimele invazii ale populațiilor migratoare s-au prelungit până în secolul:',
      ['al XIII-lea', 'al XII-lea', 'al XIV-lea', 'al XI-lea'],
      0,
      source(40),
      'Invaziile mongole/tătare din secolul al XIII-lea marchează ultima mare etapă a migrațiilor care au afectat regiunea.'
    ],
    [
      '2012-ist-041',
      'istorie',
      'romania-postbelica',
      'Prin Legea nr. 363 din 30 decembrie 1947 s-a realizat:',
      ['abolirea monarhiei și proclamarea Republicii Populare Române', 'colectivizarea agriculturii și naționalizarea instituțiilor bancare', 'înființarea Direcției Generale a Securității Statului și a Miliției', 'dizolvarea Partidului Național Țărănesc și condamnarea lui Iuliu Maniu la închisoare pe viață'],
      0,
      source(41),
      'Legea nr. 363/1947 a proclamat Republica Populară Română după abdicarea forțată a regelui Mihai I.'
    ],
    [
      '2012-ist-043',
      'istorie',
      'romania-postbelica',
      'Intrarea trupelor sovietice în București a avut loc la data de:',
      ['23 august 1944', '30 august 1944', '6 martie 1945', '19 noiembrie 1946'],
      1,
      source(43),
      'Primele trupe sovietice au intrat în București la 30 august 1944.'
    ],
    [
      '2012-ist-046',
      'istorie',
      'romania-postbelica',
      'Gospodăriile agricole de stat și cooperativele agricole de producție au copiat:',
      ['colhozurile', 'trusturile agricole', 'corporațiile', 'consorțiile economice'],
      0,
      source(46),
      'Modelul colectivizării agriculturii comuniste a fost preluat din sistemul sovietic al colhozurilor.'
    ],
    [
      '2012-ist-049',
      'istorie',
      'constitutii',
      'Un prim proiect de constituție a fost:',
      ['Convenția de la Paris', 'Constituția Cărvunarilor', 'Regulamentul Organic', 'Statutul Dezvoltător al Convenției de la Paris'],
      1,
      source(49),
      'Constituția Cărvunarilor din 1822 este unul dintre primele proiecte constituționale românești.'
    ],
    [
      '2012-ist-050',
      'istorie',
      'diplomatie-conflict',
      'Vlad Țepeș a refuzat plata tributului în anul:',
      ['1459', '1457', '1456', '1472'],
      0,
      source(50),
      'În cronologia consacrată în manualele de istorie, Vlad Țepeș a refuzat plata tributului către Poartă în 1459.'
    ],
    [
      '2012-ist-053',
      'istorie',
      'constitutii',
      'Constituția promulgată la 28 martie 1923 a avut la bază:',
      ['Convenția de la Paris', 'Constituția din 1866', 'Constituția belgiană', 'Constituția Cărvunarilor'],
      1,
      source(53),
      'Constituția din 1923 a păstrat în mare măsură structura și principiile Constituției din 1866, adaptate noii realități de după Marea Unire.'
    ],
    [
      '2012-ist-057',
      'istorie',
      'autonomii-institutii',
      'Diploma cavalerilor ioaniți menționa existența următoarelor formațiuni politice prestatale românești:',
      ['Banatul de Severin, voievodatul lui Seneslau, voievodatul lui Menumorut și voievodatul lui Litovoi', 'voievodatul lui Litovoi, voievodatul lui Glad, cnezatul lui Farcaș și cnezatul lui Ioan', 'Banatul de Severin, voievodatul lui Litovoi, voievodatul lui Gelu și cnezatul lui Farcaș', 'Banatul de Severin, voievodatul lui Litovoi, cnezatele lui Ioan și Farcaș, voievodatul lui Seneslau'],
      3,
      source(57),
      'Diploma Ioaniților din 1247 menționează Banatul de Severin, cnezatele lui Ioan și Farcaș și voievodatele lui Litovoi și Seneslau.'
    ],
    [
      '2012-ist-058',
      'istorie',
      'romania-postbelica',
      'Guvernul instaurat la 6 martie 1945 a fost unul de tip:',
      ['procomunist', 'proamerican', 'democratic', 'promonarhic'],
      0,
      source(58),
      'Guvernul Petru Groza instalat la 6 martie 1945 a fost dominat de forțele procomuniste susținute de Uniunea Sovietică.'
    ]
  ]);
})();