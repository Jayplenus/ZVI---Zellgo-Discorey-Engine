/* ==========================================================================
   ZELLGO VISUAL INTELLIGENCE (ZVI) — ENGINE LOGIC & RADAR CHART RENDERER
   Compatível com zellgo.com.br / ZDE v2.1 - Paleta Rosa Vibrante / Noite
   ========================================================================== */

let currentBlock = 0;
const totalBlocks = 8;
let radarChartRendered = false;

document.addEventListener('DOMContentLoaded', () => {
  updateNavState();
  setTimeout(renderRadarChart, 350);
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
      renderRadarChart();
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

// O Botão Verde (Export/Enviar) agora aparece APENAS no Bloco H (última página)!
function updateNavState() {
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const btnExport = document.getElementById('btnExport');
  
  if (btnPrev) {
    btnPrev.disabled = (currentBlock === 0);
  }
  
  if (currentBlock === totalBlocks - 1) {
    // Bloco 08 (Último bloco do briefing): esconde o botão "Próximo" e exibe APENAS o botão verde de Enviar
    if (btnNext) btnNext.style.display = 'none';
    if (btnExport) {
      btnExport.style.display = 'inline-flex';
      btnExport.innerHTML = '🚀 Enviar Briefing e Finalizar';
    }
  } else {
    // Blocos 01 ao 07: exibe apenas os botões de navegação Próximo/Anterior
    if (btnNext) {
      btnNext.style.display = 'inline-flex';
      btnNext.innerHTML = 'Próximo Bloco <span>&rarr;</span>';
    }
    if (btnExport) btnExport.style.display = 'none';
  }
}

// ==========================================================================
// TRANSMISSÃO PARA O MOTOR ZDE (SEM DOWNLOAD ARCAICO DE JASON!)
// ==========================================================================
function getRadioVal(name) {
  const el = document.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : "Não especificado";
}

function sendToZellgoEngine() {
  const btnExport = document.getElementById('btnExport');
  if (btnExport) {
    btnExport.disabled = true;
    btnExport.innerHTML = '⏳ Transmitindo ao Motor ZDE...';
  }

  const payload = {
    metadata: {
      engine: "ZDE v2.1 (Zellgo Discovery Engine)",
      source_domain: "https://zellgo.com.br/zvi",
      timestamp: new Date().toISOString()
    },
    client_identity: {
      nome: document.getElementById('emp_nome').value.trim() || "[Cliente sem nome]",
      segmento: document.getElementById('emp_segmento').value.trim() || "[Segmento em Aberto]",
      core_business: document.getElementById('emp_core').value.trim() || "[Em Aberto]"
    },
    market: {
      concorrentes: document.getElementById('mer_concorrentes').value.trim() || "[Não informado]",
      posicionamento: getRadioVal('mer_pos')
    },
    target_audience: {
      persona: document.getElementById('pub_persona').value.trim() || "[Não informado]",
      dor_principal: document.getElementById('pub_dor').value.trim() || "[Não informado]"
    },
    branding: {
      diferencial_exclusivo: document.getElementById('mar_dif').value.trim() || "[Não informado]",
      status_marca: getRadioVal('mar_status')
    },
    traction: {
      origem_clientes: getRadioVal('tra_origem'),
      canais_ativos: document.getElementById('tra_canais').value.trim() || "[Não informado]"
    },
    technology: {
      site_url: document.getElementById('tec_site').value.trim() || "Não informado",
      stack_tools: document.getElementById('tec_stack').value.trim() || "Não informado",
      infra_erp: getRadioVal('tec_erp')
    },
    operations: {
      gargalos_operacionais: document.getElementById('ope_gargalo').value.trim() || "[Nenhum gargalo reportado]",
      atendimento: document.getElementById('ope_atendimento').value.trim() || "Não especificado"
    },
    objectives: {
      meta_90_dias: document.getElementById('obj_90').value.trim() || "[Objetivos por alinhar]",
      investimento_estimado: document.getElementById('obj_orcamento').value.trim() || "Ancoragem por ROI"
    }
  };

  const jsonString = JSON.stringify(payload, null, 2);

  // Guarda no Clipboard em segundo plano (útil para consultores que quiserem colar no CRM ou ChatGPT/Antigravity)
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonString).catch(() => {});
  }

  // Notificação elegante de sucesso sem acionar nenhum download invasivo!
  showToast(
    '✅ Briefing Transmitido!',
    'Os dados do seu negócio foram registrados com sucesso no ecossistema Zellgo. Encaminhando para a visualização demonstrativa...'
  );

  // Transição suave e impactante para a aba do Painel de Demonstração (Preview)
  setTimeout(() => {
    switchTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (btnExport) {
      btnExport.disabled = false;
      btnExport.innerHTML = '🚀 Enviar Briefing e Finalizar';
    }
  }, 1600);
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
// RENDERIZADOR DO GRÁFICO DE RADAR - CASE DE REFERÊNCIA ZVI
// ==========================================================================
function renderRadarChart() {
  const canvas = document.getElementById('radarChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width / 2;
  const centerY = height / 2 + 10;
  const radius = Math.min(width, height) / 2 - 55;
  
  ctx.clearRect(0, 0, width, height);

  const axes = [
    { name: "Posicionamento", value: 3, max: 5 },
    { name: "Marca (Branding)", value: 4, max: 5 },
    { name: "Presença Digital", value: 2, max: 5 },
    { name: "Conversão & Funil", value: 1, max: 5 },
    { name: "Conteúdo & Vídeos", value: 2, max: 5 },
    { name: "Tecnologia & IA", value: 1, max: 5 },
    { name: "Marketing & Tração", value: 1, max: 5 },
    { name: "Comercial / Pedidos", value: 2, max: 5 }
  ];

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
    const valueRatio = axes[i].value / axes[i].max;
    const angle = startAngle + i * angleStep;
    const px = centerX + Math.cos(angle) * (radius * valueRatio);
    const py = centerY + Math.sin(angle) * (radius * valueRatio);
    points.push({ x: px, y: py, val: axes[i].value });
    
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
