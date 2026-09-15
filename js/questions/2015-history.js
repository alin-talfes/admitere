(() => {
  'use strict';

  // Lot conservator: numai itemi cu raspuns factual neechivoc, verificat independent.
  // Arhiva oficiala SNPAP confirma existenta grilei de raspuns la Istorie 2015 si nu
  // listeaza o erata separata pentru probele scrise. Modulul ramane in staging pana
  // la confruntarea directa a cheii finale din documentul oficial.
  const source = number => `SNPAP Târgu Ocna – Admitere 2015, Istoria românilor, întrebarea ${number}; arhiva oficială confirmă publicarea grilei de răspuns, iar enunțul și variantele au fost confruntate cu transcrierea publică a testului 2015.`;

  window.registerQuestionBatch([
    [
      '2015-ist-001',
      'istorie',
      'autonomii-institutii',
      'Ungurii s-au instalat în Câmpia Panonică în secolul:',
      ['al IX-lea', 'al XI-lea', 'al VIII-lea', 'al XII-lea'],
      0,
      source(1),
      'Stabilirea maghiarilor în Câmpia Panonică a avut loc la sfârșitul secolului al IX-lea, în jurul anului 896.'
    ],
    [
      '2015-ist-002',
      'istorie',
      'constitutii',
      'Constituția din 1938 a fost promulgată de regele Carol al II-lea prin:',
      ['Decretul Regal nr. 82 din 21 februarie 1938', 'Decretul Regal nr. 72 din 21 februarie 1938', 'Decretul Regal nr. 1045 din 27 februarie 1938', 'Decretul Regal nr. 1045 din 21 februarie 1938'],
      2,
      source(2),
      'Constituția din 1938 a fost promulgată prin Decretul regal nr. 1045 din 27 februarie 1938.'
    ],
    [
      '2015-ist-005',
      'istorie',
      'autonomii-institutii',
      'Instalarea Ordinului Cavalerilor Teutoni în Țara Bârsei a avut loc în anul:',
      ['1176', '1111', '1211', '1225'],
      2,
      source(5),
      'Regele Andrei al II-lea al Ungariei a așezat Ordinul Cavalerilor Teutoni în Țara Bârsei în anul 1211.'
    ],
    [
      '2015-ist-009',
      'istorie',
      'diplomatie-conflict',
      'Tratatul de la Overchelăuți a fost încheiat de către Ștefan cel Mare cu regele Poloniei:',
      ['Vladislav Jagiello', 'Cazimir', 'Ioan Albert', 'Sigismund de Luxemburg'],
      1,
      source(9),
      'Tratatul de la Overchelăuți din 1459 a fost încheiat de Ștefan cel Mare cu regele polon Cazimir al IV-lea.'
    ],
    [
      '2015-ist-014',
      'istorie',
      'stat-modern',
      'Tudor Vladimirescu a fost judecat, condamnat și executat la sfârșitul lui mai 1821 de:',
      ['ruși', 'austrieci', 'eteriști', 'turci'],
      2,
      source(14),
      'Tudor Vladimirescu a fost capturat, judecat și ucis de eteriști la sfârșitul lunii mai 1821.'
    ],
    [
      '2015-ist-017',
      'istorie',
      'diplomatie-conflict',
      'În toamna anului 1599 Mihai Viteazul pătrunde în Transilvania și învinge oastea ardeleană la:',
      ['Mirăslău', 'Călugăreni', 'Șelimbăr', 'Gurăslău'],
      2,
      source(17),
      'Mihai Viteazul a învins armata lui Andrei Báthory la Șelimbăr, la 18/28 octombrie 1599.'
    ],
    [
      '2015-ist-018',
      'istorie',
      'stat-modern',
      'Tratatul de la Adrianopol consacra individualitatea politică a Țărilor Românești și:',
      ['instituia oficial protectoratul rusesc asupra acestora', 'impunea funcționarea Regulamentelor Organice', 'instituia garanția colectivă', 'anula prevederile Păcii din 1812'],
      0,
      source(18),
      'Tratatul de la Adrianopol din 1829 a consacrat autonomia administrativă a Principatelor sub suzeranitate otomană și protectorat rusesc.'
    ],
    [
      '2015-ist-025',
      'istorie',
      'diplomatie-conflict',
      'Mihai Viteazul încheia la Alba Iulia, prin delegația Stărilor, la 20 mai 1595, un tratat cu:',
      ['Sigismund de Luxemburg', 'Andrei Báthory', 'Vladislav Jagiello', 'Sigismund Báthory'],
      3,
      source(25),
      'Tratatul de la Alba Iulia din 20 mai 1595 a fost încheiat cu principele Transilvaniei, Sigismund Báthory.'
    ],
    [
      '2015-ist-026',
      'istorie',
      'concert-european',
      'Prin cedarea către Moldova a județelor Cahul, Ismail și Bolgrad:',
      ['zona strategică care asigura controlul Strâmtorilor era oferită Rusiei', 'zona strategică care asigura controlul Strâmtorilor era oferită Turciei', 'zona strategică care asigura gurile Dunării era luată Turciei', 'zona strategică care asigura gurile Dunării era luată Rusiei'],
      3,
      source(26),
      'Tratatul de la Paris din 1856 a obligat Rusia să cedeze Moldovei sudul Basarabiei, îndepărtând Rusia de gurile Dunării.'
    ],
    [
      '2015-ist-033',
      'istorie',
      'romania-postbelica',
      'Regele Mihai a fost forțat de Partidul Comunist să abdice la data de:',
      ['25 iulie 1947', '20 mai 1947', '25 noiembrie 1947', '30 decembrie 1947'],
      3,
      source(33),
      'Regele Mihai I a fost constrâns să abdice la 30 decembrie 1947, în aceeași zi fiind proclamată Republica Populară Română.'
    ],
    [
      '2015-ist-037',
      'istorie',
      'constitutii',
      'Constituția Republicii Populare Române, adoptată în aprilie 1948, prelua modelul sovietic din anul:',
      ['1936', '1924', '1945', '1946'],
      0,
      source(37),
      'Constituția RPR din 1948 a fost construită după modelul Constituției sovietice din 1936.'
    ],
    [
      '2015-ist-038',
      'istorie',
      'concert-european',
      'Nicolae Titulescu a fost ales președinte al Adunării Generale a Societății Națiunilor în anii:',
      ['1930 și 1932', '1931 și 1932', '1930 și 1931', '1932 și 1934'],
      2,
      source(38),
      'Nicolae Titulescu a fost ales președinte al Adunării Societății Națiunilor în 1930 și reales în 1931.'
    ],
    [
      '2015-ist-040',
      'istorie',
      'constitutii',
      'România devenea Republica Socialistă România în anul:',
      ['1969', '1965', '1974', '1976'],
      1,
      source(40),
      'Constituția adoptată la 21 august 1965 a schimbat denumirea statului în Republica Socialistă România.'
    ],
    [
      '2015-ist-041',
      'istorie',
      'romania-postbelica',
      'Armistițiul semnat în noaptea de 12/13 septembrie 1944 între România și U.R.S.S. cerea guvernului român să:',
      ['se angajeze în efortul de război aliat cu cel puțin 12 divizii de infanterie', 'cedeze Basarabia, Bucovina și ținutul Herța', 'cedeze nord-vestul Transilvaniei', 'permită trecerea trupelor germane spre Ungaria'],
      0,
      source(41),
      'Articolul 1 al Convenției de armistițiu prevedea participarea României la războiul împotriva Germaniei și Ungariei cu nu mai puțin de 12 divizii de infanterie, împreună cu serviciile tehnice auxiliare.'
    ],
    [
      '2015-ist-043',
      'istorie',
      'romania-postbelica',
      'Nicolae Ceaușescu a fost ales președintele Republicii Socialiste România în anul:',
      ['1965', '1967', '1974', '1976'],
      2,
      source(43),
      'Funcția de președinte al Republicii Socialiste România a fost instituită în 1974, iar Nicolae Ceaușescu a fost ales în această funcție în același an.'
    ],
    [
      '2015-ist-046',
      'istorie',
      'constitutii',
      'Libertatea individuală este garantată prin:',
      ['Constituție', 'presă', 'mass-media', 'Regulamentele Organice'],
      0,
      source(46),
      'Garanțiile libertății individuale sunt consacrate la nivel constituțional.'
    ],
    [
      '2015-ist-049',
      'istorie',
      'autonomii-institutii',
      'Țara Șipenițului era situată:',
      ['la sud de Carpați', 'la est de Carpați', 'în Transilvania', 'în Crișana'],
      1,
      source(49),
      'Țara Șipenițului este menționată între formațiunile politice medievale de la est de Carpați.'
    ],
    [
      '2015-ist-050',
      'istorie',
      'constitutii',
      'Textul Constituției din 1866 a rezultat din:',
      ['dezbaterile Adunării Deputaților', 'dezbaterile Senatului', 'dezbaterile Comisiei Adunării Centrale Constituante de la Focșani', 'dezbaterile Adunării Constituante'],
      3,
      source(50),
      'Constituția din 1866 a fost elaborată și adoptată în cadrul Adunării Constituante.'
    ],
    [
      '2015-ist-054',
      'istorie',
      'constitutii',
      'Constituția din 1923 a fost adoptată la data de:',
      ['19 mai', '27 martie', '3 mai', '13 iulie'],
      1,
      source(54),
      'Constituția României din 1923 a fost adoptată la 27 martie 1923 și promulgată la 28 martie.'
    ],
    [
      '2015-ist-057',
      'istorie',
      'autonomii-institutii',
      'Voievodatul lui Seneslau era localizat:',
      ['în dreapta Oltului', 'în stânga Oltului', 'în Maramureș', 'în Banat'],
      1,
      source(57),
      'Diploma Cavalerilor Ioaniți plasează voievodatul lui Seneslau la est, respectiv în stânga Oltului.'
    ],
    [
      '2015-ist-058',
      'istorie',
      'constitutii',
      'În articolele 5, 7, 10 (8), 26 (28), 27 (29) apare precizarea impusă prin tratatele de pace:',
      ['„Fără deosebire de origine etnică, de limbă și de religie”', '„Cu deosebire de origine religioasă”', '„Fără deosebire de limba minorității”', '„Fără deosebire de sex și apartenență politică”'],
      0,
      source(58),
      'Formula privind exercitarea drepturilor fără deosebire de origine etnică, limbă și religie reflectă obligațiile privind protecția minorităților asumate prin tratatele de pace.'
    ]
  ]);
})();