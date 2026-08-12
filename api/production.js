/* ==========================================================================
   ZELLGO PRODUCTION ENGINE (ZPE v1.0) — VERCEL SERVERLESS AI BACK-END
   A Fábrica de Execução: Transforma Estratégia em 5 Bibliotecas Metodológicas
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
    return res.status(405).json({ error: 'Método não permitido. Utilize POST para acionar o Motor ZPE.' });
  }

  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: 'API Key do Google não configurada',
      message: 'Variável GOOGLE_API_KEY ausente na Vercel para o Motor ZPE.',
      fallback_required: true
    });
  }

  try {
    let zseInput = req.body || {};
    if (typeof req.body === 'string') {
      try { zseInput = JSON.parse(req.body); } catch(e) {}
    }

    const promptInstructs = `
Você é o Motor de Produção e Engenharia Metodológica Zellgo Production Engine (ZPE v1.0), o terceiro motor da suíte ZVI OS (zellgo.com.br).
Sua missão: Você NÃO decide mais estratégia geral nem discute preços; você EXECUTA a produção e formula as 5 Bibliotecas Metodológicas da Zellgo para potencializar a equipe, o diretor de criação e o cliente.
O prompt sozinho envelhece rápido; o Blueprint vira metodologia imbatível. O ZPE existe para AUMENTAR e potencializar o diretor criativo e os engenheiros da Zellgo, nunca substituí-los com obviedades ou textos genéricos de IA.

Abaixo estão os dados do Diagnóstico (Motor 1 - ZDE) e da Estratégia Comercial aprovada (Motor 2 - ZSE):
${JSON.stringify(zseInput, null, 2)}

Sua tarefa é compilar o pacote executivo de produção de altíssimo nível e DEVOLVER UMA RESPOSTA EXCLUSIVAMENTE EM JSON VÁLIDO (sem markdown de crases ou textos adicionais fora do JSON), seguindo rigorosamente a ESTRUTURA abaixo.
MUITO IMPORTANTE: Os valores contidos no esquema abaixo são APENAS DESCRITIVOS de formato. Você NÃO DEVE INVENTAR decisões estratégicas (como Bot 24/7, Google Ads, Arquétipos específicos) a menos que elas tenham sido solicitadas ou sugeridas no diagnóstico (ZDE) ou na estratégia (ZSE) enviada a você. Tudo o que você produzir nas bibliotecas DEVE ser fundamentado exclusivamente nos dados fornecidos do ZDE e ZSE. Se não houver contexto suficiente, mantenha a neutralidade ou indique a falta de dados.

{
  "cliente": "NOME DO CLIENTE",
  "segmento": "SEGMENTO",
  "status": "Pacote Metodológico de Produção Concluído • ZPE v1.1",
  
  "biblioteca_1_ia_bot": {
    "identidade": "[SE SOLICITADO NO ZDE/ZSE: Crie a identidade do agente IA para o cliente]",
    "personalidade": "[SE SOLICITADO: Defina o tom de voz do agente com base no cliente]",
    "objetivo_principal": "[SE SOLICITADO: Objetivo de negócio da IA]",
    "regras_atendimento": [
      "[Regra 1 customizada para o cliente]",
      "[Regra 2 customizada para o cliente]"
    ],
    "perguntas_qualificacao": [
      "[Pergunta 1 para o contexto do cliente]",
      "[Pergunta 2 para o contexto do cliente]"
    ],
    "fluxo_conversacional": "[Passo a passo conversacional do bot]",
    "situacoes_proibidas": "[O que a IA não deve fazer neste negócio]",
    "escalonamento_humano": "[Quando transferir para o humano no contexto do cliente]",
    "prompt_copy_paste": "[System Prompt executável do agente, SE a automação for parte da estratégia]"
  },

  "biblioteca_2_digital_exp": {
    "hero_promessa": "[Promessa Principal baseada na estratégia ZSE]",
    "problema_dor": "[Principal dor identificada no ZDE]",
    "mecanismo_unico": "[SE SOLICITADO NO ZSE: Nome proprietário do mecanismo/solução desenvolvido para a empresa]",
    "solucao": "[Como a empresa resolve o problema usando sua solução]",
    "prova_autoridade": "[Provas reais baseadas no ZDE]",
    "processo": "[Passo a passo prático para compra]",
    "oferta": "[Chamada comercial definida para o cliente]",
    "faq_objecoes": [
      { "pergunta": "[Objeção real do cliente]", "resposta": "[Resposta quebra-objeção]" }
    ],
    "cta_final": "[Botão de ação (CTA) alinhado à estratégia]"
  },

  "biblioteca_3_brand_direction": {
    "posicionamento": "[Posicionamento extraído/deduzido a partir do ZDE/ZSE]",
    "arquetipo": "[Arquétipo mais adequado aos dados do ZDE/ZSE]",
    "personalidade": "[Traços de personalidade da marca]",
    "tom_verbal": "[Diretrizes de tom de voz para a comunicação]",
    "palavras_usar": ["Array de palavras fortes e específicas para o vocabulário do cliente"],
    "palavras_proibidas": ["Array de palavras proibidas ou clichês do setor do cliente"],
    "sensacao_desejada": "[O que a marca deve transmitir]",
    "direcao_visual": "[Direção de design alinhada ao posicionamento]",
    "paleta_sugerida": [
      { "cor": "[Nome da Cor]", "hex": "[Hexadecimal compatível]", "justificativa": "[Por que usar esta cor no contexto do cliente]" }
    ],
    "referencias_esteticas": "[Estilo visual e interface]"
  },

  "biblioteca_4_growth_engine": {
    "icp_prioritario": "[Público-alvo extraído do ZDE/ZSE]",
    "canal_recomendado": "[Canais definidos na Estratégia ZSE (não invente canais não solicitados)]",
    "oferta_entrada": "[Oferta definida no ZSE]",
    "google_ads": {
      "palavras_chave": [
        "[Array de palavras-chave REAIS e ESPECÍFICAS para intenção de compra no setor do cliente, SE Google Ads for parte da estratégia]"
      ],
      "negativas": ["[Array de palavras-chave negativas para o setor do cliente]"],
      "intencao": "[A estratégia de busca exata]"
    },
    "meta_ads": {
      "conceito_criativo": "[Direção do criativo SE Meta Ads for utilizado]",
      "hook": "[Gancho específico para a dor do ICP, sem clichês]",
      "roteiro_short_reels": "[Roteiro adaptado ao cliente, com falas e instruções]"
    },
    "lp_conectada": "[Como o tráfego se conecta com a conversão]",
    "metrica_principal": "[Métrica de sucesso principal alinhada ao objetivo]"
  },

  "biblioteca_5_executive_delivery": {
    "apresentacao_titulo": "[Título do Plano Executivo para o Cliente]",
    "resumo_executivo": "[Resumo de como a estratégia atende aos gaps do ZDE]",
    "proximos_passos": [
      "[Passo 1 baseado na estratégia]",
      "[Passo 2]"
    ],
    "cronograma_resumo": "[Fases da execução]",
    "responsabilidades": [
      { "papel": "Equipe", "dever": "Tarefas" },
      { "papel": "Cliente", "dever": "Validações" }
    ]
  }
}

REGRAS SOBERANAS DO MOTOR ZPE (ZPE v1.1 - FIDELIDADE DE PRODUÇÃO):
1. ESTRITA FIDELIDADE: O ZPE NÃO DEVE INVENTAR tecnologias, serviços ou metodologias (como "Bots de IA", "Mecanismo Único", "Google Ads") se eles não estiverem alinhados com o diagnóstico (ZDE) e a estratégia (ZSE). Trabalhe EXCLUSIVAMENTE com o que foi passado.
2. NADA DE TEMPLATES FIXOS: Abandone textos genéricos. Escreva o conteúdo das bibliotecas com profundidade técnica e vocabulário real do setor do cliente.
3. RETORNE APENAS O JSON VERDADEIRO SEM FORMATAÇÕES DE MARKDOWN EXTERNAS.
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
          temperature: 0.4,
          response_mime_type: 'application/json'
        }
      })
    });

    if (!apiResponse.ok) {
      const errText = await apiResponse.text();
      throw new Error(`Erro na API do Google no Motor ZPE: ${apiResponse.status} - ${errText}`);
    }

    const geminiData = await apiResponse.json();
    const rawAiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawAiText) {
      throw new Error('A API do Google retornou uma resposta vazia para o Motor ZPE.');
    }

    const cleanJsonText = rawAiText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsedProduction = JSON.parse(cleanJsonText);

    return res.status(200).json({
      success: true,
      engine: "ZPE v1.0 Production Engine",
      data: parsedProduction
    });

  } catch (error) {
    console.error('❌ Erro no processamento do Motor ZPE na Vercel:', error);
    return res.status(500).json({
      error: 'Erro no processamento ZPE',
      message: error.message || 'Falha ao gerar bibliotecas de produção.',
      fallback_required: true
    });
  }
}
