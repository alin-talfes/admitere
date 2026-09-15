(() => {
  'use strict';

  // Lot conservator: numai itemi cu raspuns factual neechivoc, verificat independent.
  // Arhiva oficiala SNPAP confirma existenta grilei de Istorie 2016 si nu listeaza
  // o erata separata pentru aceasta disciplina. Modulul ramane in staging pana la
  // confruntarea directa a cheii finale din grila oficiala PDF.
  const source = number => `SNPAP Târgu Ocna – Admitere 2016, Istoria românilor, întrebarea ${number}; documentul oficial „GRILĂ DE RĂSPUNS LA ISTORIA ROMÂNILOR” este identificat în arhiva SNPAP, iar enunțul și variantele au fost confruntate cu transcrierea publică a testului 2016.`;

  window.registerQuestionBatch([
    [
      '2016-ist-002',
      'istorie',
      'romania-postbelica',
      'Primul plan cincinal a fost aplicat în perioada:',
      ['1947 – 1951', '1948 – 1952', '1951 – 1955', '1950 – 1954'],
      2,
      source(2),
      'Primul plan cincinal al României comuniste a acoperit perioada 1951–1955.'
    ],
    [
      '2016-ist-005',
      'istorie',
      'constitutii',
      'Un prim proiect de Constituție elaborat în 1822 a fost:',
      ['Regulamentul Organic', 'Proclamația de la Islaz', 'Constituția Cărvunarilor', 'Petiția-Proclamație'],
      2,
      source(5),
      'Constituția Cărvunarilor, redactată în 1822, este unul dintre primele proiecte constituționale românești.'
    ],
    [
      '2016-ist-006',
      'istorie',
      'concert-european',
      'Cel mai cunoscut diplomat român din perioada interbelică a fost:',
      ['Take Ionescu', 'Nicolae Titulescu', 'Ionel Brătianu', 'Gheorghe Tătărescu'],
      1,
      source(6),
      'Nicolae Titulescu a fost una dintre figurile centrale ale diplomației românești interbelice și a prezidat de două ori Adunarea Societății Națiunilor.'
    ],
    [
      '2016-ist-010',
      'istorie',
      'constitutii',
      'Unul dintre principiile Constituției de la 1866 a fost și:',
      ['Guvernare reprezentativă', 'Guvernare republicană', 'Guvernare totalitară', 'Guvernare socialistă'],
      0,
      source(10),
      'Constituția din 1866 a instituit un regim monarhic constituțional reprezentativ, nu republican, totalitar sau socialist.'
    ],
    [
      '2016-ist-014',
      'istorie',
      'constitutii',
      'La 21 noiembrie 1991 a fost adoptată:',
      ['Legea învățământului', 'Reforma agrară', 'O nouă Constituție', 'Legea secularizării averilor mănăstirești'],
      2,
      source(14),
      'Constituția României din 1991 a fost adoptată de Adunarea Constituantă la 21 noiembrie 1991 și aprobată prin referendum la 8 decembrie 1991.'
    ],
    [
      '2016-ist-018',
      'istorie',
      'stat-modern',
      'Tudor Vladimirescu a fost judecat, condamnat și executat de eteriști la sfârșitul lunii:',
      ['ianuarie 1821', 'martie 1821', 'aprilie 1821', 'mai 1821'],
      3,
      source(18),
      'Tudor Vladimirescu a fost capturat de eteriști și ucis la sfârșitul lunii mai 1821.'
    ],
    [
      '2016-ist-021',
      'istorie',
      'romania-postbelica',
      'În 1952 a fost înlăturat din structurile de conducere ale Partidului Muncitoresc Român:',
      ['Vasile Luca', 'Gheorghe Gheorghiu-Dej', 'Lucrețiu Pătrășcanu', 'Gheorghe Tătărescu'],
      0,
      source(21),
      'Vasile Luca a fost înlăturat din conducerea PMR în 1952, în cadrul epurărilor politice conduse de Gheorghe Gheorghiu-Dej.'
    ],
    [
      '2016-ist-022',
      'istorie',
      'diplomatie-conflict',
      'În august 1595, armata otomană trecea Dunărea sub conducerea lui:',
      ['Sinan Pașa', 'Murad I', 'Murad al II-lea', 'Soliman Magnificul'],
      0,
      source(22),
      'Campania otomană din 1595 împotriva lui Mihai Viteazul a fost condusă de marele vizir Sinan Pașa.'
    ],
    [
      '2016-ist-025',
      'istorie',
      'stat-modern',
      'Principatele Române erau scoase de sub protecția Rusiei și puse sub regimul garanției colective a marilor puteri prin:',
      ['Convenția de la Paris', 'Tratatul de pace de la Paris', 'Rezoluțiile Adunărilor ad-hoc', 'Tratatul de pace de la Berlin'],
      1,
      source(25),
      'Tratatul de pace de la Paris din 1856 a înlăturat protectoratul exclusiv rusesc și a plasat Principatele sub garanția colectivă a marilor puteri.'
    ],
    [
      '2016-ist-026',
      'istorie',
      'romania-postbelica',
      'Autoritățile comuniste au reintrodus cartelele pentru produsele alimentare în anul:',
      ['1970', '1977', '1981', '1985'],
      2,
      source(26),
      'Raționalizarea alimentelor prin cartele a fost reintrodusă în România în 1981, în contextul politicii de austeritate și al penuriei.'
    ],
    [
      '2016-ist-029',
      'istorie',
      'stat-modern',
      'Regulamentele Organice au rămas în vigoare până în 1858, fiind înlocuite de:',
      ['Convenția de la Paris', 'Proclamația de la Islaz', 'Constituția Cărvunarilor', 'Petiția-Proclamație'],
      0,
      source(29),
      'Convenția de la Paris din 1858 a înlocuit cadrul constituțional reprezentat de Regulamentele Organice.'
    ],
    [
      '2016-ist-030',
      'istorie',
      'concert-european',
      'Ultimatumul înaintat de Moscova României, în anul 1940, solicita cedarea:',
      ['Basarabiei și nordului Transilvaniei', 'Basarabiei și a Bucovinei de nord', 'Cadrilaterului', 'Nord-vestului Transilvaniei'],
      1,
      source(30),
      'Ultimatumul sovietic din iunie 1940 a cerut evacuarea Basarabiei și a nordului Bucovinei.'
    ],
    [
      '2016-ist-034',
      'istorie',
      'stat-modern',
      'Poarta a acceptat restaurarea domniilor pământene în:',
      ['septembrie 1821', 'septembrie 1822', 'septembrie 1823', 'septembrie 1824'],
      1,
      source(34),
      'După încheierea mișcării din 1821, Poarta a restabilit domniile pământene în 1822.'
    ],
    [
      '2016-ist-037',
      'istorie',
      'autonomii-institutii',
      'Singurul conducător local numit de Anonymus cu termenul Blach (român) era:',
      ['Gelu', 'Glad', 'Menumorut', 'Tatos'],
      0,
      source(37),
      'În Gesta Hungarorum, Gelu este desemnat explicit ca „quidam Blacus”, adică un român/valah.'
    ],
    [
      '2016-ist-038',
      'istorie',
      'diplomatie-conflict',
      'Expediția otomană din 1476 a fost precedată de pustiitoare raiduri:',
      ['bulgărești', 'rusești', 'tătărești', 'maghiare'],
      2,
      source(38),
      'Campania otomană din 1476 împotriva Moldovei a fost precedată de incursiuni tătărești, parte a presiunii militare coordonate asupra lui Ștefan cel Mare.'
    ],
    [
      '2016-ist-041',
      'istorie',
      'romania-postbelica',
      'Revenirea la denumirea de Partidul Comunist Român s-a făcut în cadrul:',
      ['Congresului al IX-lea', 'Congresului al X-lea', 'Congresului al XI-lea', 'Congresului al XII-lea'],
      0,
      source(41),
      'La Congresul al IX-lea din 1965, Partidul Muncitoresc Român a revenit la denumirea de Partidul Comunist Român.'
    ],
    [
      '2016-ist-042',
      'istorie',
      'diplomatie-conflict',
      'Mihai Viteazul îi ucide la București, la 13 noiembrie 1594, și pe:',
      ['Creditorii levantini', 'Creditorii austrieci', 'Creditorii elvețieni', 'Creditorii arabi'],
      0,
      source(42),
      'Ridicarea antiotomană a lui Mihai Viteazul a debutat la București prin uciderea creditorilor levantini și a unor reprezentanți otomani.'
    ],
    [
      '2016-ist-045',
      'istorie',
      'concert-european',
      'Primul Război Balcanic izbucnit în toamna anului 1912 s-a încheiat prin semnarea unui tratat de pace la:',
      ['București', 'Berlin', 'Budapesta', 'Londra'],
      3,
      source(45),
      'Primul Război Balcanic s-a încheiat prin Tratatul de la Londra din 30 mai 1913.'
    ],
    [
      '2016-ist-046',
      'istorie',
      'concert-european',
      'România a aderat la Pactul Tripartit intrând astfel în sistemul de alianțe al Axei Berlin-Roma-Tokyo la data de:',
      ['23 martie 1939', '23 martie 1940', '23 noiembrie 1939', '23 noiembrie 1940'],
      3,
      source(46),
      'România a aderat la Pactul Tripartit la 23 noiembrie 1940.'
    ],
    [
      '2016-ist-049',
      'istorie',
      'stat-modern',
      'Prin Convenția de la Paris, Principatele Române erau concepute ca:',
      ['State confederate', 'Republică parlamentară', 'Monarhie constituțională', 'Monarhie ereditară'],
      0,
      source(49),
      'Convenția de la Paris din 1858 a menținut două principate cu instituții proprii și elemente comune, formulă prezentată în bibliografia de examen ca organizare de tip confederativ.'
    ],
    [
      '2016-ist-050',
      'istorie',
      'diplomatie-conflict',
      'În 1394, Mircea cel Bătrân lansează o expediție la sud de Dunăre împotriva:',
      ['Achingiilor', 'Yagizilor', 'Sarmaților', 'Cumanilor'],
      0,
      source(50),
      'Expediția lui Mircea cel Bătrân din 1394 a vizat bazele achingiilor, cavaleria neregulată otomană folosită pentru incursiuni.'
    ],
    [
      '2016-ist-052',
      'istorie',
      'stat-modern',
      'Convenția militară semnată de Tudor Vladimirescu cu eteriștii a avut scopul:',
      ['Îndepărtării dominației otomane', 'Instaurării propriului guvern', 'Instaurării guvernării grecești', 'Instaurării dominației ruso-turce'],
      0,
      source(52),
      'Înțelegerea dintre Tudor Vladimirescu și eteriști urmărea cooperarea împotriva dominației otomane.'
    ],
    [
      '2016-ist-053',
      'istorie',
      'autonomii-institutii',
      'Voievodatul condus de voievodul Litovoi era localizat conform Diplomei Cavalerilor Ioaniți în:',
      ['Muntenia', 'Banat', 'Țara Hațegului și nordul Olteniei', 'Dobrogea'],
      2,
      source(53),
      'Voievodatul lui Litovoi cuprindea teritorii din nordul Olteniei și era legat de zona Țării Hațegului.'
    ],
    [
      '2016-ist-055',
      'istorie',
      'diplomatie-conflict',
      'Semna un tratat cu Sigismund Báthory:',
      ['Mircea cel Bătrân', 'Vlad Țepeș', 'Ștefan cel Mare', 'Mihai Viteazul'],
      3,
      source(55),
      'Mihai Viteazul a încheiat în 1595 un tratat cu principele Transilvaniei, Sigismund Báthory.'
    ],
    [
      '2016-ist-058',
      'istorie',
      'autonomii-institutii',
      'Regele maghiar Ștefan I îl înfrânge cu greu pe conducătorul unei formațiuni prestatale cu centrul la Bălgrad numit:',
      ['Gelu', 'Ahtum', 'Glad', 'Gyula'],
      3,
      source(58),
      'Formațiunea politică transilvăneană cu centrul la Bălgrad era condusă de Gyula, înfrânt de regele Ștefan I al Ungariei.'
    ]
  ]);
})();
