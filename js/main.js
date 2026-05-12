// ===== Lucide Icon Init =====
if (typeof lucide !== 'undefined' && lucide && typeof lucide.createIcons === 'function') {
  lucide.createIcons();
}

// ===== Sections, Headings & Navigation =====
const sections = Array.from(document.querySelectorAll('.section'));
const coverDate = document.getElementById('coverDate');
const topNav = document.getElementById('topNav');
const topNavLinks = Array.from(document.querySelectorAll('.top-nav-link[data-target]'));
const topNavCta = document.querySelector('.top-nav-cta[data-target]');
const brandChip = document.querySelector('.brand-chip[data-target]');
var activeSectionIndex = 0;

if (coverDate) {
  var now = new Date();
  coverDate.textContent = now.getFullYear() + ' 年 ' + (now.getMonth() + 1) + ' 月';
}

function scrollToSection(section) {
  if (!section) return;
  var navHeight = topNav ? topNav.offsetHeight : 0;
  var top = section.getBoundingClientRect().top + window.pageYOffset - navHeight - 10;
  window.scrollTo({ top: top, behavior: 'smooth' });
}

var headingConfig = {
  's1-timeline': { kicker: 'Foundation Track', accent: '前世今生' },
  's1-transformer': { kicker: 'Core Mechanism', accent: 'Transformer' },
  's1-essence': { kicker: 'Model Basics', accent: '本质' },
  's1-agent': { kicker: 'Agent System', accent: 'Agent（智能体）' },
  's1-concepts': { kicker: 'Key Concepts', accent: '基础篇' },
  's1-concepts2': { kicker: 'Key Concepts', accent: '进阶篇' },
  's1-compare': { kicker: 'Model Landscape', accent: '中美大模型' },
  's2-apps': { kicker: 'Application Map', accent: '能做什么' },
  's2-office-ai': { kicker: 'Productivity Suite', accent: '办公软件' },
  's3-resources': { kicker: 'Toolkit', accent: '工具篇' },
  's3-resources2': { kicker: 'Developer Path', accent: '开发与学习' },
  's3-security': { kicker: 'AI Security', accent: '暗面' },
  's4-summary': { kicker: 'Takeaways', accent: '总结' }
};

function buildSplitTitle(titleEl, accentText) {
  if (!titleEl || titleEl.dataset.splitApplied === '1') return;
  var raw = titleEl.textContent.trim().replace(/\s+/g, ' ');
  if (!raw) return;

  var accent = accentText || '';
  var main = raw;

  if (!accent) {
    var splitByColon = raw.split(/[：:]/);
    if (splitByColon.length > 1) {
      main = splitByColon[0].trim();
      accent = splitByColon.slice(1).join('：').trim();
    }
  }

  if (accent && raw.indexOf(accent) >= 0) {
    main = raw.replace(accent, '').replace(/[：:，,。！？?!、\s]+$/, '').trim();
  }

  if (!accent || accent === main) accent = '';
  if (!main) main = raw;

  titleEl.innerHTML = '';
  var mainSpan = document.createElement('span');
  mainSpan.className = 'title-main';
  mainSpan.textContent = main;
  var accentSpan = document.createElement('span');
  accentSpan.className = 'title-accent';
  accentSpan.textContent = accent;

  titleEl.appendChild(mainSpan);
  if (accentSpan.textContent) {
    titleEl.appendChild(accentSpan);
  }
  titleEl.dataset.splitApplied = '1';
}

function ensureCoverTitleSplit() {
  var coverTitle = document.querySelector('.cover-title');
  if (!coverTitle) return;
  if (!coverTitle.querySelector('.cover-title-main')) {
    var text = coverTitle.textContent.trim();
    coverTitle.innerHTML = '<span class="cover-title-main">' + text + '</span><span class="cover-title-accent">LLM 实战图谱</span>';
  }
}

function enhanceSectionHeadings() {
  sections.forEach(function(section) {
    var title = section.querySelector('.section-title');
    if (!title) return;

    var cfg = headingConfig[section.id] || {};
    buildSplitTitle(title, cfg.accent || '');

    if (cfg.kicker && !section.querySelector('.section-kicker')) {
      var kicker = document.createElement('div');
      kicker.className = 'section-kicker fade-in';
      kicker.textContent = cfg.kicker;
      title.parentNode.insertBefore(kicker, title);
    }
  });
}

ensureCoverTitleSplit();
enhanceSectionHeadings();

topNavLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    var targetId = link.getAttribute('data-target');
    var target = document.getElementById(targetId);
    scrollToSection(target);
  });
});

if (brandChip) {
  brandChip.addEventListener('click', function() {
    var targetId = brandChip.getAttribute('data-target');
    var target = document.getElementById(targetId);
    scrollToSection(target);
  });
}

if (topNavCta) {
  topNavCta.addEventListener('click', function() {
    var targetId = topNavCta.getAttribute('data-target');
    var target = document.getElementById(targetId);
    scrollToSection(target);
  });
}

document.querySelectorAll('.hero-btn[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var id = link.getAttribute('href').slice(1);
    var target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    scrollToSection(target);
  });
});

function resolveNavTarget(sectionId) {
  if (!sectionId) return sectionId;
  if (sectionId === 'cover') return 'cover';

  if (sectionId.indexOf('s1-') === 0) {
    if (sectionId === 's1-transformer') return 's1-transformer';
    if (sectionId === 's1-agent') return 's1-agent';
    return 's1-timeline';
  }

  if (sectionId.indexOf('s2-') === 0) return 's1-agent';
  if (sectionId.indexOf('s3-') === 0) return 's3-resources';
  if (sectionId.indexOf('s4-') === 0 || sectionId.indexOf('s5-') === 0) return 's3-resources';

  return sectionId;
}

function syncTopNavActive(sectionId) {
  var mappedId = resolveNavTarget(sectionId);
  topNavLinks.forEach(function(link) {
    link.classList.toggle('active', link.getAttribute('data-target') === mappedId);
  });
}

syncTopNavActive('cover');

var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (!e.isIntersecting) return;
    var idx = sections.indexOf(e.target);
    if (idx < 0) return;
    activeSectionIndex = idx;
    syncTopNavActive(e.target.id);
  });
}, { threshold: 0.42 });

sections.forEach(function(s) { observer.observe(s); });

// ===== Fade-in on Scroll =====
var fadeObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.fade-in, .fade-in-left').forEach(function(el) {
  fadeObserver.observe(el);
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', function(e) {
  var cur = activeSectionIndex;
  if ((e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === 'PageDown') && cur < sections.length - 1) {
    e.preventDefault();
    scrollToSection(sections[cur + 1]);
  } else if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft' || e.key === 'PageUp') && cur > 0) {
    e.preventDefault();
    scrollToSection(sections[cur - 1]);
  }
});

// ===== Card fade-in patches =====
document.querySelectorAll('.cards-grid .card').forEach(function(el) {
  if (!el.classList.contains('fade-in')) {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
  }
});

// ===== Aurora Ambient Particles =====
(function() {
  var canvas = document.getElementById('starfield');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var w, h, particles = [];

  function resize() {
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
  }
  function init() {
    resize();
    particles = [];
    for (var i = 0; i < 56; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.4,
        speed: Math.random() * 0.12 + 0.03,
        alpha: Math.random() * 0.2 + 0.06,
        hue: Math.random() > 0.64 ? '117,49,255' : (Math.random() > 0.45 ? '0,163,173' : '93,216,226'),
        phase: Math.random() * Math.PI * 2
      });
    }
  }
  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(function(p) {
      p.phase += 0.008;
      var a = p.alpha * (0.6 + 0.4 * Math.sin(p.phase));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + p.hue + ',' + a + ')';
      ctx.fill();
      p.x += Math.sin(p.phase) * 0.18;
      p.y -= p.speed;
      if (p.x > w + 6) p.x = -6;
      if (p.x < -6) p.x = w + 6;
      if (p.y < -6) { p.y = h + 6; p.x = Math.random() * w; }
    });
    requestAnimationFrame(draw);
  }
  init();
  draw();
  window.addEventListener('resize', resize);
})();

// ===== Paper Modal =====
var papers = {
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
  var p = papers[key];
  if (!p) return;
  document.getElementById('paperTitle').textContent = p.title;
  document.getElementById('paperDesc').textContent = p.desc;
  var linksDiv = document.getElementById('paperLinks');
  linksDiv.innerHTML = '<a class="paper-btn" href="' + p.arxiv + '" target="_blank" rel="noopener">arXiv 页面</a> <a class="paper-btn secondary" href="' + p.pdf + '" target="_blank" rel="noopener">下载 PDF</a>';
  document.getElementById('paperModal').classList.add('active');
}

function closePaper() {
  document.getElementById('paperModal').classList.remove('active');
}

document.getElementById('paperModal').addEventListener('click', function(e) {
  if (e.target === this) closePaper();
});
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closePaper();
});

// ===== Agent Code Demo Animation =====
(function() {
  var codeDemo = document.getElementById('agentCodeDemo');
  var outputDemo = document.getElementById('agentOutputDemo');
  if (!codeDemo) return;
  var animated = false;

  function parseSegments(html) {
    var segs = [];
    var i = 0;
    while (i < html.length) {
      if (html[i] === '<') {
        var end = html.indexOf('>', i);
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
    var html = '', chars = 0, done = false;
    for (var i = 0; i < segments.length; i++) {
      if (done) break;
      var seg = segments[i];
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
    var CHAR_DELAY = 45;
    var LINE_PAUSE = 350;
    var lineIdx = 0;
    var originals = [];
    for (var i = 0; i < lines.length; i++) {
      originals.push(lines[i].innerHTML);
      lines[i].innerHTML = '';
    }
    var caret = document.createElement('span');
    caret.className = 'typing-caret';

    function nextLine() {
      if (lineIdx >= lines.length) {
        caret.remove();
        if (onDone) onDone();
        return;
      }
      var line = lines[lineIdx];
      var original = originals[lineIdx];
      line.classList.add('show');

      if (!original || original.trim() === '') {
        line.innerHTML = original;
        lineIdx++;
        setTimeout(nextLine, LINE_PAUSE * 0.5);
        return;
      }

      var segments = parseSegments(original);
      var totalChars = 0;
      for (var i = 0; i < segments.length; i++) {
        if (segments[i].type === 'char') totalChars++;
      }
      var charIdx = 0;

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

  var trigger = document.getElementById('codeAnimTrigger');
  var demoObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting && !animated) {
        animated = true;
        var codeLines = codeDemo.querySelectorAll('.line');
        typewriteLines(codeLines, function() {
          var outLines = outputDemo.querySelectorAll('.out-line');
          outLines.forEach(function(line, i) {
            setTimeout(function() { line.classList.add('show'); }, 600 + i * 800);
          });
        });
      }
    });
  }, { threshold: 1.0 });
  demoObserver.observe(trigger || codeDemo);
})();
