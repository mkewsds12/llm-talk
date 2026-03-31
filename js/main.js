// ===== Sections & Nav Dots =====
const sections = document.querySelectorAll('.section');
const navDotsContainer = document.getElementById('navDots');
const progressBar = document.getElementById('progressBar');
const coverDate = document.getElementById('coverDate');

if (coverDate) {
  const now = new Date();
  coverDate.textContent = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月`;
}

sections.forEach((s, i) => {
  const dot = document.createElement('button');
  dot.className = 'nav-dot';
  dot.title = s.id;
  dot.addEventListener('click', () => s.scrollIntoView({ behavior: 'smooth' }));
  navDotsContainer.appendChild(dot);
});

// ===== Scroll Observer for Active Dot & Progress =====
function updateProgress() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const idx = Array.from(sections).indexOf(e.target);
      document.querySelectorAll('.nav-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => observer.observe(s));
window.addEventListener('scroll', updateProgress, { passive: true });

// ===== Fade-in on Scroll =====
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in, .fade-in-left').forEach(el => fadeObserver.observe(el));

// ===== Keyboard Navigation =====
document.addEventListener('keydown', (e) => {
  const dots = document.querySelectorAll('.nav-dot');
  let cur = Array.from(dots).findIndex(d => d.classList.contains('active'));
  if (cur === -1) cur = 0;
  if ((e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') && cur < sections.length - 1) {
    e.preventDefault(); sections[cur + 1].scrollIntoView({ behavior: 'smooth' });
  } else if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') && cur > 0) {
    e.preventDefault(); sections[cur - 1].scrollIntoView({ behavior: 'smooth' });
  }
});

// ===== 鼠标跟随光效 (Card Spotlight) =====
document.querySelectorAll('.card').forEach(card => {
  const glow = document.createElement('div');
  glow.className = 'card-glow';
  card.prepend(glow);
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glow.style.background = `radial-gradient(350px circle at ${x}px ${y}px, rgba(99,102,241,0.12), transparent 60%)`;
  });
});

// ===== 卡片 fade-in 也加 visible (补丁) =====
document.querySelectorAll('.cards-grid .card').forEach(el => {
  if (!el.classList.contains('fade-in')) { el.classList.add('fade-in'); fadeObserver.observe(el); }
});

// ===== Starfield Canvas =====
(function() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, stars = [];
  function resize() { w = canvas.width = canvas.offsetWidth; h = canvas.height = canvas.offsetHeight; }
  function init() {
    resize(); stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.5 + 0.3, speed: Math.random() * 0.3 + 0.05, alpha: Math.random() * 0.8 + 0.2 });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    stars.forEach(s => {
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${s.alpha})`; ctx.fill();
      s.y -= s.speed; if (s.y < -2) { s.y = h + 2; s.x = Math.random() * w; }
      s.alpha += (Math.random() - 0.5) * 0.02;
      s.alpha = Math.max(0.1, Math.min(0.9, s.alpha));
    });
    requestAnimationFrame(draw);
  }
  init(); draw();
  window.addEventListener('resize', resize);
})();

// ===== Paper Modal =====
const papers = {
  attention: {
    title: 'Attention Is All You Need (2017)',
    desc: 'Transformer架构的开山之作。Vaswani等人提出了完全基于注意力机制的序列模型，抛弃了RNN和CNN，奠定了现代大模型的基础。',
    arxiv: 'https://arxiv.org/abs/1706.03762',
    pdf: 'https://arxiv.org/pdf/1706.03762'
  },
  bert: {
    title: 'BERT: Pre-training of Deep Bidirectional Transformers (2018)',
    desc: 'Google提出的双向预训练模型，在11项NLP任务上刷新纪录。开创了"预训练+微调"的大模型范式。',
    arxiv: 'https://arxiv.org/abs/1810.04805',
    pdf: 'https://arxiv.org/pdf/1810.04805'
  },
  gpt2: {
    title: 'Language Models are Unsupervised Multitask Learners (GPT-2, 2019)',
    desc: 'OpenAI 15亿参数模型，首次证明语言模型可以零样本完成多种任务。因"太危险"而延迟发布，引发AI安全讨论。',
    arxiv: 'https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf',
    pdf: 'https://cdn.openai.com/better-language-models/language_models_are_unsupervised_multitask_learners.pdf'
  },
  gpt3: {
    title: 'Language Models are Few-Shot Learners (GPT-3, 2020)',
    desc: 'OpenAI的1750亿参数模型，证明了"规模就是一切"大模型不需要微调，给几个例子就能完成各种任务。',
    arxiv: 'https://arxiv.org/abs/2005.14165',
    pdf: 'https://arxiv.org/pdf/2005.14165'
  },
  rlhf: {
    title: 'Training language models to follow instructions with human feedback (InstructGPT, 2022)',
    desc: 'OpenAI 提出 RLHF（人类反馈强化学习），让语言模型学会"听人话"。ChatGPT 的核心技术基础，开启了对齐(Alignment)时代。',
    arxiv: 'https://arxiv.org/abs/2203.02155',
    pdf: 'https://arxiv.org/pdf/2203.02155'
  },
  chinchilla: {
    title: 'Training Compute-Optimal Large Language Models (Chinchilla, 2022)',
    desc: 'DeepMind 提出"计算最优缩放定律"：模型参数和训练数据应等比增长。证明了许多大模型其实训练不足/参数过多，对后续所有模型训练策略产生深远影响。',
    arxiv: 'https://arxiv.org/abs/2203.15556',
    pdf: 'https://arxiv.org/pdf/2203.15556'
  },
  llama: {
    title: 'LLaMA: Open and Efficient Foundation Language Models (2023)',
    desc: 'Meta 开源的高效基础模型系列（7B-65B），以较小参数量达到接近GPT-3.5的性能。引爆了开源大模型生态，催生了Alpaca、Vicuna等众多衍生模型。',
    arxiv: 'https://arxiv.org/abs/2302.13971',
    pdf: 'https://arxiv.org/pdf/2302.13971'
  },
  gpt4: {
    title: 'GPT-4 Technical Report (2023)',
    desc: 'OpenAI 的多模态大模型，在律师考试、数学竞赛等测试中达到人类顶尖水平。首次实现图文混合理解，标志着通用人工智能的重要一步。',
    arxiv: 'https://arxiv.org/abs/2303.08774',
    pdf: 'https://arxiv.org/pdf/2303.08774'
  },
  deepseekv3: {
    title: 'DeepSeek-V3 Technical Report (2024)',
    desc: '中国团队 DeepSeek 发布的 671B MoE 模型，以极低训练成本（557万美元）达到 GPT-4o 水平。采用 FP8 训练和 MLA 注意力，证明了高效训练路线的可行性。',
    arxiv: 'https://arxiv.org/abs/2412.19437',
    pdf: 'https://arxiv.org/pdf/2412.19437'
  }
};

function openPaper(key) {
  const p = papers[key]; if (!p) return;
  document.getElementById('paperTitle').textContent = p.title;
  document.getElementById('paperDesc').textContent = p.desc;
  const linksDiv = document.getElementById('paperLinks');
  linksDiv.innerHTML = `<a class="paper-btn" href="${p.arxiv}" target="_blank" rel="noopener"> arXiv 页面</a><a class="paper-btn" href="${p.pdf}" target="_blank" rel="noopener"> 下载 PDF</a>`;
  document.getElementById('paperModal').classList.add('active');
}
function closePaper() { document.getElementById('paperModal').classList.remove('active'); }
document.getElementById('paperModal').addEventListener('click', function(e) { if (e.target === this) closePaper(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePaper(); });

// ===== Agent Code Demo Animation =====
(function() {
  const codeDemo = document.getElementById('agentCodeDemo');
  const outputDemo = document.getElementById('agentOutputDemo');
  if (!codeDemo) return;
  let animated = false;

  function parseSegments(html) {
    const segs = [];
    let i = 0;
    while (i < html.length) {
      if (html[i] === '<') {
        const end = html.indexOf('>', i);
        segs.push({ type: 'tag', value: html.substring(i, end + 1) });
        i = end + 1;
      } else {
        segs.push({ type: 'char', value: html[i] });
        i++;
      }
    }
    return segs;
  }

  function buildHTML(segments, charCount) {
    let html = '', chars = 0, done = false;
    for (const seg of segments) {
      if (done) break;
      if (seg.type === 'tag') {
        html += seg.value;
      } else {
        chars++;
        if (chars <= charCount) html += seg.value;
        if (chars === charCount) done = true;
      }
    }
    return html;
  }

  function typewriteLines(lines, onDone) {
    const CHAR_DELAY = 45;
    const LINE_PAUSE = 350;
    let lineIdx = 0;
    const originals = Array.from(lines).map(l => l.innerHTML);
    lines.forEach(l => { l.innerHTML = ''; });
    const caret = document.createElement('span');
    caret.className = 'typing-caret';

    function nextLine() {
      if (lineIdx >= lines.length) {
        caret.remove();
        if (onDone) onDone();
        return;
      }
      const line = lines[lineIdx];
      const original = originals[lineIdx];
      line.classList.add('show');

      if (!original || original.trim() === '') {
        line.innerHTML = original;
        lineIdx++;
        setTimeout(nextLine, LINE_PAUSE * 0.5);
        return;
      }

      const segments = parseSegments(original);
      const totalChars = segments.filter(s => s.type === 'char').length;
      let charIdx = 0;

      function typeChar() {
        charIdx++;
        if (charIdx > totalChars) {
          line.innerHTML = original;
          lineIdx++;
          setTimeout(nextLine, LINE_PAUSE);
          return;
        }
        line.innerHTML = buildHTML(segments, charIdx);
        line.appendChild(caret);
        setTimeout(typeChar, CHAR_DELAY);
      }
      typeChar();
    }
    nextLine();
  }

  const trigger = document.getElementById('codeAnimTrigger');
  const demoObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !animated) {
        animated = true;
        const codeLines = codeDemo.querySelectorAll('.line');
        typewriteLines(codeLines, () => {
          const outLines = outputDemo.querySelectorAll('.out-line');
          outLines.forEach((line, i) => {
            setTimeout(() => line.classList.add('show'), 600 + i * 800);
          });
        });
      }
    });
  }, { threshold: 1.0 });
  demoObserver.observe(trigger || codeDemo);
})();
