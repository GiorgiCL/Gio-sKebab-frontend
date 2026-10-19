import type { PublicLocale } from './i18n/locales'

// Regulation (EU) No 1169/2011, Annex II. IDs match the backend enum.
export const allergenIds = [
  'CEREALS_CONTAINING_GLUTEN', 'CRUSTACEANS', 'EGGS', 'FISH', 'PEANUTS', 'SOYBEANS',
  'MILK', 'NUTS', 'CELERY', 'MUSTARD', 'SESAME', 'SULPHUR_DIOXIDE_SULPHITES', 'LUPIN', 'MOLLUSCS',
] as const
export type Allergen = typeof allergenIds[number]
export type AllergenStatus = 'NOT_VERIFIED' | 'VERIFIED_WITH_ALLERGENS' | 'VERIFIED_NONE_IDENTIFIED'
export interface AllergenInfo { status: AllergenStatus; allergens: Allergen[] }
export const unverifiedAllergens = (): AllergenInfo => ({ status: 'NOT_VERIFIED', allergens: [] })

type AllergenText = {
  title: string; state: string; notVerified: string; withAllergens: string; noneIdentified: string
  contains: string; nonePublic: string; hint: string; selection: string; chooseOne: string
  names: Record<Allergen, string>
}

export const allergenText: Record<PublicLocale, AllergenText> = {
  lt: {
    title: 'Alergenai', state: 'Patikrinimo būsena', notVerified: 'Nepatikrinta',
    withAllergens: 'Patikrinta — yra nurodytų alergenų', noneIdentified: 'Patikrinta — alergenų nenustatyta',
    contains: 'Alergenai', nonePublic: 'Patikrinus nenustatyta ES sąraše nurodytų alergenų.',
    hint: 'Žymėkite tik patikrinę receptūrą ir tiekėjų informaciją, atsižvelgdami į II priedo išimtis. Pasikeitus receptūrai patikrinkite iš naujo. Tuščias sąrašas nėra patvirtinimas, kad alergenų nėra.',
    selection: 'Pasirinkite patikrintus alergenus', chooseOne: 'Pasirinkite bent vieną alergeną arba kitą patikrinimo būseną.',
    names: {
      CEREALS_CONTAINING_GLUTEN: 'Glitimo turintys javai (kviečiai, įskaitant speltą ir chorasaninius kviečius, rugiai, miežiai, avižos ir jų hibridinės atmainos) ir jų produktai',
      CRUSTACEANS: 'Vėžiagyviai ir jų produktai', EGGS: 'Kiaušiniai ir jų produktai', FISH: 'Žuvys ir jų produktai',
      PEANUTS: 'Žemės riešutai ir jų produktai', SOYBEANS: 'Sojų pupelės ir jų produktai', MILK: 'Pienas ir jo produktai (įskaitant laktozę)',
      NUTS: 'Riešutai (migdolai, lazdynų, graikiniai, anakardžiai, karijos, brazilinės bertoletijos, pistacijos, makadamijos) ir jų produktai',
      CELERY: 'Salierai ir jų produktai', MUSTARD: 'Garstyčios ir jų produktai', SESAME: 'Sezamų sėklos ir jų produktai',
      SULPHUR_DIOXIDE_SULPHITES: 'Sieros dioksidas ir sulfitai (daugiau kaip 10 mg/kg arba 10 mg/l bendro SO₂)',
      LUPIN: 'Lubinai ir jų produktai', MOLLUSCS: 'Moliuskai ir jų produktai',
    },
  },
  en: {
    title: 'Allergens', state: 'Verification state', notVerified: 'Not verified',
    withAllergens: 'Verified — identified allergens', noneIdentified: 'Verified — none identified',
    contains: 'Allergens', nonePublic: 'No EU-listed allergens identified following verification.',
    hint: 'Select only after checking the recipe and supplier information, accounting for Annex II exemptions. Review again when the recipe changes. An empty list does not confirm absence of allergens.',
    selection: 'Select verified allergens', chooseOne: 'Select at least one allergen or choose another verification state.',
    names: {
      CEREALS_CONTAINING_GLUTEN: 'Cereals containing gluten (wheat, including spelt and khorasan, rye, barley, oats and their hybridised strains) and products thereof',
      CRUSTACEANS: 'Crustaceans and products thereof', EGGS: 'Eggs and products thereof', FISH: 'Fish and products thereof',
      PEANUTS: 'Peanuts and products thereof', SOYBEANS: 'Soybeans and products thereof', MILK: 'Milk and products thereof (including lactose)',
      NUTS: 'Nuts (almonds, hazelnuts, walnuts, cashews, pecans, Brazil nuts, pistachios, macadamia nuts) and products thereof',
      CELERY: 'Celery and products thereof', MUSTARD: 'Mustard and products thereof', SESAME: 'Sesame seeds and products thereof',
      SULPHUR_DIOXIDE_SULPHITES: 'Sulphur dioxide and sulphites (above 10 mg/kg or 10 mg/l total SO₂)',
      LUPIN: 'Lupin and products thereof', MOLLUSCS: 'Molluscs and products thereof',
    },
  },
  ru: {
    title: 'Аллергены', state: 'Статус проверки', notVerified: 'Не проверено',
    withAllergens: 'Проверено — аллергены выявлены', noneIdentified: 'Проверено — аллергены не выявлены',
    contains: 'Аллергены', nonePublic: 'После проверки аллергены из перечня ЕС не выявлены.',
    hint: 'Выбирайте только после проверки рецептуры и сведений поставщиков с учётом исключений в приложении II. При изменении рецептуры проверьте снова. Пустой список не подтверждает отсутствие аллергенов.',
    selection: 'Выберите проверенные аллергены', chooseOne: 'Выберите хотя бы один аллерген или другой статус проверки.',
    names: {
      CEREALS_CONTAINING_GLUTEN: 'Злаки, содержащие глютен (пшеница, включая спельту и хорасан, рожь, ячмень, овёс и их гибриды), и продукты из них',
      CRUSTACEANS: 'Ракообразные и продукты из них', EGGS: 'Яйца и продукты из них', FISH: 'Рыба и продукты из неё',
      PEANUTS: 'Арахис и продукты из него', SOYBEANS: 'Соевые бобы и продукты из них', MILK: 'Молоко и молочные продукты (включая лактозу)',
      NUTS: 'Орехи (миндаль, фундук, грецкий орех, кешью, пекан, бразильский орех, фисташки, макадамия) и продукты из них',
      CELERY: 'Сельдерей и продукты из него', MUSTARD: 'Горчица и продукты из неё', SESAME: 'Семена кунжута и продукты из них',
      SULPHUR_DIOXIDE_SULPHITES: 'Диоксид серы и сульфиты (свыше 10 мг/кг или 10 мг/л общего SO₂)',
      LUPIN: 'Люпин и продукты из него', MOLLUSCS: 'Моллюски и продукты из них',
    },
  },
  ka: {
    title: 'ალერგენები', state: 'შემოწმების სტატუსი', notVerified: 'შეუმოწმებელია',
    withAllergens: 'შემოწმებულია — ალერგენები გამოვლენილია', noneIdentified: 'შემოწმებულია — ალერგენები არ გამოვლენილა',
    contains: 'ალერგენები', nonePublic: 'შემოწმების შედეგად ევროკავშირის სიაში მითითებული ალერგენები არ გამოვლენილა.',
    hint: 'მონიშნეთ მხოლოდ რეცეპტისა და მომწოდებლის ინფორმაციის შემოწმების შემდეგ, II დანართის გამონაკლისების გათვალისწინებით. რეცეპტის ცვლილებისას ხელახლა შეამოწმეთ. ცარიელი სია ალერგენების არარსებობას არ ადასტურებს.',
    selection: 'აირჩიეთ შემოწმებული ალერგენები', chooseOne: 'აირჩიეთ სულ მცირე ერთი ალერგენი ან შემოწმების სხვა სტატუსი.',
    names: {
      CEREALS_CONTAINING_GLUTEN: 'გლუტენის შემცველი მარცვლეული (ხორბალი, სპელტისა და ხორასანის ჩათვლით, ჭვავი, ქერი, შვრია და მათი ჰიბრიდები) და მათი პროდუქტები',
      CRUSTACEANS: 'კიბოსნაირები და მათი პროდუქტები', EGGS: 'კვერცხი და მისი პროდუქტები', FISH: 'თევზი და მისი პროდუქტები',
      PEANUTS: 'არაქისი და მისი პროდუქტები', SOYBEANS: 'სოიოს მარცვლები და მათი პროდუქტები', MILK: 'რძე და რძის პროდუქტები (ლაქტოზის ჩათვლით)',
      NUTS: 'თხილეული (ნუში, თხილი, ნიგოზი, კეშიუ, პეკანი, ბრაზილიური კაკალი, ფსტა, მაკადამია) და მათი პროდუქტები',
      CELERY: 'ნიახური და მისი პროდუქტები', MUSTARD: 'მდოგვი და მისი პროდუქტები', SESAME: 'სეზამის თესლი და მისი პროდუქტები',
      SULPHUR_DIOXIDE_SULPHITES: 'გოგირდის დიოქსიდი და სულფიტები (10 მგ/კგ-ზე ან 10 მგ/ლ-ზე მეტი საერთო SO₂)',
      LUPIN: 'ხანჭკოლა და მისი პროდუქტები', MOLLUSCS: 'მოლუსკები და მათი პროდუქტები',
    },
  },
}
