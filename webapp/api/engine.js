/* ==========================================================================
   ZELLGO DISCOVERY ENGINE (ZDE v2.1) — VERCEL SERVERLESS AI BACK-END
   Conectando o Briefing Web ao cérebro do Google AI (Gemini 1.5 Flash / Pro)
   ========================================================================== */

export default async function handler(req, res) {
  // Configuração de CORS para garantir requisições seguras da interface
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

  // Busca a chave da API nas Variáveis de Ambiente da Vercel (Segurança Máxima)
  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn('⚠️ GOOGLE_API_KEY não encontrada no painel da Vercel (Environment Variables).');
    return res.status(503).json({
      error: 'API Key do Google não configurada',
      message: 'Por favor, adicione GOOGLE_API_KEY em Settings > Environment Variables no seu painel Vercel.',
      fallback_required: true
    });
  }

  try {
    const briefingData = req.body || {};

    // O CÓDIGO DA NOSSA POLÍTICA COMERCIAL SOBERANA (SYSTEM PROMPT ZDE v2.1)
    const promptInstructs = `
Você é o Motor de Inteligência Zellgo Discovery Engine (ZDE v2.1), o cérebro clínico, analítico e comercial da Zellgo (zellgo.com.br).
A Filosofia Soberana da nossa marca é: "A Zellgo não vende serviços, resolve problemas de negócio".
Nós operamos exclusivamente com marcas que valorizam excelência visual, tecnologia avançada (Agentes de IA e Filmmaking IA) e posicionamento High-End.

O usuário acaba de submeter as respostas do Briefing Modular do cliente. Abaixo estão os dados JSON brutos:
${JSON.stringify(briefingData, null, 2)}

Sua tarefa é realizar uma auditoria clínica e de alta precisão neste negócio e DEVOLVER UMA RESPOSTA ESTRUTURADA EXCLUSIVAMENTE EM JSON VÁLIDO (sem formatação markdown de crases ou textos adicionais fora do JSON), seguindo perfeitamente o esquema abaixo:

{
  "nome_empresa": "Nome real ou identificado da empresa do cliente",
  "segmento": "Segmento de mercado identificado",
  "indice_complexidade": 18, 
  "tier": "Tier 2 (Média Complexidade ➔ Expansão)",
  "radar": [
    { "name": "Posicionamento", "value": 3, "max": 5 },
    { "name": "Marca (Branding)", "value": 4, "max": 5 },
    { "name": "Presença Digital", "value": 2, "max": 5 },
    { "name": "Conversão & Funil", "value": 1, "max": 5 },
    { "name": "Conteúdo & Vídeos", "value": 2, "max": 5 },
    { "name": "Tecnologia & IA", "value": 1, "max": 5 },
    { "name": "Marketing & Tração", "value": 2, "max": 5 },
    { "name": "Comercial / Pedidos", "value": 2, "max": 5 }
  ],
  "radar_resumo": "Uma frase clínica e marcante diagnosticando as maiores fortalezas e fragilidades reveladas no gráfico de radar do cliente.",
  "gargalo_central": "Análise profunda da principal dor, lentidão ou perda financeira da operação do cliente hoje.",
  "ancoragem_roi": "Demonstração financeira contundente mostrando como a automação IA ou reposicionamento eliminará a perda atual e trará um retorno múltiplo sobre o investimento (ex: estimar projeções de ganho de faturamento ou tempo).",
  "valores_proposta": {
    "setup_label": "Setup Tier 2 (Expansão & Automação)",
    "setup_val": "R$ 15.000",
    "retainer_label": "+ Retainer Growth: R$ 3.500 / mês"
  },
  "escopo_recomendado": [
    {
      "modulo": "1. Agente IA de Conversão (Zellgo Bot 24/7)",
      "prioridade": "Alta (IC: 3)",
      "descricao": "Explicação exata de como a Inteligência Artificial resolverá o gargalo de atendimento ou vendas do cliente nos canais digitais dele."
    },
    {
      "modulo": "2. Filmmaking IA & Cinema Digital",
      "prioridade": "Alta (IC: 4)",
      "descricao": "Produção de narrativas visuais cinematográficas geradas por IA para elevar o status High-End e aniquilar concorrentes por preço."
    },
    {
      "modulo": "3. Ecossistema Web Proprietário High-End",
      "prioridade": "Média (IC: 3)",
      "descricao": "Desenvolvimento de plataforma ágil e responsiva com foco na autonomia da marca e conversão direta."
    }
  ],
  "roadmap_90_dias": [
    { "fase": "⚡ Dias 01 ao 15", "titulo": "Mapeamento & Setup IA", "desc": "Ações personalizadas de arquitetura, integração dos canais e calibração do modelo de inteligência artificial." },
    { "fase": "📅 Dias 16 ao 30", "titulo": "Destrave Comercial", "desc": "Ativação oficial da automação em tempo real e correção das principais brechas do funil de atendimento." },
    { "fase": "🔥 Dias 31 ao 60", "titulo": "Autoridade & Mídia IA", "desc": "Lançamento das produções cinematográficas e expansão cirúrgica de tráfego para capturar o público-alvo." },
    { "fase": "🔭 Dias 61 ao 90+", "titulo": "Escala de ROI & LTV", "desc": "Consolidação de métricas, refinamento evolutivo do Agente IA e ampliação agressiva de market share." }
  ]
}

REGRAS RÍGIDAS DE PRECIFICAÇÃO E ÍNDICE DE COMPLEXIDADE (IC):
- Calcule os pontos de complexidade com base nas ferramentas atuais, tamanho do desafio, integrações e metas reportadas.
- Até 13 pontos = Tier 1 (Setup Essencial - R$ 6k a R$ 12k | Retainer Essencial R$ 2k/mês).
- De 14 a 20 pontos = Tier 2 (Setup Expansão Estratégica - R$ 13k a R$ 25k | Retainer Growth R$ 3.5k/mês).
- 21 pontos ou mais = Tier 3 (Setup Transformação Integral - R$ 26k a R$ 50k+ | Retainer Strategic R$ 6k+/mês).
- Adapte SEMPRE as notas do Radar (1 a 5) à realidade reportada no briefing.
- RETORNE APENAS O JSON PURAMENTE. Zero texto de introdução ou conclusão fora da estrutura.
`;

    // Conecta-se diretamente aos servidores do Google Gemini em alta velocidade
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
      console.error('Erro retornado pela API do Google Gemini:', errText);
      throw new Error(`Erro na API do Google: ${apiResponse.status} - ${errText}`);
    }

    const geminiData = await apiResponse.json();
    const rawAiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawAiText) {
      throw new Error('A API do Google retornou uma resposta vazia.');
    }

    // Limpa eventuais marcações markdown de crase caso a IA as insira
    const cleanJsonText = rawAiText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsedDiagnosis = JSON.parse(cleanJsonText);

    // Retorna o diagnóstico gerado com sucesso ao navegador!
    return res.status(200).json({
      success: true,
      data: parsedDiagnosis
    });

  } catch (error) {
    console.error('❌ Erro no processamento do Motor ZDE na Vercel:', error);
    return res.status(500).json({
      error: 'Erro no processamento da IA',
      message: error.message || 'Falha ao processar diagnóstico no Google Gemini.',
      fallback_required: true
    });
  }
}
