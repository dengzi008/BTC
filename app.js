const stages = [
  {
    order: '第一层',
    realm: '练气期',
    btc: 0.1,
    breakthrough: '破境箴言 · 先求稳定活下来，再求稳定赚下来。',
    summary: '先建立第一桶可验证资产。用低风险、可复制、可持续的内容模型，把执行力和稳定收益打磨出来。',
    nodeLabel: '0.1 BTC',
    projects: [
      {
        icon: '📜',
        title: '币安广场内容挖矿',
        desc: '围绕热点、观点、情绪和交易叙事进行持续输出，把内容分发能力沉淀成稳定收益。',
        tag: '内容心法 · 已启动'
      },
      {
        icon: '🔥',
        title: 'OK星球创作者',
        desc: '借助平台创作者身份积累曝光和信任，让影响力成为后续更多模型的放大器。',
        tag: '流量心法 · 已启动'
      }
    ]
  },
  {
    order: '第二层',
    realm: '筑基期',
    btc: 1,
    breakthrough: '破境箴言 · 从单点赚钱，进化到系统赚钱。',
    summary: '站上 1 BTC，重点不再只是“做”，而是形成系统，开始放大内容、流量与变现闭环。',
    nodeLabel: '1 BTC',
    projects: []
  },
  {
    order: '第三层',
    realm: '金丹期',
    btc: 5,
    breakthrough: '破境箴言 · 让影响力、资产和机会彼此生长。',
    summary: '到 5 BTC，要求模型具备飞轮特性：品牌、资源、流量、现金流开始互相喂养。',
    nodeLabel: '5 BTC',
    projects: []
  },
  {
    order: '第四层',
    realm: '元婴期',
    btc: 10,
    breakthrough: '破境箴言 · 守住本金，放大复利，主宰节奏。',
    summary: '10 BTC 是复利加速点。此时追求的是更稳的底层资产，更强的影响力，和更大的机会密度。',
    nodeLabel: '10 BTC',
    projects: []
  }
];

const ladderEl = document.getElementById('ladder');
const btcUsdEl = document.getElementById('btc-usd');
const usdCnyEl = document.getElementById('usd-cny');
const priceStatusEl = document.getElementById('price-status');
const ladderProgressEl = document.getElementById('ladder-progress');

function money(value, currency, locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(value);
}

function renderStages() {
  ladderEl.innerHTML = stages.map((stage) => {
    const projectMarkup = stage.projects.length
      ? stage.projects.map((project) => `
        <article class="project-card">
          <div class="project-icon">${project.icon}</div>
          <h4>${project.title}</h4>
          <p>${project.desc}</p>
          <span class="project-tag">${project.tag}</span>
        </article>
      `).join('')
      : `
        <article class="empty-card">
          <div class="project-icon">✨</div>
          <h4>待补全的秘籍位</h4>
          <p>这一境界的具体赚钱项目先留白，等你后面把已验证的模型放进来。</p>
          <span class="project-tag">未显化</span>
        </article>
      `;

    return `
      <section class="stage-card" data-btc="${stage.btc}">
        <article class="stage-card-panel">
          <div class="stage-header">
            <div>
              <span class="stage-order">${stage.order}</span>
              <h3>${stage.realm}</h3>
            </div>
            <div class="stage-target">
              <strong>${stage.btc} BTC</strong>
              <span>目标财富等级</span>
            </div>
          </div>

          <div class="stage-content">
            <p class="breakthrough-line">${stage.breakthrough}</p>
            <p>${stage.summary}</p>
          </div>

          <div class="stage-valuations">
            <div class="value-box">
              <span>对应美元价值</span>
              <strong class="usd-value">--</strong>
            </div>
            <div class="value-box">
              <span>对应人民币价值</span>
              <strong class="cny-value">--</strong>
            </div>
          </div>

          <div class="project-grid">${projectMarkup}</div>
        </article>

        <div class="stage-node">
          <span>${stage.nodeLabel}</span>
        </div>
      </section>
    `;
  }).join('');
}

async function updatePrices() {
  const cards = Array.from(document.querySelectorAll('.stage-card'));

  try {
    const [btcRes, fxRes] = await Promise.all([
      fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT'),
      fetch('https://open.er-api.com/v6/latest/USD')
    ]);

    if (!btcRes.ok || !fxRes.ok) throw new Error('price fetch failed');

    const btcData = await btcRes.json();
    const fxData = await fxRes.json();

    const btcUsd = Number(btcData.price);
    const usdCny = Number(fxData?.rates?.CNY);

    if (!btcUsd || !usdCny) throw new Error('invalid price data');

    btcUsdEl.textContent = money(btcUsd, 'USD');
    usdCnyEl.textContent = `¥${usdCny.toFixed(4)}`;

    cards.forEach((card) => {
      const btc = Number(card.dataset.btc);
      const usd = btc * btcUsd;
      const cny = usd * usdCny;

      card.querySelector('.usd-value').textContent = money(usd, 'USD');
      card.querySelector('.cny-value').textContent = money(cny, 'CNY', 'zh-CN');
    });

    const now = new Date();
    priceStatusEl.innerHTML = `<span class="price-updated">已更新</span> · ${now.toLocaleString('zh-CN', { hour12: false })}`;
  } catch (error) {
    console.error(error);
    btcUsdEl.textContent = '获取失败';
    usdCnyEl.textContent = '获取失败';
    priceStatusEl.textContent = '行情接口暂时不可用';

    cards.forEach((card) => {
      card.querySelector('.usd-value').textContent = '--';
      card.querySelector('.cny-value').textContent = '--';
    });
  }
}

function setupStageReveal() {
  const cards = Array.from(document.querySelectorAll('.stage-card'));

  const updateRailProgress = () => {
    if (!cards.length || !ladderProgressEl) return;

    const visibleCards = cards.filter((card) => card.classList.contains('is-visible'));
    if (!visibleCards.length) {
      ladderProgressEl.style.height = '0%';
      return;
    }

    const lastVisible = visibleCards[visibleCards.length - 1];
    const wrapRect = ladderEl.getBoundingClientRect();
    const nodeRect = lastVisible.querySelector('.stage-node').getBoundingClientRect();
    const progress = ((nodeRect.top + nodeRect.height / 2) - wrapRect.top) / wrapRect.height;
    const safeProgress = Math.max(0, Math.min(progress, 1));
    ladderProgressEl.style.height = `${safeProgress * 100}%`;
  };

  if (!('IntersectionObserver' in window)) {
    cards.forEach((card) => card.classList.add('is-visible'));
    updateRailProgress();
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
      updateRailProgress();
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px'
  });

  cards.forEach((card, index) => {
    card.style.transitionDelay = `${index * 120}ms`;
    observer.observe(card);
  });

  window.addEventListener('resize', updateRailProgress);
}

renderStages();
setupStageReveal();
updatePrices();
setInterval(updatePrices, 60000);
