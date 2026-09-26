(function () {
  'use strict';
  const button = document.getElementById('theme-toggle');
  const languageSelect = document.getElementById('language-select');
  const meta = document.querySelector('meta[name="theme-color"]');
  const entries = [
    [".nav-links a[href=\"#ishlarim\"]","Мои работы","My work"],
    ["#projects-label","Работы","Work"],
    ["#projects-title","Мои работы","My work"],
    ["#project-1-title a","Занятия в формате вопросов и ответов","Q&A sessions"],
    ["#project-1-description","С марта 2019 года веду вопросы и ответы по моим направлениям с сотрудниками подразделений санитарно-эпидемиологической службы по всей республике.","Since March 2019 I have been holding Q&A sessions on my areas of practice with staff of sanitary and epidemiological service units across the country."],
    ["#project-1-link","Открыть в Telegram ↗","Open in Telegram ↗"],
    ["#project-2-title a","Отраслевая библиотека","Professional library"],
    ["#project-2-description","Библиотека для специалистов отрасли: официальные документы, методические пособия, санитарные нормы и правила и другие материалы. Она постоянно пополняется. В отдельном разделе — мои статьи о прошлом, настоящем и будущем отрасли.","A library for professionals in the field: official documents, methodological guides, sanitary norms and rules, and other materials. It is updated regularly. A separate section holds my articles on the past, present and future of the field."],
    ["#project-2-link","Открыть в Telegram ↗","Open in Telegram ↗"],
    ["#project-3-title a","Школа наставничества","Mentorship school"],
    ["#project-3-description","Этот раздел по санитарно-эпидемиологической службе я открыл на сайте study-grow.uz. Там я размещаю уроки по темам и тесты с вопросами и ответами для подготовки специалистов к аттестации.","I opened this section on the sanitary and epidemiological service at study-grow.uz. There I post topic-based lessons and Q&A tests to help staff prepare for attestation."],
    ["#project-3-link","study-grow.uz ↗","study-grow.uz ↗"],
    [".nav-links a[href=\"#fikrlar\"]","Мнения","Feedback"],
    ["#reviews-label","Отзывы","Reviews"],
    ["#reviews-title","Мнения","Feedback"],
    ["#review-1-text","Отзыв скоро появится.","Review coming soon."],
    ["#review-1-name","Имя Фамилия","Full name"],
    ["#review-1-role","Должность","Position"],
    ["#review-2-text","Отзыв скоро появится.","Review coming soon."],
    ["#review-2-name","Имя Фамилия","Full name"],
    ["#review-2-role","Должность","Position"],
    ["#review-3-text","Отзыв скоро появится.","Review coming soon."],
    ["#review-3-name","Имя Фамилия","Full name"],
    ["#review-3-role","Должность","Position"],
    [".nav-links a[href=\"#savollar\"]","Вопросы","FAQ"],
    ["#faq-label","Вопросы","Questions"],
    ["#faq-title","Вопросы и ответы","Questions and answers"],
    ["#faq-1-question","Кому вы помогаете?","Who do you help?"],
    ["#faq-1-answer","Молодёжи, выбирающей профессию, а также сотрудникам службы санитарно-эпидемиологического благополучия и общественного здоровья. Консультирую по профориентации, работе с нормативными документами, подготовке к аттестации, правам сотрудников и охране труда.","Young people choosing a career, and sanitary and epidemiological welfare and public health staff. I advise on career guidance, working with regulatory documents, attestation preparation, employee rights and occupational safety."],
    ["#faq-2-question","Как проходят занятия?","How are sessions held?"],
    ["#faq-2-answer","Онлайн: через Telegram, по телефону или по видеосвязи. Связаться со мной можно из любого города.","Online: via Telegram, by phone or by video call. You can reach me from any city."],
    ["#faq-3-question","Ваши консультации платные?","Do you charge for consultations?"],
    ["#faq-3-answer","Нет, бесплатные. Моя цель — передать свой опыт молодёжи и коллегам.","No, they are free. My aim is to pass on my experience to young people and colleagues."],
    ["#faq-4-question","Как с вами связаться?","How can I contact you?"],
    ["#faq-4-answer","Напишите в Telegram (@xkomilov) или позвоните по номеру +998 90 588 04 50. Кратко опишите свой вопрос — я отвечу как можно скорее.","Message me on Telegram (@xkomilov) or call +998 90 588 04 50. Briefly describe your question and I will reply as soon as I can."],
    ['.contact-note', 'Есть вопрос? Напишите — я отвечу.', 'Have a question? Write to me — I will reply.'],
    ['.nav-links a[href="#xizmatlar"]', 'Направления', 'Areas of practice'],
    ['.nav-links a[href="#aloqa"]', 'Контакты', 'Contact'],
    ['.kicker', 'Школа наставничества', 'Mentorship school'],
    ['.role', 'Эпидемиолог-гигиенист · Врач-бактериолог', 'Epidemiologist and hygienist · Bacteriologist'],
    ['.summary:nth-of-type(2)', 'Я врач санитарно-эпидемиологической службы с 43-летним опытом работы.', 'I am a physician with 43 years of experience in the sanitary and epidemiological service.'],
    ['.summary:nth-of-type(3)', 'Как врач-бактериолог высшей категории, я помогаю молодёжи и специалистам отрасли углублять профессиональные знания.', 'As a bacteriologist with the highest qualification category, I help young people and professionals in the field expand their professional knowledge.'],
    ['.hero-actions a:nth-child(1)', 'Телефон: +998905880450', 'Phone: +998905880450'],
    ['.hero-actions a:nth-child(2)', 'Связаться в Telegram', 'Contact on Telegram'],
    ['#yonalishlar', 'Помощь в профессиональном развитии', 'Supporting professional development'],
    ['#services-title', 'Направления', 'Areas of practice'],
    ['#kasbga-yonaltirish-title', 'Профориентация', 'Career guidance'],
    ['#kasbga-yonaltirish-description', 'Помощь молодёжи в выборе профессии.', 'Helping young people choose a career.'],
    ['#meyoriy-hujjatlar-title', 'Работа с нормативными документами', 'Working with regulatory documents'],
    ['#meyoriy-hujjatlar-description', 'Обучение сотрудников службы санитарно-эпидемиологического благополучия и общественного здоровья работе с отраслевыми нормативными документами.', 'Training sanitary and epidemiological welfare and public health staff to work with industry regulations.'],
    ['#attestatsiya-title', 'Подготовка к аттестации', 'Attestation preparation'],
    ['#attestatsiya-description', 'Развитие профессиональных навыков сотрудников и подготовка к аттестации на квалификационную категорию.', 'Developing professional skills and preparing staff for qualification assessments.'],
    ['#mehnat-muhofazasi-title', 'Права и охрана труда', 'Rights and occupational safety'],
    ['#mehnat-muhofazasi-description', 'Повышение знаний о правах и обязанностях сотрудников, социальной защите и охране труда на основе законодательства Узбекистана.', 'Building knowledge of employee rights and responsibilities, social protection and occupational safety under Uzbekistan’s legislation.'],
    ['.contact-section .section-label', 'Контакты', 'Contact'],
    ['.contact-section h2', 'Связаться', 'Get in touch'],
    ['footer .container', '© Хайрулло Комилов', '© Xayrullo Komilov']
  ].map(([selector, ru, en]) => {
    const element = document.querySelector(selector);
    // Preserve arrow spans in action links when changing their text.
    const node = element.firstChild;
    return { node, uz: node.textContent, ru, en };
  });
  const ui = {
    uz: { light: '☀ Kunduzgi', dark: '☾ Tungi', lightLabel: 'Kunduzgi mavzuga o‘tish', darkLabel: 'Tungi mavzuga o‘tish', language: 'Sayt tili', nav: 'Asosiy menyu', home: 'Xayrullo Komilov, bosh sahifa', logo: 'Xayrullo Komilov logotipi', name: ['Xayrullo', 'Komilov'], title: document.title, description: document.querySelector('meta[name="description"]').content },
    ru: { light: '☀ Светлая', dark: '☾ Тёмная', lightLabel: 'Включить светлую тему', darkLabel: 'Включить тёмную тему', language: 'Язык сайта', nav: 'Главное меню', home: 'Хайрулло Комилов, главная', logo: 'Логотип Хайрулло Комилова', name: ['Хайрулло', 'Комилов'], title: 'Хайрулло Комилов — эпидемиолог-гигиенист', description: 'Хайрулло Комилов — врач санитарно-эпидемиологической службы с 43-летним опытом, врач-бактериолог высшей категории.' },
    en: { light: '☀ Light', dark: '☾ Dark', lightLabel: 'Switch to light theme', darkLabel: 'Switch to dark theme', language: 'Site language', nav: 'Main navigation', home: 'Xayrullo Komilov, home', logo: 'Xayrullo Komilov logo', name: ['Xayrullo', 'Komilov'], title: 'Xayrullo Komilov — Epidemiologist and hygienist', description: 'Xayrullo Komilov — physician with 43 years of experience in the sanitary and epidemiological service and a bacteriologist with the highest qualification category.' }
  };
  let language = 'uz';
  try {
    const saved = localStorage.getItem('xk-language');
    if (Object.prototype.hasOwnProperty.call(ui, saved)) language = saved;
  } catch (_) {}
  function updateTheme() {
    const light = document.documentElement.dataset.theme === 'light';
    button.innerHTML = light
      ? '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"/></svg>'
      : '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>';
    button.title = light ? ui[language].darkLabel : ui[language].lightLabel;
    button.setAttribute('aria-label', light ? ui[language].darkLabel : ui[language].lightLabel);
    button.setAttribute('aria-pressed', String(light));
    meta.setAttribute('content', light ? '#f6f7f8' : '#0d0d0e');
  }
  function updateLanguage() {
    document.documentElement.lang = language;
    languageSelect.value = language;
    entries.forEach(entry => { entry.node.textContent = entry[language] + (entry.node.parentNode.classList.contains('button') && language !== 'uz' ? ' ' : ''); });
    const text = ui[language];
    document.getElementById('hero-title').replaceChildren(text.name[0], document.createElement('br'), text.name[1]);
    document.title = text.title;
    document.querySelector('meta[name="description"]').content = text.description;
    languageSelect.setAttribute('aria-label', text.language);
    document.querySelector('.nav-links').setAttribute('aria-label', text.nav);
    document.querySelector('.monogram').setAttribute('aria-label', text.home);
    document.querySelector('.site-logo').alt = text.logo;
    updateTheme();
  }
  languageSelect.addEventListener('change', function () {
    if (!Object.prototype.hasOwnProperty.call(ui, languageSelect.value)) return;
    language = languageSelect.value;
    try { localStorage.setItem('xk-language', language); } catch (_) {}
    updateLanguage();
  });
  button.addEventListener('click', function () {
    const light = document.documentElement.dataset.theme !== 'light';
    if (light) document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem('xk-theme', light ? 'light' : 'dark'); } catch (_) {}
    updateTheme();
  });
  updateLanguage();
  // Keep section titles below the sticky header when jumping from the menu.
  const header = document.querySelector('.site-header');
  function updateScrollOffset() {
    document.documentElement.style.scrollPaddingTop = header.offsetHeight + 'px';
  }
  updateScrollOffset();
  new ResizeObserver(updateScrollOffset).observe(header);
})();
