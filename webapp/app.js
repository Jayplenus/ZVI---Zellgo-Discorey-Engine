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
let globalZpeJson = null; // Armazena a saída JSON do Motor 3 (ZPE) para exportação

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
  const btnProduction = document.getElementById('btnTabProduction');

  const viewBriefing = document.getElementById('viewBriefing');
  const viewDashboard = document.getElementById('viewDashboard');
  const viewStrategy = document.getElementById('viewStrategy');
  const viewProduction = document.getElementById('viewProduction');

  [btnBriefing, btnDashboard, btnStrategy, btnProduction].forEach(b => b && b.classList.remove('active'));
  [viewBriefing, viewDashboard, viewStrategy, viewProduction].forEach(v => v && v.classList.remove('active'));

  if (viewName === 'briefing') {
    if (btnBriefing) btnBriefing.classList.add('active');
    if (viewBriefing) viewBriefing.classList.add('active');
  } else if (viewName === 'strategy') {
    if (btnStrategy) btnStrategy.classList.add('active');
    if (viewStrategy) viewStrategy.classList.add('active');
  } else if (viewName === 'production') {
    if (btnProduction) btnProduction.classList.add('active');
    if (viewProduction) viewProduction.classList.add('active');
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
    
    throw new Error('Falha na API ZDE.');

  } catch (error) {
    globalZdeJson = null;
    const nameEl = document.getElementById('dashClientName');
    if (nameEl) nameEl.textContent = 'ERRO ZDE — resposta do motor não disponível.';
    
    // Neutralizar conteúdo mock para não confundir o usuário
    ['dashClientSegment', 'dashComplexityScore', 'dashRadarSummary', 'dashScopeList', 'dashRoadmapTimeline', 'dashRoiText', 'dashSetupVal', 'dashRetainerVal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });

    showToast(
      '❌ Falha Crítica ZDE',
      'ERRO ZDE — resposta do motor não disponível.'
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
  // Se a IA não retornar uma propriedade obrigatória, isso deve ser tratado como erro de contrato
  if (ai.indice_complexidade === undefined || !ai.tier || !ai.gargalo_central || !ai.ancoragem_roi) {
    throw new Error("A IA retornou um JSON incompleto. Faltam propriedades obrigatórias no contrato estrutural.");
  }

  // Salva o JSON estruturado do Motor 1 (ZDE) para alimentar o Motor 2 (ZSE)
  globalZdeJson = {
    cliente: ai.nome_empresa || payload.client_identity.nome,
    segmento: ai.segmento || payload.client_identity.segmento,
    diagnostico: {
      indice_complexidade: ai.indice_complexidade,
      tier: ai.tier,
      gargalo_central: ai.gargalo_central,
      ancoragem_roi: ai.ancoragem_roi
    },
    gaps: ai.escopo_recomendado || [],
    oportunidades: ai.radar || []
  };

  const nameEl = document.getElementById('dashClientName');
  const segEl = document.getElementById('dashClientSegment');
  const aiTag = document.getElementById('dashAiTag');
  const scoreEl = document.getElementById('dashComplexityScore');

  if (nameEl) nameEl.textContent = ai.nome_empresa || payload.client_identity.nome;
  if (segEl) segEl.textContent = "Segmento: " + (ai.segmento || payload.client_identity.segmento);
  if (aiTag) {
    aiTag.textContent = "🧠 Diagnóstico Ao Vivo • Google IA";
    aiTag.style.backgroundColor = "rgb(16, 185, 129)"; 
    aiTag.style.color = "#ffffff";
  }


  if (scoreEl) {
    const pts = ai.indice_complexidade;
    const tier = ai.tier;
    scoreEl.innerHTML = \`\${pts} PONTOS <div style="font-size:0.9rem; font-weight:400; color:var(--text-branco);">(\${tier})</div>\`;
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

  if (nameEl) nameEl.textContent = clientName;
  if (segEl) segEl.textContent = "Segmento: " + segmentName;
  if (aiTag) {
    aiTag.textContent = "⚡ Estratégia Customizada • ZDE v2.3";
    aiTag.style.backgroundColor = "rgba(231, 233, 238, 0.1)";
    aiTag.style.border = "1px solid rgba(231, 233, 238, 0.3)";
    aiTag.style.color = "#E7E9EE";
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
// FUNÇÃO DE EXPORTAÇÃO DOS 3 JSONS (ZDE, ZSE, ZPE)
// ==========================================================================
function exportAllJson() {
  const dataToExport = {
    "1_ZDE_Diagnostico": globalZdeJson || { status: "Não gerado ou Vazio" },
    "2_ZSE_Estrategia": globalZseJson || { status: "Não gerado ou Vazio" },
    "3_ZPE_Producao": globalZpeJson || { status: "Não gerado ou Vazio" }
  };

  const jsonString = JSON.stringify(dataToExport, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  const clientName = (globalZdeJson && globalZdeJson.cliente) ? globalZdeJson.cliente.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'cliente';
  a.download = `zvi_export_${clientName}.json`;

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  showToast('💾 Exportação Concluída', 'O arquivo contendo os 3 JSONs (Diagnóstico, Estratégia e Produção) foi baixado.');
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
    throw new Error('Falha na API ZSE.');
  } catch(error) {
    globalZseJson = null;
    const clientEl = document.getElementById('zseClientName');
    if (clientEl) clientEl.textContent = 'ERRO ZSE — resposta do motor não disponível.';
    
    // Neutralizar conteúdo mock
    ['zseSegment', 'zseOpportunityScore', 'zseProbText', 'zseStratText', 'zseSolText', 'zseModGrid', 'zseRoadmapGrid', 'zseFundacaoVal', 'zseConstrucaoVal', 'zseAceleracaoVal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = '';
    });

    showToast('❌ Falha Crítica ZSE', 'ERRO ZSE — resposta do motor não disponível.');
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
// MOTOR 3: ZPE v1.0 — ZELLGO PRODUCTION ENGINE (A FÁBRICA DAS 5 BIBLIOTECAS)
// ==========================================================================
async function triggerProductionEngine() {
  const btn = document.getElementById('btnTriggerZpe');
  const originalText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Motor ZPE compilando 5 Bibliotecas Mestras de Produção...';
  }

  try {
    const zpePayload = {
      estrategia_zse: globalZseJson || {},
      diagnostico_base_zde: globalZdeJson || {}
    };

    const res = await fetch('/api/production', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(zpePayload)
    });

    if (res.ok) {
      const responseData = await res.json();
      if (responseData.success && responseData.data) {
        updateProductionWithAi(responseData.data);
        showToast('🔨 Motor ZPE Concluído!', 'As 5 Bibliotecas Metodológicas (IA, LP, Branding, Growth e Executive Delivery) foram compiladas ao vivo!');
        switchTab('production');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalText;
        }
        return;
      }
    }
    throw new Error('Falha na API ZPE.');
  } catch(error) {
    globalZpeJson = null;
    const clientEl = document.getElementById('zpeClientName');
    if (clientEl) clientEl.textContent = 'ERRO ZPE — resposta do motor não disponível.';
    
    // Neutralizar conteúdo mock das bibliotecas para não exibir "Zellgo Bot 24/7"
    for (let i = 1; i <= 5; i++) {
      const panel = document.getElementById(`zpeLibPanel${i}`);
      if (panel) panel.innerHTML = '<div style="padding: 2rem; color: #f43f5e; text-align: center; border: 1px solid rgba(244,63,94,0.3); border-radius: 8px; margin-top: 2rem;">ERRO ZPE — resposta do motor não disponível.</div>';
    }

    showToast('❌ Falha Crítica ZPE', 'ERRO ZPE — resposta do motor não disponível.');
    switchTab('production');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalText;
    }
  }
}

function showLibrary(index) {
  for (let i = 1; i <= 5; i++) {
    const btn = document.getElementById(`btnLib${i}`);
    const panel = document.getElementById(`zpeLibPanel${i}`);
    if (btn) btn.classList.remove('active');
    if (panel) panel.classList.remove('active');
  }
  const activeBtn = document.getElementById(`btnLib${index}`);
  const activePanel = document.getElementById(`zpeLibPanel${index}`);
  if (activeBtn) activeBtn.classList.add('active');
  if (activePanel) activePanel.classList.add('active');
}

function copyTextToClipboard(containerId, successMsg) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const textToCopy = el.innerText || el.textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast('📋 Copiado!', successMsg || 'Conteúdo transferido para a área de transferência com sucesso.');
    }).catch(() => {
      showToast('⚠️ Aviso', 'Seu navegador restringiu a cópia automática do texto.');
    });
  }
}

// Atualização Dinâmica com Resposta AI Real (Gemini) no Motor ZPE v1.0
function updateProductionWithAi(zpeData) {
  globalZpeJson = zpeData;
  const clientEl = document.getElementById('zpeClientName');
  const segEl = document.getElementById('zpeSegment');
  if (clientEl) clientEl.textContent = `${zpeData.cliente || "Empresa Analisada"} (Bibliotecas de Execução)`;
  if (segEl) segEl.textContent = `Segmento: ${zpeData.segmento || "Operações Especializadas"}`;

  // Biblioteca 1: IA Bot Blueprint
  const b1 = zpeData.biblioteca_1_ia_bot;
  if (b1) {
    if (document.getElementById('zpeBotIdentidade') && b1.identidade) document.getElementById('zpeBotIdentidade').textContent = b1.identidade;
    if (document.getElementById('zpeBotPersonalidade') && b1.personalidade) document.getElementById('zpeBotPersonalidade').textContent = b1.personalidade;
    if (document.getElementById('zpeBotObjetivo') && b1.objetivo_principal) document.getElementById('zpeBotObjetivo').textContent = b1.objetivo_principal;
    if (document.getElementById('zpeBotFluxo') && b1.fluxo_conversacional) document.getElementById('zpeBotFluxo').textContent = b1.fluxo_conversacional;
    if (document.getElementById('zpeBotProibido') && b1.situacoes_proibidas) document.getElementById('zpeBotProibido').textContent = b1.situacoes_proibidas;
    if (document.getElementById('zpeBotEscalonamento') && b1.escalonamento_humano) document.getElementById('zpeBotEscalonamento').textContent = b1.escalonamento_humano;
    if (document.getElementById('zpeBotCopyText') && b1.prompt_copy_paste) document.getElementById('zpeBotCopyText').textContent = b1.prompt_copy_paste;
    
    if (document.getElementById('zpeBotRegras') && Array.isArray(b1.regras_atendimento)) {
      document.getElementById('zpeBotRegras').innerHTML = b1.regras_atendimento.map(r => `<li>${r}</li>`).join('');
    }
    if (document.getElementById('zpeBotPerguntas') && Array.isArray(b1.perguntas_qualificacao)) {
      document.getElementById('zpeBotPerguntas').innerHTML = b1.perguntas_qualificacao.map(p => `<li>${p}</li>`).join('');
    }
  }

  // Biblioteca 2: Digital Experience (LP ZVI Framework)
  const b2 = zpeData.biblioteca_2_digital_exp;
  if (b2) {
    if (document.getElementById('zpeLpHero') && b2.hero_promessa) document.getElementById('zpeLpHero').textContent = b2.hero_promessa;
    if (document.getElementById('zpeLpProblema') && b2.problema_dor) document.getElementById('zpeLpProblema').textContent = b2.problema_dor;
    if (document.getElementById('zpeLpMecanismo') && b2.mecanismo_unico) document.getElementById('zpeLpMecanismo').textContent = b2.mecanismo_unico;
    if (document.getElementById('zpeLpSolucao') && b2.solucao) document.getElementById('zpeLpSolucao').textContent = b2.solucao;
    if (document.getElementById('zpeLpProva') && b2.prova_autoridade) document.getElementById('zpeLpProva').textContent = b2.prova_autoridade;
    if (document.getElementById('zpeLpProcesso') && b2.processo) document.getElementById('zpeLpProcesso').textContent = b2.processo;
    if (document.getElementById('zpeLpOferta') && b2.oferta) document.getElementById('zpeLpOferta').textContent = b2.oferta;
    if (document.getElementById('zpeLpCta') && b2.cta_final) document.getElementById('zpeLpCta').textContent = b2.cta_final;
  }

  // Biblioteca 3: Brand Direction
  const b3 = zpeData.biblioteca_3_brand_direction;
  if (b3) {
    if (document.getElementById('zpeBrandPos') && b3.posicionamento) document.getElementById('zpeBrandPos').textContent = b3.posicionamento;
    if (document.getElementById('zpeBrandArq') && b3.arquetipo) document.getElementById('zpeBrandArq').textContent = b3.arquetipo;
    if (document.getElementById('zpeBrandSensacao') && b3.sensacao_desejada) document.getElementById('zpeBrandSensacao').textContent = b3.sensacao_desejada;
    if (document.getElementById('zpeBrandPaletaGrid') && Array.isArray(b3.paleta_sugerida)) {
      document.getElementById('zpeBrandPaletaGrid').innerHTML = b3.paleta_sugerida.map(item => {
        const bg = item.hex || item.cor || "#0F172A";
        const isLight = (bg.toUpperCase() === '#F8FAFC' || bg.toUpperCase() === '#FFFFFF' || bg.toUpperCase() === '#F5F5F5' || bg.toUpperCase() === '#E2E8F0');
        const textColor = isLight ? '#0F172A' : '#FFFFFF';
        return `
          <div class="palette-swatch-card">
            <div class="swatch-color" style="background:${bg}; color:${textColor};">${bg}</div>
            <div class="swatch-info"><strong>${item.cor || "Cor Recomendada"}:</strong> ${item.justificativa || ""}</div>
          </div>
        `;
      }).join('');
    }

    if (document.getElementById('zpeBrandUsar') && Array.isArray(b3.palavras_usar)) {
      document.getElementById('zpeBrandUsar').innerHTML = b3.palavras_usar.map(w => `<span class="tag-badge green">${w}</span>`).join(' ');
    }
    if (document.getElementById('zpeBrandProibido') && Array.isArray(b3.palavras_proibidas)) {
      document.getElementById('zpeBrandProibido').innerHTML = b3.palavras_proibidas.map(w => `<span class="tag-badge red">${w}</span>`).join(' ');
    }
  }

  // Biblioteca 4: Growth Engine
  const b4 = zpeData.biblioteca_4_growth_engine;
  if (b4) {
    if (document.getElementById('zpeGrowthIcp') && b4.icp_prioritario) document.getElementById('zpeGrowthIcp').textContent = b4.icp_prioritario;
    if (document.getElementById('zpeGrowthCanal') && b4.canal_recomendado) document.getElementById('zpeGrowthCanal').textContent = b4.canal_recomendado;
    if (document.getElementById('zpeGrowthMetrica') && b4.metrica_principal) document.getElementById('zpeGrowthMetrica').textContent = b4.metrica_principal;
    if (b4.google_ads) {
      if (document.getElementById('zpeGrowthGadsKeywords') && Array.isArray(b4.google_ads.palavras_chave)) {
        document.getElementById('zpeGrowthGadsKeywords').textContent = b4.google_ads.palavras_chave.join(', ');
      }
      const negativesArr = b4.google_ads.negativas || b4.google_ads.negatives;
      if (document.getElementById('zpeGrowthGadsNegatives') && Array.isArray(negativesArr)) {
        document.getElementById('zpeGrowthGadsNegatives').textContent = negativesArr.join(', ');
      }
    }
    if (b4.meta_ads) {
      if (document.getElementById('zpeGrowthMetaHook') && b4.meta_ads.hook) document.getElementById('zpeGrowthMetaHook').textContent = `"${b4.meta_ads.hook}"`;
      if (document.getElementById('zpeGrowthMetaScript') && b4.meta_ads.roteiro_short_reels) document.getElementById('zpeGrowthMetaScript').textContent = b4.meta_ads.roteiro_short_reels;
    }
  }

  // Biblioteca 5: Executive Delivery (Apresentação de Reunião)
  const b5 = zpeData.biblioteca_5_executive_delivery;
  if (b5) {
    if (document.getElementById('zpeExecTitle') && b5.apresentacao_titulo) document.getElementById('zpeExecTitle').textContent = b5.apresentacao_titulo;
    if (document.getElementById('zpeExecResumo') && b5.resumo_executivo) document.getElementById('zpeExecResumo').textContent = b5.resumo_executivo;
    if (document.getElementById('zpeExecCronograma') && b5.cronograma_resumo) {
      document.getElementById('zpeExecCronograma').innerHTML = `<p style="color:#ffffff;">${b5.cronograma_resumo}</p>`;
    }
    if (document.getElementById('zpeExecNextSteps') && Array.isArray(b5.proximos_passos)) {
      document.getElementById('zpeExecNextSteps').innerHTML = b5.proximos_passos.map(s => `<li>${s}</li>`).join('');
    }
  }
}

function applyFallbackProduction(zseInput) {
  const clientName = zseInput ? (zseInput.cliente || "Empresa Analisada") : "Empresa Analisada";
  const segment = zseInput ? (zseInput.segmento || "Operações Especializadas") : "Operações Especializadas";
  const clientEl = document.getElementById('zpeClientName');
  const segEl = document.getElementById('zpeSegment');
  if (clientEl) clientEl.textContent = `${clientName} (Bibliotecas de Execução - Fallback Módulo Offline)`;
  if (segEl) segEl.textContent = `Segmento: ${segment}`;

  if (document.getElementById('zpeGrowthGadsKeywords')) {
    document.getElementById('zpeGrowthGadsKeywords').textContent = `+comprar ${segment.toLowerCase()} atacado, +fornecedor ${segment.toLowerCase()}, +distribuidora de ${segment.toLowerCase()}`;
  }
  if (document.getElementById('zpeGrowthMetaHook')) {
    document.getElementById('zpeGrowthMetaHook').textContent = `"Busca pontualidade indiscutível e excelência no setor de ${segment}? Conheça a operação blindada e consolidada da ${clientName}."`;
  }
  if (document.getElementById('zpeGrowthMetaScript')) {
    document.getElementById('zpeGrowthMetaScript').textContent = `Cena 1 (0-3s): Mostra a frustração e atrasos comuns ao contratar fornecedores no setor de ${segment}. Cena 2 (3-8s): Apresenta o mecanismo operacional de alta qualidade e a tradição da ${clientName}. Cena 3 (8-15s): Chamada direta para cotação com atendimento instantâneo no WhatsApp 24/7.`;
  }
}
