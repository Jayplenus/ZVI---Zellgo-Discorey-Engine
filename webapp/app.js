/* ==========================================================================
   ZELLGO VISUAL INTELLIGENCE (ZVI) — ENGINE LOGIC & AI CONNECTOR
   Compatível com zellgo.com.br / ZDE v2.1 - Paleta Rosa Vibrante / Noite
   ========================================================================== */

let currentBlock = 0;
const totalBlocks = 8;
let radarChartRendered = false;
let currentRadarData = null; // Guarda os dados do radar (IA ou Fallback)

document.addEventListener('DOMContentLoaded', () => {
  updateNavState();
  setTimeout(() => renderRadarChart(), 350);
});

// ==========================================================================
// CONTROLE DE ABAS (VIEWS)
// ==========================================================================
function switchTab(viewName) {
  const btnBriefing = document.getElementById('btnTabBriefing');
  const btnDashboard = document.getElementById('btnTabDashboard');
  const viewBriefing = document.getElementById('viewBriefing');
  const viewDashboard = document.getElementById('viewDashboard');

  if (viewName === 'briefing') {
    btnBriefing.classList.add('active');
    btnDashboard.classList.remove('active');
    viewBriefing.classList.add('active');
    viewDashboard.classList.remove('active');
  } else {
    btnDashboard.classList.add('active');
    btnBriefing.classList.remove('active');
    viewDashboard.classList.add('active');
    viewBriefing.classList.remove('active');
    
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
    // Ao clicar em Próximo no Bloco 08 (H), o botão Rosa executa direto o envio para a IA!
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
    btnNext.innerHTML = '🧠 IA Google Gemini analisando o negócio...';
  }

  const payload = {
    metadata: {
      engine: "ZDE v2.1 (Zellgo Discovery Engine)",
      source_domain: "https://zellgo.com.br/zvi",
      timestamp: new Date().toISOString()
    },
    client_identity: {
      nome: document.getElementById('emp_nome').value.trim() || "Cliente em Análise",
      segmento: document.getElementById('emp_segmento').value.trim() || "Segmento Especializado",
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
      investimento_estimado: document.getElementById('obj_orcamento').value.trim() || "Ancoragem por ROI"
    }
  };

  // Guarda no Clipboard em segundo plano
  const jsonString = JSON.stringify(payload, null, 2);
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonString).catch(() => {});
  }

  try {
    // Tenta conectar à Função Serverless da Vercel (/api/engine)
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
        // Sucesso Total! IA do Google gerou o diagnóstico ao vivo
        updateDashboardWithAi(responseData.data, payload);
        
        showToast(
          '🧠 Diagnóstico IA Concluído!',
          'O Motor ZDE v2.1 processou a radiografia ao vivo com o Google Gemini. Encaminhando para o painel...'
        );

        finalizeSubmission();
        return;
      }
    }
    
    // Se a API não estiver configurada ainda, lança para fallback elegante
    throw new Error('Servidor API não retornou resposta OK ou API Key ausente na Vercel.');

  } catch (error) {
    console.warn('⚠️ Modo Demonstrativo de Fallback Ativo:', error.message);
    
    // Fallback inteligente que ao menos atualiza o nome e segmento reais da empresa que o usuário digitou!
    applyFallbackDashboard(payload);

    showToast(
      '✨ Briefing Transmitido!',
      'Encaminhando para a visualização do painel (Modo de Demonstração).'
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
  // 1. Cabeçalho e Identidade do Cliente
  const nameEl = document.getElementById('dashClientName');
  const segEl = document.getElementById('dashClientSegment');
  const aiTag = document.getElementById('dashAiTag');
  const banner = document.getElementById('dashBannerNotice');
  const scoreEl = document.getElementById('dashComplexityScore');

  if (nameEl) nameEl.textContent = ai.nome_empresa || payload.client_identity.nome;
  if (segEl) segEl.textContent = "Segmento: " + (ai.segmento || payload.client_identity.segmento);
  if (aiTag) {
    aiTag.textContent = "🧠 Diagnóstico Ao Vivo • Google Gemini IA";
    aiTag.style.backgroundColor = "rgb(16, 185, 129)"; // Verde esmeralda para indicar IA ao vivo
    aiTag.style.color = "#ffffff";
  }
  if (banner) {
    banner.style.borderColor = "rgb(16, 185, 129)";
    banner.style.background = "rgba(16, 185, 129, 0.12)";
    banner.innerHTML = `<span style="font-size:1.5rem;">🟢</span><div style="color:var(--text-branco);"><strong>Diagnóstico IA Ao Vivo (Google Gemini):</strong> Esta estratégia foi calculada em tempo real pelo Motor ZDE v2.1 com base no Índice de Complexidade e na Política Comercial Soberana da Zellgo.</div>`;
  }

  if (scoreEl) {
    const pts = ai.indice_complexidade !== undefined ? ai.indice_complexidade : 18;
    const tier = ai.tier || "Tier 2 (Média Complexidade ➔ Expansão)";
    scoreEl.innerHTML = `${pts} PONTOS <div style="font-size:0.9rem; font-weight:400; color:var(--text-branco);">(${tier})</div>`;
  }

  // 2. Gráfico de Radar Real
  if (ai.radar && Array.isArray(ai.radar)) {
    currentRadarData = ai.radar;
    renderRadarChart(ai.radar);
  }
  const radarSum = document.getElementById('dashRadarSummary');
  if (radarSum && ai.radar_resumo) {
    radarSum.textContent = `*"${ai.radar_resumo}"*`;
  }

  // 3. Escopo Recomendado Pela IA
  const scopeList = document.getElementById('dashScopeList');
  const scopeCount = document.getElementById('dashScopeCount');
  if (scopeList && ai.escopo_recomendado && Array.isArray(ai.escopo_recomendado)) {
    if (scopeCount) scopeCount.textContent = `${ai.escopo_recomendado.length} Módulos IA`;
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

  // 4. Roadmap de 90 Dias
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

  // 5. Ancoragem de ROI e Valores
  const roiText = document.getElementById('dashRoiText');
  const setupVal = document.getElementById('dashSetupVal');
  const setupLabel = document.getElementById('dashSetupLabel');
  const retainerVal = document.getElementById('dashRetainerVal');

  if (roiText && ai.ancoragem_roi) roiText.innerHTML = ai.ancoragem_roi;
  if (ai.valores_proposta) {
    if (setupLabel && ai.valores_proposta.setup_label) setupLabel.textContent = ai.valores_proposta.setup_label;
    if (setupVal && ai.valores_proposta.setup_val) setupVal.innerHTML = `${ai.valores_proposta.setup_val} <span style="font-size:0.95rem; font-weight:300; color:var(--text-muted);">(Projeto Base)</span>`;
    if (retainerVal && ai.valores_proposta.retainer_label) retainerVal.textContent = ai.valores_proposta.retainer_label;
  }
}

// Fallback Inteligente (quando testa sem chave ou offline, mas adaptando o nome que o lead digitou!)
function applyFallbackDashboard(payload) {
  const nameEl = document.getElementById('dashClientName');
  const segEl = document.getElementById('dashClientSegment');
  const aiTag = document.getElementById('dashAiTag');
  const banner = document.getElementById('dashBannerNotice');

  if (nameEl) nameEl.textContent = payload.client_identity.nome + " (Case de Estudo ZVI)";
  if (segEl) segEl.textContent = "Segmento: " + (payload.client_identity.segmento || "Gastronomia / Varejo");
  if (aiTag) {
    aiTag.textContent = "Modo Demonstrativo • ZDE v2.1";
    aiTag.style.backgroundColor = "var(--accent-rose)";
  }
  if (banner) {
    banner.innerHTML = `<span style="font-size:1.5rem;">💡</span><div style="color:var(--text-branco);"><strong>Modo de Demonstração (Sem API Key no Vercel):</strong> Exibindo o plano estrutural de referência da Zellgo adaptado para <strong>${payload.client_identity.nome}</strong>. Para análises em tempo real, conecte sua GOOGLE_API_KEY nas configurações da Vercel!</div>`;
  }
}

// ==========================================================================
// RENDERIZADOR DO GRÁFICO DE RADAR - CASE DE REFERÊNCIA OU DADOS DA IA
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

  const defaultAxes = [
    { name: "Posicionamento", value: 3, max: 5 },
    { name: "Marca (Branding)", value: 4, max: 5 },
    { name: "Presença Digital", value: 2, max: 5 },
    { name: "Conversão & Funil", value: 1, max: 5 },
    { name: "Conteúdo & Vídeos", value: 2, max: 5 },
    { name: "Tecnologia & IA", value: 1, max: 5 },
    { name: "Marketing & Tração", value: 1, max: 5 },
    { name: "Comercial / Pedidos", value: 2, max: 5 }
  ];

  const axes = customAxes && Array.isArray(customAxes) && customAxes.length > 0 ? customAxes : defaultAxes;
  const numAxes = axes.length;
  const angleStep = (Math.PI * 2) / numAxes;
  const startAngle = -Math.PI / 2; 

  // 1. Teia cinza clara do fundo (Escala do 1 ao 5)
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

  // 2. Linhas radiais do centro às extremidades
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

  // 3. Polígono de Dados com Brilho Rosa Vibrante (#f43f5e)
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

  // 4. Vértices (Pontos brancos com aura rosa vibrante)
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
