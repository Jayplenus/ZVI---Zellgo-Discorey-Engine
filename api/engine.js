/* ==========================================================================
   ZELLGO DISCOVERY ENGINE (ZDE v2.2) — VERCEL SERVERLESS AI BACK-END
   Conectando o Briefing Web ao cérebro do Google AI (Gemini 1.5 Flash / Pro)
   ========================================================================== */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Utilize POST para processar o briefing.' });
  }

  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: 'API Key do Google não configurada',
      message: 'Variável GOOGLE_API_KEY ausente na Vercel.',
      fallback_required: true
    });
  }

  try {
    let briefingData = req.body || {};
    if (typeof req.body === 'string') {
      try { briefingData = JSON.parse(req.body); } catch(e) {}
    }

    const promptInstructs = `
Você é o Motor de Inteligência Zellgo Discovery Engine (ZDE v2.2), o cérebro clínico, analítico e comercial da Zellgo (zellgo.com.br).
A Filosofia Soberana da nossa marca é: "A Zellgo não vende serviços, resolve problemas de negócio".
Nós operamos ajudando marcas de todos os portes a destravarem vendas com excelência visual, tecnologia avançada (Agentes de IA) e estratégia operacional.

O usuário acaba de submeter as respostas do Briefing Modular do cliente. Abaixo estão os dados JSON brutos:
${JSON.stringify(briefingData, null, 2)}

Sua tarefa é realizar uma auditoria clínica e de alta precisão neste negócio e DEVOLVER UMA RESPOSTA ESTRUTURADA EXCLUSIVAMENTE EM JSON VÁLIDO (sem formatação markdown de crases ou textos adicionais fora do JSON), seguindo perfeitamente o esquema abaixo:

{
  "nome_empresa": "Nome real ou identificado da empresa do cliente",
  "segmento": "Segmento de mercado identificado",
  "indice_complexidade": 12, 
  "tier": "Tier 1 (Impulso & Automação Essencial)",
  "radar": [
    { "name": "Posicionamento", "value": 3, "max": 5 },
    { "name": "Marca (Branding)", "value": 3, "max": 5 },
    { "name": "Presença Digital", "value": 2, "max": 5 },
    { "name": "Conversão & Funil", "value": 2, "max": 5 },
    { "name": "Conteúdo & Vídeos", "value": 1, "max": 5 },
    { "name": "Tecnologia & IA", "value": 1, "max": 5 },
    { "name": "Marketing & Tração", "value": 2, "max": 5 },
    { "name": "Comercial / Pedidos", "value": 3, "max": 5 }
  ],
  "radar_resumo": "Uma frase clínica e marcante diagnosticando as maiores fortalezas e fragilidades reveladas no gráfico de radar do cliente.",
  "gargalo_central": "Análise profunda da principal dor, lentidão ou perda de eficiência da operação do cliente hoje.",
  "ancoragem_roi": "Demonstração financeira contundente mostrando como a automação de atendimento ou otimização eliminará a perda atual e trará um retorno superior ao investimento sem inchar custos operacionais.",
  "valores_proposta": {
    "setup_label": "Setup Tier 1 (Impulso & Automação Essencial)",
    "setup_val": "Investimento Flexível (Sob Consulta de ROI)",
    "retainer_label": "+ Fee Operacional: Adaptado ao Retorno do Cliente"
  },
  "escopo_recomendado": [
    {
      "modulo": "1. Agente IA de Conversão no WhatsApp (Zellgo Bot 24/7)",
      "prioridade": "Prioridade Máxima",
      "descricao": "Explicação exata de como a Inteligência Artificial liberará o tempo da equipe atendendo clientes em segundos."
    },
    {
      "modulo": "2. Padronização Visual & Autoridade Digital",
      "prioridade": "Alta",
      "descricao": "Ajustes essenciais na identidade de marca e canais de contato para transmitir máxima confiança."
    }
  ],
  "roadmap_90_dias": [
    { "fase": "⚡ Dias 01 ao 15", "titulo": "Setup & Automação", "desc": "Mapeamento das perguntas frequentes e calibração do Agente Inteligente no WhatsApp." },
    { "fase": "📅 Dias 16 ao 30", "titulo": "Destrave de Atendimento", "desc": "Ativação em produção do bot 24/7 para eliminar atrasos e capturar todas as cotações." },
    { "fase": "🔥 Dias 31 ao 60", "titulo": "Tração & Otimização", "desc": "Ajustes de conversão nos pontos de contato digital da empresa e campanhas de reativação." },
    { "fase": "🔭 Dias 61 ao 90+", "titulo": "Expansão de Margem", "desc": "Avaliação dos ganhos de produtividade e planejamento das próximas metas de crescimento." }
  ]
}

REGRAS RÍGIDAS DE PRECIFICAÇÃO PROPORCIONAL E ÍNDICE DE COMPLEXIDADE (IC):
- Avalie o porte, faturamento reportado (se houver) e número de colaboradores da empresa. NUNCA aplique valores engessados fora da realidade de lucro do cliente!
- SE A EMPRESA FOR PEQUENA (ex: 1 a 6 funcionários, faturamento até R$ 35k/mês, como lojas locais ou pequenas prestadoras de serviço):
  * Calcule de 8 a 13 pontos = Tier 1 (Impulso & Automação Essencial).
  * No `setup_label`: "Setup Tier 1 (Impulso & Automação Essencial)".
  * No `setup_val`: "Investimento Flexível (Sob Projeção de ROI)" ou "A partir de R$ 2.800 a R$ 4.500".
  * No `retainer_label`: "+ Fee Operacional: Adaptado ao Lucro Gerado (Ex: R$ 850 a R$ 1.200/mês ou comissionamento)".
- SE A EMPRESA FOR MÉDIA (ex: estrutura intermediária, em expansão, faturamento entre R$ 40k a R$ 150k/mês):
  * Calcule de 14 a 20 pontos = Tier 2 (Expansão Estratégica).
  * No `setup_label`: "Setup Tier 2 (Expansão Estratégica & Growth)".
  * No `setup_val`: "R$ 8.000 a R$ 15.000 (Projeto de Expansão)".
  * No `retainer_label`: "+ Retainer Growth: R$ 2.500 / mês".
- SE A EMPRESA FOR GRANDE/CORPORATIVA (alta complexidade, integrações pesadas, faturamento elevado):
  * Calcule 21+ pontos = Tier 3 (Transformação Integral High-End).
  * No `setup_val`: "A partir de R$ 25.000+".
- Adapte SEMPRE as notas do Radar (1 a 5) e os textos do roadmap à realidade reportada no briefing.
- RETORNE APENAS O JSON PURAMENTE. Zero texto de introdução ou conclusão fora da estrutura.
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const apiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptInstructs }]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          response_mime_type: 'application/json'
        }
      })
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      throw new Error(`Erro na API do Google: ${apiResponse.status} - ${errText}`);
    }

    const geminiData = await apiResponse.json();
    const rawAiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawAiText) {
      throw new Error('A API do Google retornou uma resposta vazia.');
    }

    const cleanJsonText = rawAiText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsedDiagnosis = JSON.parse(cleanJsonText);

    return res.status(200).json({
      success: true,
      data: parsedDiagnosis
    });

  } catch (error) {
    console.error('❌ Erro no processamento do Motor ZDE na Vercel:', error);
    return res.status(500).json({
      error: 'Erro no processamento da IA',
      message: error.message || 'Falha ao processar diagnóstico.',
      fallback_required: true
    });
  }
}
