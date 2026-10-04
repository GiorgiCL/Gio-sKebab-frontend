import type { PublicLocale } from '../../lib/i18n/locales'

export const businessIdentity = {
  name: 'UAB Sauce me up',
  companyCode: '306635721',
  vatCode: 'LT100017822119',
  registeredOffice: 'Perkūnkiemio g. 19, LT-12120 Vilnius, Lithuania',
}

// Official authority pages checked on 2026-10-04. Keep names in their official form.
export const authorities = {
  privacy: { name: 'Valstybinė duomenų apsaugos inspekcija (VDAI)', url: 'https://vdai.lrv.lt/lt/veiklos-sritys-1/skundu-nagrinejimas/' },
  consumer: { name: 'Valstybinė vartotojų teisių apsaugos tarnyba (VVTAT)', url: 'https://vvtat.lrv.lt/lt/kaip-pateikti-prasyma/', address: 'A. Goštauto g. 12, LT-01108 Vilnius' },
}

type Section = { title: string; body: string }
type LegalText = {
  privacy: string; legal: string; navigation: string; home: string
  privacyDescription: string; legalDescription: string
  controller: string; operator: string; operatedBy: string
  companyCode: string; vatCode: string; registeredOffice: string; register: string; officeNote: string
  contact: string; restaurantAddress: string; phone: string; email: string; contactIntro: string; contactUnavailable: string
  scope: Section; technical: Section; admin: Section; cookies: Section; providers: Section; external: Section
  rights: Section; complaint: string; disputes: Section; consumerGuidance: string
}

export const legalText: Record<PublicLocale, LegalText> = {
  lt: {
    privacy: 'Privatumo pranešimas', legal: 'Verslo informacija', navigation: 'Teisinė informacija', home: 'Į pagrindinį puslapį',
    privacyDescription: 'Kaip Gio’s Kebab svetainėje tvarkomi duomenys, naudojami slapukai ir kaip susisiekti dėl privatumo.',
    legalDescription: 'Gio’s Kebab veiklos vykdytojo rekvizitai, restorano kontaktai ir informacija apie vartojimo ginčus.',
    controller: 'Duomenų valdytojas', operator: 'Veiklos vykdytojas', operatedBy: 'Gio’s Kebab veiklą vykdo UAB Sauce me up.',
    companyCode: 'Juridinio asmens kodas', vatCode: 'PVM mokėtojo kodas', registeredOffice: 'Registruota buveinė',
    register: 'Įregistruota Lietuvos Respublikos juridinių asmenų registre.',
    officeNote: 'Tai bendrovės registruota buveinė, o ne restorano lankymo adresas. Restorano adresas pateikiamas atskirai, kontaktų skiltyje.',
    contact: 'Restorano kontaktai ir kreipimasis', restaurantAddress: 'Restorano adresas', phone: 'Telefonas', email: 'El. paštas',
    contactIntro: 'Dėl privatumo ar kitų klausimų susisiekite toliau nurodytais kontaktais. Raštu taip pat galite kreiptis į UAB Sauce me up registruotos buveinės adresu.',
    contactUnavailable: 'Restorano kontaktų šiuo metu nepavyko gauti. Raštu galite kreiptis bendrovės registruotos buveinės adresu.',
    scope: { title: 'Apie svetainę', body: 'Čia skelbiame restorano, meniu, pietų pasiūlymų, akcijų ir darbo laiko informaciją. Svetainėje nėra klientų paskyrų, kontaktinės formos, rezervacijų, krepšelio ar atsiskaitymo. Joje nepriimame ir nesaugome klientų užsakymų, neapdorojame mokėjimų.' },
    technical: { title: 'Techniniai duomenys ir jų paskirtis', body: 'Atveriant puslapius ir vaizdus, svetainės infrastruktūra gauna įprastus užklausų duomenis, pavyzdžiui, IP adresą, naršyklės informaciją, prašomą adresą ir užklausos laiką. Veikimo bei klaidų žurnaluose gali būti techninės užklausų ir klaidų informacijos. Ji naudojama svetainei pateikti, saugumui, sutrikimų diagnostikai ir patikimam veikimui užtikrinti.' },
    admin: { title: 'Tik administratoriams', body: 'Administravimo aplinka tvarko administratoriaus el. paštą, slaptažodžio maišą ir prisijungimo sesiją. Tai skirta prieigai prie svetainės turinio valdymo apsaugoti; viešiems lankytojams prisijungti nereikia.' },
    cookies: { title: 'Slapukai ir naršyklės saugykla', body: 'Svetainėje nenaudojame reklamos ar lankytojų elgsenos analitikos. Administravimo aplinkai būtinas JSESSIONID sesijos slapukas ir apsauga nuo suklastotų užklausų (CSRF). Pasirinkus „prisiminti mane“, administratoriaus prisijungimas gali išlikti uždarius naršyklę. Administratoriaus kalbos ir išvaizdos pasirinkimai saugomi naršyklės vietinėje saugykloje. Viešosios svetainės kalbą nurodo puslapio adresas.' },
    providers: { title: 'Techniniai paslaugų teikėjai', body: 'Svetainę aptarnauja prieglobos, DNS ir turinio pristatymo bei duomenų bazės paslaugos. Duomenų bazėje saugomas restorano turinys ir administratoriaus paskyros duomenys. Cloudinary naudojama restorano vaizdams saugoti ir pateikti; kraunant šiuos vaizdus, naršyklė siunčia užklausas vaizdų teikėjui. Šie teikėjai gali tvarkyti techninius duomenis tiek, kiek reikia jų paslaugoms teikti.' },
    external: { title: 'Išorinės nuorodos ir užsakymai', body: 'Wolt ir Bolt Food nuorodos nukreipia į atskiras užsakymo paslaugas. Užsakymas ir atsiskaitymas vyksta jų aplinkoje, kur taikomos jų sąlygos ir privatumo pranešimai. Žemėlapių ir socialinių tinklų nuorodos taip pat veda į išorines paslaugas.' },
    rights: { title: 'Jūsų teisės', body: 'Pagal taikomas duomenų apsaugos taisykles galite prašyti susipažinti su savo asmens duomenimis, juos ištaisyti ar ištrinti, apriboti tvarkymą, nesutikti su tvarkymu ir, kai taikoma, gauti duomenis perkeliamu formatu. Teisių taikymas priklauso nuo duomenų ir jų tvarkymo aplinkybių. Dėl jų įgyvendinimo kreipkitės į duomenų valdytoją nurodytais kontaktais.' },
    complaint: 'Dėl asmens duomenų tvarkymo galite pateikti skundą priežiūros institucijai:',
    disputes: { title: 'Vartotojų skundai ir ginčai', body: 'Dėl skundo pirmiausia raštu kreipkitės į UAB Sauce me up ir nurodykite savo reikalavimą. Naudokite skelbiamą el. paštą, jei jis pateiktas, arba registruotos buveinės adresą. Nepavykus susitarti, galite kreiptis į kompetentingą Lietuvos vartojimo ginčus ne teismo tvarka nagrinėjančią instituciją. Institucijos kompetencija priklauso nuo ginčo pobūdžio; ne visi klausimai dėl maisto, saugos ar sutarties priklauso tai pačiai institucijai.' },
    consumerGuidance: 'Informaciją apie kreipimosi tvarką ir kompetenciją teikia:',
  },
  en: {
    privacy: 'Privacy notice', legal: 'Business information', navigation: 'Legal information', home: 'Back to home',
    privacyDescription: 'How Gio’s Kebab handles website data and cookies, and how to contact us about privacy.',
    legalDescription: 'Gio’s Kebab operator details, restaurant contacts and consumer dispute information.',
    controller: 'Data controller', operator: 'Business operator', operatedBy: 'Gio’s Kebab is operated by UAB Sauce me up.',
    companyCode: 'Company code', vatCode: 'VAT payer code', registeredOffice: 'Registered office',
    register: 'Registered in the Register of Legal Entities of the Republic of Lithuania.',
    officeNote: 'This is the company’s registered office, not the restaurant’s visiting address. The restaurant address is listed separately in the contact section.',
    contact: 'Restaurant contacts and enquiries', restaurantAddress: 'Restaurant address', phone: 'Phone', email: 'Email',
    contactIntro: 'For privacy or other enquiries, use the contacts below. You can also write to UAB Sauce me up at its registered office.',
    contactUnavailable: 'Restaurant contact details could not be loaded. You can write to the company at its registered office.',
    scope: { title: 'About this website', body: 'We publish restaurant, menu, lunch, promotion and opening-hours information. This website has no customer accounts, contact form, reservations, shopping cart or checkout. It does not take or store customer orders or process payments.' },
    technical: { title: 'Technical data and its purpose', body: 'When you open pages and images, the website infrastructure receives ordinary request information, such as your IP address, browser information, requested address and request time. Operational and error logs may contain technical request and error details. This information is used to deliver the website, maintain security, diagnose faults and keep the service reliable.' },
    admin: { title: 'Administrators only', body: 'The administration area processes the administrator’s email, password hash and login session. This protects access to website content management; public visitors do not need to sign in.' },
    cookies: { title: 'Cookies and browser storage', body: 'We do not use advertising or visitor behaviour analytics on this website. The administration area uses a necessary JSESSIONID session cookie and protection against forged requests (CSRF). If an administrator chooses “remember me”, their login can persist after the browser closes. Administrator language and appearance preferences are kept in browser local storage. The public site’s language is determined by the page address.' },
    providers: { title: 'Technical service providers', body: 'The website relies on hosting, DNS, content delivery and database services. The database holds restaurant content and administrator account data. Cloudinary stores and delivers restaurant images; loading those images sends browser requests to the image provider. These providers may process technical data as needed to deliver their services.' },
    external: { title: 'External links and ordering', body: 'Wolt and Bolt Food links take you to separate ordering services. Ordering and payment happen in their environments, under their own terms and privacy notices. Map and social media links also lead to external services.' },
    rights: { title: 'Your rights', body: 'Under applicable data protection rules, you can request access to, correction or deletion of your personal data, restriction of processing, object to processing and, where applicable, receive your data in a portable format. These rights depend on the data and the circumstances of processing. To exercise them, contact the data controller using the details provided.' },
    complaint: 'You may complain about the processing of your personal data to the supervisory authority:',
    disputes: { title: 'Consumer complaints and disputes', body: 'Please first contact UAB Sauce me up in writing with your complaint and the outcome you seek. Use the published email, if available, or the registered office address. If a dispute cannot be resolved, you may contact the competent Lithuanian out-of-court consumer dispute authority. Competence depends on the nature of the dispute; food, safety and contractual issues do not all fall to the same authority.' },
    consumerGuidance: 'For guidance on submitting a complaint and the authority’s remit, see:',
  },
  ru: {
    privacy: 'Уведомление о конфиденциальности', legal: 'Информация о компании', navigation: 'Правовая информация', home: 'На главную',
    privacyDescription: 'Как сайт Gio’s Kebab обрабатывает данные, использует файлы cookie и как обратиться по вопросам конфиденциальности.',
    legalDescription: 'Реквизиты компании Gio’s Kebab, контакты ресторана и информация о потребительских спорах.',
    controller: 'Оператор персональных данных', operator: 'Компания', operatedBy: 'Деятельность Gio’s Kebab осуществляет UAB Sauce me up.',
    companyCode: 'Код юридического лица', vatCode: 'Код плательщика НДС', registeredOffice: 'Юридический адрес',
    register: 'Зарегистрирована в Реестре юридических лиц Литовской Республики.',
    officeNote: 'Это юридический адрес компании, а не адрес для посещения ресторана. Адрес ресторана указан отдельно в разделе контактов.',
    contact: 'Контакты ресторана и обращения', restaurantAddress: 'Адрес ресторана', phone: 'Телефон', email: 'Электронная почта',
    contactIntro: 'По вопросам конфиденциальности и другим вопросам обращайтесь по контактам ниже. Вы также можете написать в UAB Sauce me up по юридическому адресу.',
    contactUnavailable: 'Не удалось загрузить контакты ресторана. Вы можете направить письмо по юридическому адресу компании.',
    scope: { title: 'Об этом сайте', body: 'Мы публикуем информацию о ресторане, меню, обедах, акциях и часах работы. На сайте нет клиентских аккаунтов, контактной формы, бронирования, корзины или оформления покупок. Сайт не принимает и не хранит заказы клиентов и не обрабатывает платежи.' },
    technical: { title: 'Технические данные и цели обработки', body: 'При открытии страниц и изображений инфраструктура сайта получает обычные сведения о запросе: например, IP-адрес, данные браузера, запрашиваемый адрес и время запроса. Рабочие журналы и журналы ошибок могут содержать технические сведения о запросах и сбоях. Они используются для работы сайта, обеспечения безопасности, диагностики сбоев и надёжности сервиса.' },
    admin: { title: 'Только для администраторов', body: 'В административной части обрабатываются электронная почта администратора, хеш пароля и сеанс входа. Это необходимо для защиты доступа к управлению содержимым сайта. Посетителям публичной части входить в аккаунт не нужно.' },
    cookies: { title: 'Файлы cookie и хранилище браузера', body: 'На сайте нет рекламной аналитики или аналитики поведения посетителей. Для административной части используются необходимый файл cookie JSESSIONID и защита от подделки запросов (CSRF). Если администратор выбирает «запомнить меня», вход может сохраняться после закрытия браузера. Выбор языка и оформления административной части сохраняется в локальном хранилище браузера. Язык публичного сайта определяется адресом страницы.' },
    providers: { title: 'Технические поставщики услуг', body: 'Сайт использует услуги хостинга, DNS, доставки контента и базы данных. В базе хранятся материалы ресторана и данные аккаунта администратора. Cloudinary используется для хранения и доставки изображений ресторана; при их загрузке браузер отправляет запросы поставщику изображений. Эти поставщики могут обрабатывать технические данные, необходимые для оказания их услуг.' },
    external: { title: 'Внешние ссылки и заказы', body: 'Ссылки Wolt и Bolt Food ведут в отдельные сервисы заказа. Оформление заказа и оплата происходят в их среде, где действуют их условия и уведомления о конфиденциальности. Ссылки на карты и социальные сети также ведут во внешние сервисы.' },
    rights: { title: 'Ваши права', body: 'В соответствии с применимыми правилами защиты данных вы можете запросить доступ к своим персональным данным, их исправление или удаление, ограничение обработки, возразить против обработки и, когда это применимо, получить данные в переносимом формате. Применимость прав зависит от данных и обстоятельств их обработки. Для реализации прав обратитесь к оператору данных по указанным контактам.' },
    complaint: 'По вопросам обработки ваших персональных данных вы вправе подать жалобу в надзорный орган:',
    disputes: { title: 'Жалобы потребителей и споры', body: 'Сначала направьте в UAB Sauce me up письменную жалобу и укажите своё требование. Используйте опубликованную электронную почту, если она указана, или юридический адрес. Если договориться не удалось, вы можете обратиться в компетентный орган внесудебного разрешения потребительских споров в Литве. Компетенция зависит от характера спора: вопросы о продуктах питания, безопасности и договорных отношениях не всегда рассматривает один и тот же орган.' },
    consumerGuidance: 'Порядок обращения и сведения о компетенции органа:',
  },
  ka: {
    privacy: 'კონფიდენციალურობის შესახებ', legal: 'ინფორმაცია კომპანიის შესახებ', navigation: 'სამართლებრივი ინფორმაცია', home: 'მთავარ გვერდზე',
    privacyDescription: 'როგორ ამუშავებს Gio’s Kebab-ის საიტი მონაცემებს, როგორ იყენებს ქუქი-ფაილებს და როგორ დაგვიკავშირდეთ კონფიდენციალურობის საკითხებზე.',
    legalDescription: 'Gio’s Kebab-ის მმართველი კომპანიის მონაცემები, რესტორნის საკონტაქტო ინფორმაცია და მომხმარებელთა დავები.',
    controller: 'მონაცემთა დამუშავებისთვის პასუხისმგებელი პირი', operator: 'მმართველი კომპანია', operatedBy: 'Gio’s Kebab-ს მართავს UAB Sauce me up.',
    companyCode: 'კომპანიის კოდი', vatCode: 'დღგ-ის გადამხდელის კოდი', registeredOffice: 'იურიდიული მისამართი',
    register: 'რეგისტრირებულია ლიეტუვის რესპუბლიკის იურიდიულ პირთა რეესტრში.',
    officeNote: 'ეს კომპანიის იურიდიული მისამართია და არა რესტორანში მისასვლელი მისამართი. რესტორნის მისამართი ცალკე, საკონტაქტო განყოფილებაშია მითითებული.',
    contact: 'რესტორნის კონტაქტები და მიმართვა', restaurantAddress: 'რესტორნის მისამართი', phone: 'ტელეფონი', email: 'ელფოსტა',
    contactIntro: 'კონფიდენციალურობისა და სხვა საკითხებზე დაგვიკავშირდით ქვემოთ მითითებული საშუალებებით. წერილის გაგზავნა ასევე შეგიძლიათ UAB Sauce me up-ის იურიდიულ მისამართზე.',
    contactUnavailable: 'რესტორნის საკონტაქტო ინფორმაციის ჩატვირთვა ვერ მოხერხდა. შეგიძლიათ წერილი კომპანიის იურიდიულ მისამართზე გაგზავნოთ.',
    scope: { title: 'ამ საიტის შესახებ', body: 'აქ ვაქვეყნებთ ინფორმაციას რესტორნის, მენიუს, სადილების, აქციებისა და სამუშაო საათების შესახებ. საიტზე არ არის მომხმარებლის ანგარიშები, საკონტაქტო ფორმა, ჯავშანი, კალათა ან შეკვეთის გაფორმება. საიტი არ იღებს და არ ინახავს მომხმარებელთა შეკვეთებს და არ ამუშავებს გადახდებს.' },
    technical: { title: 'ტექნიკური მონაცემები და მათი გამოყენება', body: 'გვერდებისა და სურათების გახსნისას საიტის ინფრასტრუქტურა იღებს მოთხოვნის ჩვეულებრივ მონაცემებს, მაგალითად, IP მისამართს, ბრაუზერის შესახებ ინფორმაციას, მოთხოვნილ მისამართსა და მოთხოვნის დროს. მუშაობისა და შეცდომების ჟურნალებში შეიძლება აღირიცხოს მოთხოვნებისა და შეფერხებების ტექნიკური დეტალები. ეს ინფორმაცია გამოიყენება საიტის მუშაობის, უსაფრთხოების, შეფერხებების დიაგნოსტიკისა და სერვისის საიმედოობისთვის.' },
    admin: { title: 'მხოლოდ ადმინისტრატორებისთვის', body: 'ადმინისტრირების ნაწილში მუშავდება ადმინისტრატორის ელფოსტა, პაროლის ჰეში და შესვლის სესია. ეს იცავს საიტის შიგთავსის მართვაზე წვდომას. საჯარო საიტის სტუმრებს ანგარიშში შესვლა არ სჭირდებათ.' },
    cookies: { title: 'ქუქი-ფაილები და ბრაუზერის საცავი', body: 'საიტზე არ ვიყენებთ სარეკლამო ან სტუმართა ქცევის ანალიტიკას. ადმინისტრირების ნაწილს სჭირდება JSESSIONID სესიის ქუქი-ფაილი და გაყალბებული მოთხოვნებისგან დაცვა (CSRF). თუ ადმინისტრატორი აირჩევს „დამიმახსოვრე“ ფუნქციას, შესვლა შეიძლება ბრაუზერის დახურვის შემდეგაც შენარჩუნდეს. ადმინისტრატორის ენისა და გაფორმების არჩევანი ინახება ბრაუზერის ლოკალურ საცავში. საჯარო საიტის ენა გვერდის მისამართით განისაზღვრება.' },
    providers: { title: 'ტექნიკური მომსახურების მიმწოდებლები', body: 'საიტი იყენებს ჰოსტინგის, DNS-ის, შიგთავსის მიწოდებისა და მონაცემთა ბაზის სერვისებს. მონაცემთა ბაზაში ინახება რესტორნის მასალები და ადმინისტრატორის ანგარიშის მონაცემები. Cloudinary გამოიყენება რესტორნის სურათების შესანახად და მისაწოდებლად; მათი ჩატვირთვისას ბრაუზერი მოთხოვნებს სურათების მიმწოდებელთან აგზავნის. ამ მიმწოდებლებმა შეიძლება დაამუშაონ მომსახურებისთვის საჭირო ტექნიკური მონაცემები.' },
    external: { title: 'გარე ბმულები და შეკვეთები', body: 'Wolt-ისა და Bolt Food-ის ბმულები გადაგიყვანთ შეკვეთის დამოუკიდებელ სერვისებში. შეკვეთა და გადახდა მათ გარემოში ხდება, სადაც მათი პირობები და კონფიდენციალურობის წესები მოქმედებს. რუკებისა და სოციალური ქსელების ბმულებიც გარე სერვისებზე გადადის.' },
    rights: { title: 'თქვენი უფლებები', body: 'მონაცემთა დაცვის მოქმედი წესების შესაბამისად, შეგიძლიათ მოითხოვოთ თქვენს პერსონალურ მონაცემებზე წვდომა, მათი შესწორება ან წაშლა, დამუშავების შეზღუდვა, გააპროტესტოთ დამუშავება და, შესაბამის შემთხვევებში, მიიღოთ მონაცემები გადასატან ფორმატში. უფლებების გამოყენება დამოკიდებულია მონაცემებსა და მათი დამუშავების გარემოებებზე. მათ გამოსაყენებლად მიმართეთ მონაცემთა დამუშავებისთვის პასუხისმგებელ პირს მითითებული კონტაქტებით.' },
    complaint: 'თქვენი პერსონალური მონაცემების დამუშავების შესახებ საჩივრით შეგიძლიათ მიმართოთ ზედამხედველ ორგანოს:',
    disputes: { title: 'მომხმარებელთა საჩივრები და დავები', body: 'საჩივრით ჯერ წერილობით მიმართეთ UAB Sauce me up-ს და მიუთითეთ თქვენი მოთხოვნა. გამოიყენეთ გამოქვეყნებული ელფოსტა, თუ მითითებულია, ან იურიდიული მისამართი. თუ შეთანხმება ვერ მიიღწევა, შეგიძლიათ მიმართოთ ლიეტუვაში მომხმარებელთა დავების სასამართლოსგარეშე განხილვის უფლებამოსილ ორგანოს. კომპეტენცია დავის ხასიათზეა დამოკიდებული: სურსათის, უსაფრთხოებისა და სახელშეკრულებო საკითხებს ყოველთვის ერთი და იგივე ორგანო არ განიხილავს.' },
    consumerGuidance: 'მიმართვის წესისა და ორგანოს კომპეტენციის შესახებ ინფორმაცია:',
  },
}
