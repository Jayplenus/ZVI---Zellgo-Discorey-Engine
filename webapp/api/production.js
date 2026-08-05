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
Sua missão: Você NÃO decide mais estratégia geral nem discute preços; você EXECuta a produção e formula as 5 Bibliotecas Metodológicas da Zellgo para potencializar a equipe, o diretor de criação e o cliente.
O prompt sozinho envelhece rápido; o Blueprint vira metodologia imbatível. O ZPE existe para AUMENTAR e potencializar o diretor criativo e os engenheiros da Zellgo, nunca substituí-los com obviedades de IA.

Abaixo está o JSON da estratégia comercial aprovada do Motor 2 (ZSE):
${JSON.stringify(zseInput, null, 2)}

Sua tarefa é compilar o pacote executivo de produção de altíssimo nível e DEVOLVER UMA RESPOSTA EXCLUSIVAMENTE EM JSON VÁLIDO (sem markdown de crases ou textos adicionais fora do JSON), seguindo rigorosamente o esquema abaixo para as 5 Bibliotecas Mestras:

{
  "cliente": "Nome do Cliente / Empresa",
  "segmento": "Segmento da Empresa",
  "status": "Pacote Metodológico de Produção Concluído • ZPE v1.0",
  
  "biblioteca_1_ia_bot": {
    "identidade": "Quem é o agente? (Ex: Assistente Executiva Virtual e Consultora de Vendas da [Empresa])",
    "personalidade": "Tom de voz resoluto, elegante, empático e focado na resolução de dores.",
    "objetivo_principal": "Atender cotações no WhatsApp em menos de 15 segundos e agendar reuniões/pedidos qualificados sem inchar folha salarial.",
    "regras_atendimento": [
      "Responder de forma cordial e objetiva em blocos curtos (estilo WhatsApp).",
      "Sempre ancorar autoridade da marca antes de passar faixas de preço."
    ],
    "perguntas_qualificacao": [
      "Qual é a sua demanda urgente ou produto de interesse?",
      "Para qual data ou prazo você precisa desta solução?"
    ],
    "fluxo_conversacional": "1. Saudação & Enquadramento ➔ 2. Diagnóstico Rápido ➔ 3. Apresentação do Diferencial ➔ 4. Fechamento ou Escalonamento",
    "situacoes_proibidas": "Nunca prometer descontos excessivos nem citar concorrentes pelo nome ou falar 'sou uma IA experimental'.",
    "escalonamento_humano": "Acionar o consultor humano no WhatsApp quando o cliente pedir atendimento personalizado ou orçamento customizado de alto porte.",
    "prompt_copy_paste": "Você é o Agente Inteligente da [Empresa], operando pelo sistema Zellgo Bot 24/7. Seu tom é sofisticado, resoluto e acolhedor. Sua prioridade máxima é conduzir o cliente do primeiro contato à cotação qualificada. Siga estas regras invioláveis: ..."
  },

  "biblioteca_2_digital_exp": {
    "hero_promessa": "Título de alto impacto com a Promessa Principal de Valor (Sem clichês de 'atendimento humanizado')",
    "problema_dor": "A principal dor ou frustração que o cliente do mercado enfrenta hoje quando contrata concorrentes comuns",
    "mecanismo_unico": "O coração metodológico da empresa! Por que somos únicos? (Ex: Sistema 360° que combina Diagnóstico + Automação + Precisão de Entrega)",
    "solucao": "Como resolvemos o problema usando nosso Mecanismo Único e tecnologia de ponta",
    "prova_autoridade": "Elementos de confiança, garantia de qualidade e posicionamento de autoridade inquestionável",
    "processo": "Passo a passo transparente de como funciona contratar ou comprar (Passo 1, 2 e 3)",
    "oferta": "A chamada irresistível para o próximo passo comercial",
    "faq_objecoes": [
      { "pergunta": "Qual a garantia de prazos e qualidade?", "resposta": "Nosso mecanismo blinda cada etapa da entrega..." },
      { "pergunta": "Como funciona o atendimento?", "resposta": "Suporte ágil via Agente Inteligente 24/7 e consultoria humanizada." }
    ],
    "cta_final": "Botão de Ação de Alto Contratante (Ex: 'Solicitar Auditoria Gratuita com Especialista' ou 'Cotar Agora pelo Bot 24/7')"
  },

  "biblioteca_3_brand_direction": {
    "posicionamento": "Premium / High-End / Autoridade Técnica",
    "arquetipo": "Ex: O Governante & O Governador de Eficiência (Ou O Criador / O Mago, adaptado à realidade)",
    "personalidade": "Confiável, sofisticada, inovadora e direta.",
    "tom_verbal": "Voz de especialista com autoridade clínica, evitando adjetivos vazios ou promessas genéricas.",
    "palavras_usar": ["Eficiência", "Precisão", "Mecanismo Único", "Autoridade", "Garantia Operacional", "Alavancagem"],
    "palavras_proibidas": ["Baratinho", "Orçamento grátis sem compromisso", "Promoção imperdível", "Atendimento humanizado comunzinho", "Mais um do mercado"],
    "sensacao_desejada": "Segurança, tranquilidade operacional e admiração imediata na vitrine.",
    "direcao_visual": "Design limpo, tipografia expressiva e paleta equilibrada em contraste noturno ou industrial de alto padrão.",
    "paleta_sugerida": [
      { "cor": "Primária de Autoridade", "hex": "#0F172A", "justificativa": "Azul Noturno / Slate para estabilidade e rigor executivo." },
      { "cor": "Acento Vibrante", "hex": "#F43F5E", "justificativa": "Rosa Vibrante ou Ouro para capturar a atenção na conversão de botões e highlights." },
      { "cor": "Base Neutra", "hex": "#F8FAFC", "justificativa": "Branco Geada para leitura impecável e suspiro visual." }
    ],
    "referencias_esteticas": "Minimalismo tecnológico estilo Apple, Linear e interfaces de consultoria suíça."
  },

  "biblioteca_4_growth_engine": {
    "icp_prioritario": "Perfil exato dos compradores com maior poder de decisão e urgência no setor",
    "canal_recomendado": "Ex: WhatsApp Automático + Campanhas de Intenção no Google Ads + Instagram de Autoridade",
    "oferta_entrada": "O gancho comercial que quebra a barreira de desconfiança do cliente inicial",
    "google_ads": {
      "palavras_chave": ["+contratar [serviço] profissional", "+melhor [segmento] na região", "+empresa de [segmento] especialista"],
      "negativas": ["-gratis", "-curso", "-vaga", "-emprego", "-como fazer em casa", "-barato"],
      "intencao": "Capturar o comprador no fundo do funil exatamente quando ele procura pela solução urgente."
    },
    "meta_ads": {
      "conceito_criativo": "Demonstração de Autoridade & Mecanismo Único",
      "hook": "Cansado de promessas vazias e atrasos ao contratar [Serviço]? Descubra por que líderes de mercado confiam no nosso Mecanismo Único.",
      "roteiro_short_reels": "Cena 1 (0-3s): Mostra o problema comum do concorrente. Cena 2 (3-8s): Apresenta o Mecanismo Único da marca. Cena 3 (8-15s): Chamada para testar o atendimento instantâneo no WhatsApp 24/7."
    },
    "lp_conectada": "Direcionamento 100% para a Landing Page High-End (Biblioteca 2) com bot ativo.",
    "metrica_principal": "Custo por Cotação Qualificada no WhatsApp (CPA Qualificado) e Tempo de Resposta."
  },

  "biblioteca_5_executive_delivery": {
    "apresentacao_titulo": "Plano Executivo de Transformação & Escopo Modular — [Nome do Cliente]",
    "resumo_executivo": "A Zellgo conduziu a auditoria diagnóstica (ZDE) e estruturou o escopo da virada (ZSE). Apresentamos a consolidação de engenharia (ZPE) para destravar vendas, elevar a autoridade digital e automatizar a recepção de leads com retorno observável sobre margem.",
    "proximos_passos": [
      "1. Aprovação formal dos módulos selecionados (Setup & Fee Operacional).",
      "2. Kick-off e calibração final da Identidade e Mecanismo Único (Dias 01 a 07).",
      "3. Ativação em ambiente de produção do Agente Inteligente Zellgo Bot 24/7 (Dias 08 a 15)."
    ],
    "cronograma_resumo": "Execução trimestral fatiada: Mês 1 (Fundação & Bot IA), Mês 2 (Vitrine & LP High-End), Mês 3 (Growth & Aceleração Contínua).",
    "responsabilidades": [
      { "papel": "Equipe Zellgo & Arquiteto Chefe", "dever": "Desenvolvimento do Mecanismo Único, calibração do Bot IA 24/7, design high-end e monitoramento de tráfego." },
      { "papel": "Cliente / Diretoria", "dever": "Validação das respostas técnicas de atendimento, envio de ativos logísticos e acompanhamento dos fechamentos comerciais." }
    ]
  }
}

REGRAS SOBERANAS DO MOTOR ZPE:
- É OBRIGATÓRIO preencher CADA UMA das 5 Bibliotecas com profundidade clínica e sofisticação de consultoria AAA.
- NO MECANISMO ÚNICO da Biblioteca 2: invente um nome proprietário brilhante e factível para a metodologia de trabalho da empresa analisada (ex: "Metodologia Blindada 360°", "Sistema de Precisão em 4 Etapas", "Protótipo Ágil de Conversão"), explicando por que ela destrói os concorrentes de preço baixo!
- RETORNE APENAS O JSON VERDADEIRO SEM FORMATAÇÕES DE MARKDOWN EXTERNAS OU COMIDA SOLTA.
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
