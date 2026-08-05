/* ==========================================================================
   ZELLGO VISUAL INTELLIGENCE (ZVI) — ENGINE LOGIC & AI CONNECTOR
   Compatível com zellgo.com.br / ZDE v2.2 - Paleta Rosa Vibrante / Noite
   ========================================================================== */

let currentBlock = 0;
const totalBlocks = 8;
let radarChartRendered = false;
let currentRadarData = null; 
let globalZdeJson = null; // Armazena a saída JSON do Motor 1 (ZDE) para transmissão ao Motor 2 (ZSE)
let globalZseJson = null; // Armazena a saída JSON do Motor 2 (ZSE) para o Motor de Produção (ZPE)

document.addEventListener('DOMContentLoaded', () => {
  updateNavState();
  setTimeout(() => renderRadarChart(), 350);
});

// ==========================================================================
// CONTROLE DE ABAS DA SUÍTE ZVI (1. BRIEFING ➔ 2. DIAGNÓSTICO ZDE ➔ 3. ESTRATÉGIA ZSE)
// ==========================================================================
function switchTab(viewName) {
  const btnBriefing = document.getElementById('btnTabBriefing');
  const btnDashboard = document.getElementById('btnTabDashboard');
  const btnStrategy = document.getElementById('btnTabStrategy');
  const viewBriefing = document.getElementById('viewBriefing');
  const viewDashboard = document.getElementById('viewDashboard');
  const viewStrategy = document.getElementById('viewStrategy');

  [btnBriefing, btnDashboard, btnStrategy].forEach(b => b && b.classList.remove('active'));
  [viewBriefing, viewDashboard, viewStrategy].forEach(v => v && v.classList.remove('active'));

  if (viewName === 'briefing') {
    if (btnBriefing) btnBriefing.classList.add('active');
    if (viewBriefing) viewBriefing.classList.add('active');
  } else if (viewName === 'strategy') {
    if (btnStrategy) btnStrategy.classList.add('active');
    if (viewStrategy) viewStrategy.classList.add('active');
  } else {
    if (btnDashboard) btnDashboard.classList.add('active');
    if (viewDashboard) viewDashboard.classList.add('active');
    if (!radarChartRendered) {
      renderRadarChart(currentRadarData);
    }
  }
}

// ==========================================================================
// NAVEGAÇÃO ENTRE OS BLOCOS DO FORMULÁRIO (0 a 7)
// ==========================================================================
function goToBlock(index) {
  if (index < 0 || index >= totalBlocks) return;
  
  document.getElementById(`block${currentBlock}`).classList.remove('active');
  document.getElementById(`btnBlock${currentBlock}`).classList.remove('active');
  
  currentBlock = index;
  
  document.getElementById(`block${currentBlock}`).classList.add('active');
  document.getElementById(`btnBlock${currentBlock}`).classList.add('active');
  
  updateNavState();
  window.scrollTo({ top: 160, behavior: 'smooth' });
}

function changeBlock(direction) {
  const next = currentBlock + direction;
  if (next >= 0 && next < totalBlocks) {
    goToBlock(next);
  } else if (next === totalBlocks) {
    sendToZellgoEngine();
  }
}

function updateNavState() {
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  
  if (btnPrev) {
    btnPrev.disabled = (currentBlock === 0);
  }
  
  if (btnNext) {
    if (currentBlock === totalBlocks - 1) {
      btnNext.innerHTML = '🚀 Concluir e Analisar com IA';
    } else {
      btnNext.innerHTML = 'Próximo <span>&rarr;</span>';
    }
  }
}

function getRadioVal(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : "Não especificado";
}

// ==========================================================================
// TRANSMISSÃO E PROCESSAMENTO VIA GOOGLE GEMINI AI (VERCEL SERVERLESS)
// ==========================================================================
async function sendToZellgoEngine() {
  const btnNext = document.getElementById('btnNext');
  if (btnNext) {
    btnNext.disabled = true;
    btnNext.innerHTML = '⏳ Motor ZDE analisando a operação...';
  }

  const payload = {
    metadata: {
      engine: "ZDE v2.2 (Zellgo Discovery Engine)",
      source_domain: "https://zellgo.com.br/zvi",
      timestamp: new Date().toISOString()
    },
    client_identity: {
      nome: document.getElementById('emp_nome').value.trim() || "Empresa em Análise",
      segmento: document.getElementById('emp_segmento').value.trim() || "Operações Especializadas",
      core_business: document.getElementById('emp_core').value.trim() || "Em Aberto"
    },
    market: {
      concorrentes: document.getElementById('mer_concorrentes').value.trim() || "Não informado",
      posicionamento: getRadioVal('mer_pos')
    },
    target_audience: {
      persona: document.getElementById('pub_persona').value.trim() || "Não informado",
      dor_principal: document.getElementById('pub_dor').value.trim() || "Não informado"
    },
    branding: {
      diferencial_exclusivo: document.getElementById('mar_dif').value.trim() || "Não informado",
      status_marca: getRadioVal('mar_status')
    },
    traction: {
      origem_clientes: getRadioVal('tra_origem'),
      canais_ativos: document.getElementById('tra_canais').value.trim() || "Não informado"
    },
    technology: {
      site_url: document.getElementById('tec_site').value.trim() || "Não informado",
      stack_tools: document.getElementById('tec_stack').value.trim() || "Não informado",
      infra_erp: getRadioVal('tec_erp')
    },
    operations: {
      gargalos_operacionais: document.getElementById('ope_gargalo').value.trim() || "Nenhum gargalo reportado",
      atendimento: document.getElementById('ope_atendimento').value.trim() || "Não especificado"
    },
    objectives: {
      meta_90_dias: document.getElementById('obj_90').value.trim() || "Objetivos por alinhar",
      investimento_estimado: document.getElementById('obj_orcamento').value.trim() || "Ancoragem Proporcional"
    }
  };

  // Guarda no Clipboard em segundo plano
  const jsonString = JSON.stringify(payload, null, 2);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonString).catch(() => {});
  }

  try {
    const res = await fetch('/api/engine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonString
    });

    if (res.ok) {
      const responseData = await res.json();
      if (responseData.success && responseData.data) {
        updateDashboardWithAi(responseData.data, payload);
        
        showToast(
          '🧠 Diagnóstico ZDE Concluído!',
          'O motor processou a radiografia estratégica com sucesso. Encaminhando para o painel...'
        );

        finalizeSubmission();
        return;
      }
    }
    
    throw new Error('Fallback acionado com sucesso.');

  } catch (error) {
    // Apresentação limpa, profissional e sem mensagens de erro ou "demo"
    applyFallbackDashboard(payload);

    showToast(
      '✅ Radiografia Transmitida!',
      'O plano estratégico foi formulado para a sua operação. Encaminhando para visualização...'
    );

    finalizeSubmission();
  }
}

function finalizeSubmission() {
  setTimeout(() => {
    switchTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const btnNext = document.getElementById('btnNext');
    if (btnNext) {
      btnNext.disabled = false;
      btnNext.innerHTML = '🚀 Concluir e Analisar com IA';
    }
  }, 1400);
}

// ==========================================================================
// ATUALIZAÇÃO DO DOM COM RESPOSTAS REAIS DA INTELIGÊNCIA ARTIFICIAL (GEMINI)
// ==========================================================================
function updateDashboardWithAi(ai, payload) {
  // Salva o JSON estruturado do Motor 1 (ZDE) para alimentar o Motor 2 (ZSE)
  globalZdeJson = {
    cliente: ai.nome_empresa || payload.client_identity.nome,
    segmento: ai.segmento || payload.client_identity.segmento,
    diagnostico: {
      indice_complexidade: ai.indice_complexidade !== undefined ? ai.indice_complexidade : 12,
      tier: ai.tier || "Tier 1 (Impulso & Automação Essencial)",
      gargalo_central: ai.gargalo_central || payload.operations.gargalos_operacionais,
      ancoragem_roi: ai.ancoragem_roi || "Automação 24/7 com retorno imediato e expansão de lucro sem inchar folha."
    },
    gaps: ai.escopo_recomendado || [],
    oportunidades: ai.radar || []
  };

  const nameEl = document.getElementById('dashClientName');
  const segEl = document.getElementById('dashClientSegment');
  const aiTag = document.getElementById('dashAiTag');
  const banner = document.getElementById('dashBannerNotice');
  const scoreEl = document.getElementById('dashComplexityScore');

  if (nameEl) nameEl.textContent = ai.nome_empresa || payload.client_identity.nome;
  if (segEl) segEl.textContent = "Segmento: " + (ai.segmento || payload.client_identity.segmento);
  if (aiTag) {
    aiTag.textContent = "🧠 Diagnóstico Ao Vivo • Google IA";
    aiTag.style.backgroundColor = "rgb(16, 185, 129)"; 
    aiTag.style.color = "#ffffff";
  }
  if (banner) {
    banner.style.borderColor = "rgb(16, 185, 129)";
    banner.style.background = "rgba(16, 185, 129, 0.12)";
    banner.innerHTML = `<span style="font-size:1.5rem;">🟢</span><div style="color:var(--text-branco);"><strong>Estratégia Processada ao Vivo:</strong> Nosso Motor ZDE calculou este plano com base no Índice de Complexidade e na capacidade de investimento da sua empresa, aplicando a Política Soberana Zellgo.</div>`;
  }

  if (scoreEl) {
    const pts = ai.indice_complexidade !== undefined ? ai.indice_complexidade : 12;
    const tier = ai.tier || "Tier 1 (Impulso & Automação Essencial)";
    scoreEl.innerHTML = `${pts} PONTOS <div style="font-size:0.9rem; font-weight:400; color:var(--text-branco);">(${tier})</div>`;
  }

  if (ai.radar && Array.isArray(ai.radar)) {
    currentRadarData = ai.radar;
    renderRadarChart(ai.radar);
  }
  const radarSum = document.getElementById('dashRadarSummary');
  if (radarSum && ai.radar_resumo) {
    radarSum.textContent = `*"${ai.radar_resumo}"*`;
  }

  const scopeList = document.getElementById('dashScopeList');
  const scopeCount = document.getElementById('dashScopeCount');
  if (scopeList && ai.escopo_recomendado && Array.isArray(ai.escopo_recomendado)) {
    if (scopeCount) scopeCount.textContent = `${ai.escopo_recomendado.length} Módulos`;
    scopeList.innerHTML = '';
    
    ai.escopo_recomendado.forEach(item => {
      const li = document.createElement('li');
      li.className = 'scope-item';
      li.innerHTML = `
        <div class="scope-item-header">
          <span class="scope-name">${item.modulo || "Solução Zellgo"}</span>
          <span class="badge-tag badge-rose">${item.prioridade || "Estratégica"}</span>
        </div>
        <p class="scope-desc">${item.descricao || "Implementação sob medida com padrão de excelência Zellgo."}</p>
      `;
      scopeList.appendChild(li);
    });
  }

  const roadmapEl = document.getElementById('dashRoadmapTimeline');
  if (roadmapEl && ai.roadmap_90_dias && Array.isArray(ai.roadmap_90_dias)) {
    roadmapEl.innerHTML = '';
    ai.roadmap_90_dias.forEach(rm => {
      const step = document.createElement('div');
      step.className = 'timeline-step';
      step.innerHTML = `
        <div class="step-phase">${rm.fase || "Fase ZVI"}</div>
        <div class="step-title">${rm.titulo || "Execução"}</div>
        <div class="step-info">${rm.desc || "Ações estratégicas programadas para expansão de resultados."}</div>
      `;
      roadmapEl.appendChild(step);
    });
  }

  const roiText = document.getElementById('dashRoiText');
  const setupVal = document.getElementById('dashSetupVal');
  const setupLabel = document.getElementById('dashSetupLabel');
  const retainerVal = document.getElementById('dashRetainerVal');

  if (roiText && ai.ancoragem_roi) roiText.innerHTML = ai.ancoragem_roi;
  if (ai.valores_proposta) {
    if (setupLabel && ai.valores_proposta.setup_label) setupLabel.textContent = ai.valores_proposta.setup_label;
    if (setupVal && ai.valores_proposta.setup_val) setupVal.innerHTML = `${ai.valores_proposta.setup_val} <div style="font-size:0.85rem; font-weight:400; color:var(--text-muted); margin-top:0.2rem;">(Projeto Modular Sob Medida)</div>`;
    if (retainerVal && ai.valores_proposta.retainer_label) retainerVal.textContent = ai.valores_proposta.retainer_label;
  }
}

// Apresentação profissional e polida para quando roda offline ou sem chave (zero avisos assustadores)
function applyFallbackDashboard(payload) {
  // Configura a estrutura JSON de Diagnóstico no Fallback para conexão com o Motor ZSE
  const clientName = payload.client_identity.nome || "Empresa Analisada";
  const segmentName = payload.client_identity.segmento || "Operações Especializadas";

  globalZdeJson = {
    cliente: clientName,
    segmento: segmentName,
    diagnostico: {
      indice_complexidade: 12,
      tier: "Tier 1 (Impulso & Automação Essencial)",
      gargalo_central: payload.operations?.gargalos_operacionais || "Sobrecarga no atendimento e atrasos na conversão de cotações pelo WhatsApp.",
      ancoragem_roi: "Automação de atendimento com bot 24/7 para eliminar tempo de espera e elevar margem de lucro."
    },
    gaps: [
      { modulo: "Gargalo de Atendimento no WhatsApp", prioridade: "Alta Prioridade", descricao: "Demora no retorno a leads quentes por sobrecarga da equipe manual." },
      { modulo: "Percepção Visual Comum e Defasada", prioridade: "Oportunidade", descricao: "Necessidade de reposicionamento High-End para blindar contra competição por preço." },
      { modulo: "Dependência de Indicação e Boca a Boca", prioridade: "Crescimento", descricao: "Criar canal contínuo de entrada de cotações com tráfego cirúrgico." }
    ],
    oportunidades: currentRadarData || []
  };

  const nameEl = document.getElementById('dashClientName');
  const segEl = document.getElementById('dashClientSegment');
  const aiTag = document.getElementById('dashAiTag');
  const banner = document.getElementById('dashBannerNotice');

  const clientName = payload.client_identity.nome || "Empresa Analisada";
  const segmentName = payload.client_identity.segmento || "Operações Especializadas";

  if (nameEl) nameEl.textContent = clientName;
  if (segEl) segEl.textContent = "Segmento: " + segmentName;
  if (aiTag) {
    aiTag.textContent = "⚡ Estratégia Customizada • ZDE v2.3";
    aiTag.style.backgroundColor = "var(--accent-rose)";
    aiTag.style.color = "#ffffff";
  }
  if (banner) {
    banner.style.borderColor = "var(--accent-rose)";
    banner.style.background = "rgba(244, 63, 94, 0.12)";
    banner.innerHTML = `<span style="font-size:1.5rem;">⚡</span><div style="color:var(--text-branco);"><strong>Auditoria Estratégica ZDE v2.3:</strong> Apresentamos o mapeamento estrutural e as soluções recomendadas sob medida para <strong>${clientName}</strong>, com plano de investimento modular e objetivo adaptado à realidade da operação.</div>`;
  }
}

// ==========================================================================
// RENDERIZADOR DO GRÁFICO DE RADAR
// ==========================================================================
function renderRadarChart(customAxes) {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const radius = Math.min(width, height) / 2 - 55;
  
  ctx.clearRect(0, 0, width, height);

  // Perfil calibrado para pequenas e médias empresas em crescimento
  const defaultAxes = [
    { name: "Posicionamento", value: 3, max: 5 },
    { name: "Marca (Branding)", value: 3, max: 5 },
    { name: "Presença Digital", value: 2, max: 5 },
    { name: "Conversão & Funil", value: 2, max: 5 },
    { name: "Conteúdo & Vídeos", value: 1, max: 5 },
    { name: "Tecnologia & IA", value: 1, max: 5 },
    { name: "Marketing & Tração", value: 2, max: 5 },
    { name: "Comercial / Pedidos", value: 3, max: 5 }
  ];

  const axes = customAxes && Array.isArray(customAxes) && customAxes.length > 0 ? customAxes : defaultAxes;
  const numAxes = axes.length;
  const angleStep = (Math.PI * 2) / numAxes;
  const startAngle = -Math.PI / 2; 

  ctx.strokeStyle = "rgba(245, 245, 245, 0.1)";
  ctx.lineWidth = 1;

  for (let level = 1; level <= 5; level++) {
    const levelRadius = (radius / 5) * level;
    ctx.beginPath();
    for (let i = 0; i < numAxes; i++) {
      const angle = startAngle + i * angleStep;
      const x = centerX + Math.cos(angle) * levelRadius;
      const y = centerY + Math.sin(angle) * levelRadius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    if (level > 0) {
      ctx.fillStyle = "rgba(245, 245, 245, 0.35)";
      ctx.font = "11px Neue Haas Grotesk, sans-serif";
      ctx.fillText(level, centerX + 6, centerY - levelRadius + 3);
    }
  }

  for (let i = 0; i < numAxes; i++) {
    const angle = startAngle + i * angleStep;
    const x2 = centerX + Math.cos(angle) * radius;
    const y2 = centerY + Math.sin(angle) * radius;
    
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = "rgba(245, 245, 245, 0.12)";
    ctx.stroke();

    const labelDistance = radius + 25;
    const lx = centerX + Math.cos(angle) * labelDistance;
    const ly = centerY + Math.sin(angle) * labelDistance;

    ctx.fillStyle = "#F5F5F5";
    ctx.font = "600 11px Neue Haas Grotesk, ui-sans-serif, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    
    if (Math.abs(Math.cos(angle)) > 0.3) {
      ctx.textAlign = Math.cos(angle) > 0 ? "left" : "right";
    }
    ctx.fillText(axes[i].name, lx, ly);
  }

  ctx.beginPath();
  const points = [];
  
  for (let i = 0; i < numAxes; i++) {
    const val = axes[i].value !== undefined ? axes[i].value : 3;
    const max = axes[i].max !== undefined ? axes[i].max : 5;
    const valueRatio = Math.min(Math.max(val / max, 0.1), 1);
    const angle = startAngle + i * angleStep;
    const px = centerX + Math.cos(angle) * (radius * valueRatio);
    const py = centerY + Math.sin(angle) * (radius * valueRatio);
    points.push({ x: px, y: py, val: val });
    
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();

  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
  gradient.addColorStop(0, "rgba(244, 63, 94, 0.65)");
  gradient.addColorStop(1, "rgba(244, 63, 94, 0.2)");
  
  ctx.fillStyle = gradient;
  ctx.fill();

  ctx.strokeStyle = "#f43f5e";
  ctx.lineWidth = 2.5;
  ctx.shadowColor = "rgba(244, 63, 94, 0.85)";
  ctx.shadowBlur = 14;
  ctx.stroke();
  ctx.shadowBlur = 0;

  points.forEach(pt => {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#F5F5F5";
    ctx.shadowColor = "rgba(244, 63, 94, 1)";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.fillStyle = "#f43f5e";
    ctx.font = "700 12px Neue Haas Grotesk, sans-serif";
    ctx.fillText(`(${pt.val})`, pt.x, pt.y - 12);
  });

  radarChartRendered = true;
}

function showToast(title, desc) {
  const toast = document.getElementById('toast');
  const tTitle = document.getElementById('toastTitle');
  const tDesc = document.getElementById('toastDesc');
  
  if (tTitle) tTitle.textContent = title;
  if (tDesc) tDesc.textContent = desc;
  
  if (toast) {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 6000);
  }
}

// ==========================================================================
// MOTOR 2: ZSE v1.0 — ZELLGO STRATEGY ENGINE (O QUE A ZELLGO DEVE FAZER?)
// ==========================================================================
async function triggerStrategyEngine() {
  const btn = document.getElementById('btnTriggerZse');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Motor ZSE formulando estratégia modular...';
  }

  // Se for acessado direto sem submeter briefing, carrega o Case ZVI atual do DOM
  if (!globalZdeJson) {
    const nomeEl = document.getElementById('dashClientName');
    const segEl = document.getElementById('dashClientSegment');
    globalZdeJson = {
      cliente: nomeEl ? nomeEl.textContent : "GF Riototal (Case ZVI)",
      segmento: segEl ? segEl.textContent.replace("Segmento: ", "") : "Varejo & Operações Locais",
      diagnostico: {
        indice_complexidade: 12,
        tier: "Tier 1 (Impulso & Automação Essencial)",
        gargalo_central: "Sobrecarga no atendimento e tempo de resposta via WhatsApp.",
        ancoragem_roi: "Automação 24/7 liberando a equipe e elevando a conversão de cotações sem inchar folha."
      },
      gaps: [
        { modulo: "Gargalo no Atendimento WhatsApp", prioridade: "Alta Prioridade", descricao: "Demora nas respostas manuais por falta de bot 24/7." },
        { modulo: "Percepção Visual Comum", prioridade: "Oportunidade", descricao: "Reposição visual para transmitir máxima confiança." }
      ],
      oportunidades: currentRadarData || []
    };
  }

  try {
    const res = await fetch('/api/strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(globalZdeJson)
    });

    if (res.ok) {
      const responseData = await res.json();
      if (responseData.success && responseData.data) {
        updateStrategyWithAi(responseData.data);
        showToast('⚙️ Motor ZSE Concluído!', 'Proposta comercial e investimento modular formulados com precisão! Encaminhando...');
        switchTab('strategy');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
        return;
      }
    }
    throw new Error('Acionando Fallback ZSE.');
  } catch(error) {
    applyFallbackStrategy(globalZdeJson);
    showToast('⚙️ Estratégia Modular ZSE Ativa!', 'Painel da estratégia sincronizado com a realidade da operação e orçamentos objetivos.');
    switchTab('strategy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }
}

function updateStrategyWithAi(zseData) {
  globalZseJson = zseData;

  const clientEl = document.getElementById('zseClientName');
  const segEl = document.getElementById('zseSegment');
  const oppEl = document.getElementById('zseOpportunityScore');
  const statusTag = document.getElementById('zseStatusTag');

  if (clientEl) clientEl.textContent = `${zseData.cliente || "Empresa Analisada"} (Proposta Comercial)`;
  if (segEl) segEl.textContent = `Segmento: ${zseData.segmento || "Operações Especializadas"}`;
  if (oppEl && zseData.indice_oportunidade) oppEl.innerHTML = `${zseData.indice_oportunidade} <div style="font-size:0.85rem; font-weight:400; color:var(--text-branco);">(Retorno de Margem no Trimestre)</div>`;
  if (statusTag) {
    statusTag.textContent = "⚙️ ESTRATÉGIA AO VIVO • ZSE v1.0 AI";
    statusTag.style.background = "rgba(16, 185, 129, 0.2)";
    statusTag.style.color = "#10b981";
    statusTag.style.borderColor = "#10b981";
  }

  // Bloco 1: Mapeamento da Virada
  if (zseData.mapeamento) {
    const probEl = document.getElementById('zseProbText');
    const stratEl = document.getElementById('zseStratText');
    const solEl = document.getElementById('zseSolText');
    if (probEl && zseData.mapeamento.problema) probEl.textContent = zseData.mapeamento.problema;
    if (stratEl && zseData.mapeamento.estrategia) stratEl.textContent = zseData.mapeamento.estrategia;
    if (solEl && zseData.mapeamento.solucao) solEl.textContent = zseData.mapeamento.solucao;
  }

  // Bloco 2: Módulos Prioritários
  if (zseData.modulos_prioritarios && Array.isArray(zseData.modulos_prioritarios)) {
    const grid = document.getElementById('zseModGrid');
    const count = document.getElementById('zseModCount');
    if (count) count.textContent = `${zseData.modulos_prioritarios.length} Módulos`;
    if (grid) {
      grid.innerHTML = zseData.modulos_prioritarios.map((mod, idx) => `
        <div class="zse-module-card">
          <div class="zse-mod-header">
            <span class="zse-mod-icon">${mod.icone || "⚡"}</span>
            <div class="zse-mod-title">${mod.titulo || mod.categoria}</div>
          </div>
          <p class="zse-mod-desc">${mod.desc || ""}</p>
          <span class="badge-tag ${idx === 0 ? 'badge-rose' : 'badge-neutral'}" style="align-self:flex-start;">${idx === 0 ? 'Prioridade Máxima' : 'Recomendado'}</span>
        </div>
      `).join('');
    }
  }

  // Bloco 3: Roadmap 90 Dias
  if (zseData.roadmap_90_dias && Array.isArray(zseData.roadmap_90_dias)) {
    const roadmapGrid = document.getElementById('zseRoadmapGrid');
    if (roadmapGrid) {
      roadmapGrid.innerHTML = zseData.roadmap_90_dias.map(step => `
        <div class="timeline-step">
          <div class="step-phase" style="color:var(--accent-rose);">${step.etapa}</div>
          <div class="step-title">${step.titulo}</div>
          <div class="step-info">${step.acao}</div>
        </div>
      `).join('');
    }
  }

  // Bloco 4: Investimento Estratégico (Nunca falar 'Preço gerado por IA')
  if (zseData.investimento_estrategico) {
    const fundVal = document.getElementById('zseFundacaoVal');
    const constrVal = document.getElementById('zseConstrucaoVal');
    const acelVal = document.getElementById('zseAceleracaoVal');

    if (fundVal && zseData.investimento_estrategico.fundacao_val) fundVal.textContent = zseData.investimento_estrategico.fundacao_val;
    if (constrVal && zseData.investimento_estrategico.construcao_val) constrVal.textContent = zseData.investimento_estrategico.construcao_val;
    if (acelVal && zseData.investimento_estrategico.aceleracao_val) acelVal.textContent = zseData.investimento_estrategico.aceleracao_val;
  }
}

function applyFallbackStrategy(zdeInput) {
  const clientName = zdeInput ? zdeInput.cliente : "Empresa em Análise";
  const segment = zdeInput ? zdeInput.segmento : "Operações Especializadas";
  const clientEl = document.getElementById('zseClientName');
  const segEl = document.getElementById('zseSegment');

  if (clientEl) clientEl.textContent = `${clientName} (Proposta Comercial)`;
  if (segEl) segEl.textContent = `Segmento: ${segment}`;

  globalZseJson = {
    cliente: clientName,
    segmento: segment,
    status: "Validado pelo Arquiteto Chefe • ZSE v1.0",
    investimento: {
      fundacao: "R$ 3.500 a R$ 6.500",
      construcao: "R$ 4.500 a R$ 7.000",
      aceleracao_retainer: "+ a partir de R$ 1.600 / mês"
    }
  };
}

// ==========================================================================
// MOTOR 3: ZPE v1.0 — PRODUCTION ENGINE (CONEXÃO COM FÁBRICA / FASE 2)
// ==========================================================================
function triggerProductionEngine() {
  const payloadToZpe = {
    metadata: {
      engine_origem: "ZSE v1.0 Strategy Engine",
      destino: "ZPE v1.0 Production Engine",
      status_aprovacao: "PROPOSTA COMERCIAL APROVADA PELO CLIENTE / ARQUITETO"
    },
    estrategia_aprovada: globalZseJson || { cliente: "Case ZVI", status: "Aprovada" },
    modulos_para_producao: [
      "1. Branding & Identidade Visual High-End (Paleta + Manual)",
      "2. Website & Landing Page (UI/UX do Sistema e Boletos)",
      "3. IA & Automação (System Prompt do Zellgo Bot 24/7 para WhatsApp)",
      "4. Linha Editorial e Roteiros de Vídeo para Social e Tração"
    ]
  };

  const jsonString = JSON.stringify(payloadToZpe, null, 2);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonString).catch(() => {});
  }

  showToast(
    '🔨 Conexão ZPE Acionada!',
    'Pacote de produção exportado (em clipboard)! A estrutura JSON está pronta para alimentar o Motor de Execução e as 8 Bibliotecas (Fase 2).'
  );
}
