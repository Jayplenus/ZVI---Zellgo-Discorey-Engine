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

Sua tarefa é compilar o pacote executivo de produção de altíssimo nível e DEVOLVER UMA RESPOSTA EXCLUSIVAMENTE EM JSON VÁLIDO (sem markdown de crases ou textos adicionais fora do JSON), seguindo rigorosamente o esquema abaixo para as 5 Bibliotecas Mestras:

{
  "cliente": "Nome do Cliente / Empresa",
  "segmento": "Segmento específico da Empresa",
  "status": "Pacote Metodológico de Produção Concluído • ZPE v1.0",
  
  "biblioteca_1_ia_bot": {
    "identidade": "Defina quem é o agente centrado no nicho da empresa (Ex: Assistente Executiva e Consultora Técnica de Vendas da [Nome da Empresa])",
    "personalidade": "Tom de voz resoluto, elegante, empático e com autoridade técnica no setor do cliente.",
    "objetivo_principal": "Atender cotações e dúvidas técnicas sobre os produtos/serviços reais da empresa no WhatsApp em menos de 15 segundos, qualificando leads e fechando pedidos sem inchar folha salarial.",
    "regras_atendimento": [
      "Responder de forma cordial e objetiva em blocos curtos (estilo WhatsApp).",
      "Ancorar a tradição, capacidade e autoridade técnica da empresa antes de passar condições de investimento ou preços."
    ],
    "perguntas_qualificacao": [
      "Pergunta específica sobre o produto/serviço exato que o cliente deseja contratar ou comprar na empresa.",
      "Pergunta sobre volume, prazo ou urgência de entrega que seja realista para o modelo de negócio (B2B, atacado ou varejo)."
    ],
    "fluxo_conversacional": "1. Saudação & Enquadramento ➔ 2. Diagnóstico da Dor e Demanda ➔ 3. Apresentação do Mecanismo Único ➔ 4. Cotação/Fechamento ou Escalonamento",
    "situacoes_proibidas": "Nunca prometer descontos fora da política, nunca citar concorrentes pelo nome nem dizer 'sou uma IA experimental'.",
    "escalonamento_humano": "Acionar o consultor especialista humano no WhatsApp em negociações de alto porte, grandes volumes ou parcerias comerciais estratégicas.",
    "prompt_copy_paste": "Escreva o System Prompt COMPLETO E EXECUTÁVEL do Agente Inteligente, incluindo falas e instruções customizadas EXCLUSIVAMENTE para a realidade operativa da empresa, sem placeholders ou colchetes inacabados."
  },

  "biblioteca_2_digital_exp": {
    "hero_promessa": "Título de alto impacto com a Promessa Principal de Valor real e inconfundível do produto/serviço da empresa (sem clichês corporativos)",
    "problema_dor": "A principal dor, atraso ou frustração operacional que o comprador deste nicho enfrenta ao depender dos concorrentes comuns",
    "mecanismo_unico": "O coração metodológico da empresa! Invente um nome proprietário brilhante e relevante para o nicho (ex: para uma fábrica de gelo, algo como 'Sistema de Pureza Térmica & Logística Zero Queda 360°') explicando por que ele supera os concorrentes.",
    "solucao": "Como a empresa resolve o problema usando seu Mecanismo Único, sua estrutura de atendimento e sua excelência de entrega",
    "prova_autoridade": "Elementos de confiança reais baseados no diagnóstico: anos de consolidação, carteira de clientes, rigor técnico e capacidade de atendimento",
    "processo": "Passo a passo simples e prático em 3 etapas para cotar, contratar ou fazer um pedido na empresa",
    "oferta": "A chamada comercial irresistível para iniciar negociação ou pedido imediato",
    "faq_objecoes": [
      { "pergunta": "Objeção mais comum e específica do nicho da empresa?", "resposta": "Resposta técnica mostrando como a operação da marca blinda o cliente contra falhas." },
      { "pergunta": "Como funciona o suporte e cotação de urgência?", "resposta": "Atendimento instantâneo via Agente Inteligente 24/7 com suporte comercial humanizado e ágil." }
    ],
    "cta_final": "Botão de ação forte e focado na conversão imediata do nicho (Ex: 'Cotar Pedido no WhatsApp 24/7' ou 'Falar com Consultor Técnico')"
  },

  "biblioteca_3_brand_direction": {
    "posicionamento": "Posicionamento claro e diretivo adaptado ao perfil da marca (ex: Referência Industrial Confiável & High-End Operacional)",
    "arquetipo": "Arquétipo de marca perfeitamente justificado para o negócio (ex: O Governante da Excelência ou O Mago da Precisão)",
    "personalidade": "Confiável, pontual, inovadora, sólida e direta.",
    "tom_verbal": "Voz de especialista com autoridade clínica e industrial/comercial, eliminando promessas vagas ou adjetivos vazios.",
    "palavras_usar": ["Array com 6 palavras de autoridade e poder adaptadas EXCLUSIVAMENTE ao vocabulário e nicho da empresa (não use apenas palavras genéricas; inclua termos que remetam à força e exclusividade do produto)"],
    "palavras_proibidas": ["Array com 6 termos proibidos no marketing da marca, como: 'Baratinho', 'Orçamento grátis sem compromisso', 'Mais um do mercado' e clichês batidos do setor"],
    "sensacao_desejada": "Segurança absoluta na entrega, tranquilidade operacional e percepção de superioridade indiscutível na vitrine.",
    "direcao_visual": "Design limpo, tipografia sólida e imponente com contraste estudado para projetar excelência.",
    "paleta_sugerida": [
      { "cor": "Primária de Autoridade", "hex": "#0F172A", "justificativa": "Justificativa da cor primária alinhada à psicologia do segmento do cliente." },
      { "cor": "Acento de Conversão", "hex": "#0284C7", "justificativa": "Justificativa da cor vibrante para botões e chamadas de WhatsApp/Ação." },
      { "cor": "Base Neutra de Leitura", "hex": "#F8FAFC", "justificativa": "Base clara e limpa para respiro visual e leitura técnica impecável." }
    ],
    "referencias_esteticas": "Minimalismo funcional com acabamento de alta precisão e interfaces de alta performance."
  },

  "biblioteca_4_growth_engine": {
    "icp_prioritario": "Descrição exata do tomador de decisão (compradores B2B, gerentes, empresários ou consumidores exigentes) que busca qualidade e pontualidade na empresa",
    "canal_recomendado": "Mix de canais focado no faturamento rápido: WhatsApp Automático 24/7 + Google Ads (Intenção Urgente) + Instagram de Autoridade",
    "oferta_entrada": "A oferta de engajamento que quebra a barreira de entrada (cotação com atendimento zero fila e garantia de prazo)",
    "google_ads": {
      "palavras_chave": [
        "Array com 4 a 6 palavras-chave REAIS DE DESTAQUE DE INTENÇÃO DE COMPRA EXATA que os clientes deste segmento digitam no Google. PROIBIDO USAR TERMOS GENÉRICOS COMO '+contratar empresa especialista' OU '+melhor serviço profissional'! Use o nome real dos produtos/serviços do cliente, intenção B2B/atacado/varejo e busca local se aplicável (Exemplo para fábrica de gelo: '+comprar gelo em atacado', '+distribuidora de gelo na região', '+fábrica de gelo 24 horas', '+gelo em cubos para comércio')."
      ],
      "negativas": ["-gratis", "-curso", "-vaga", "-emprego", "-como fazer em casa", "-barato", "-usado", "-caseiro"],
      "intencao": "Capturar com precisão cirúrgica o comprador no momento exato em que busca pela solução com intenção imediata de negociação."
    },
    "meta_ads": {
      "conceito_criativo": "Demonstração de força operacional, confiabilidade e superioridade do Mecanismo Único da empresa no feed/stories",
      "hook": "Gancho magnético e específico para o setor do cliente nos primeiros 3 segundos. PROIBIDO USAR CLICHÊS GENÉRICOS COMO 'Cansado de atrasos ao contratar serviços?'. Escreva uma frase forte e provocativa tocando no problema específico que o cliente do nicho enfrenta na sua rotina!",
      "roteiro_short_reels": "ROTEIRO PRONTO E COMPLETO em 3 cenas, com a fala/áudio real do narrador e a indicação de câmera/vídeo específicos para o negócio do cliente. PROIBIDO APRESENTAR APENAS RESUMOS TEÓRICOS DE CENA COMO 'Cena 1: Quebrar o clichê do mercado'. ESCREVA AS FALAS ESPECÍFICOS mencionando o nome, os anos de história e o produto real do cliente!"
    },
    "lp_conectada": "Direcionamento integral para a Landing Page High-End (Biblioteca 2) com o Agente Inteligente pronto para responder no WhatsApp.",
    "metrica_principal": "Custo por Cotação Qualificada no WhatsApp (CPA Qualificado) com Tempo de Resposta inferior a 15 segundos."
  },

  "biblioteca_5_executive_delivery": {
    "apresentacao_titulo": "Plano Executivo de Transformação & Engenharia Modular — [Nome Real do Cliente]",
    "resumo_executivo": "Síntese executiva mostrando como as bibliotecas ZPE (automação IA, vitrine digital, posicionamento de autoridade e tráfego de alta intenção) resolvem os gargalos identificados na auditoria ZDE e alavancam o crescimento sólido sem dependência de indicação manual.",
    "proximos_passos": [
      "1. Aprovação do plano modular e cronograma de desdobramento (Setup & Fee Operacional).",
      "2. Kick-off e calibração fina da Identidade Visual e Mecanismo Único da marca (Dias 01 a 07).",
      "3. Ativação em produção do Agente Inteligente Zellgo Bot 24/7 e campanhas de aquisição (Dias 08 a 15)."
    ],
    "cronograma_resumo": "Execução estruturada: Mês 1 (Fundação & Bot IA 24/7), Mês 2 (Vitrine High-End & LP do Mecanismo Único), Mês 3 (Growth, Campanhas & ROI de Margem).",
    "responsabilidades": [
      { "papel": "Equipe Zellgo & Arquiteto Chefe", "dever": "Desenvolvimento do Mecanismo Único proprietário, calibração do Bot IA 24/7, design high-end e gestão contínua de tráfego de intenção." },
      { "papel": "Cliente / Diretoria", "dever": "Validação técnica do fluxo de atendimento, fornecimento de ativos operacionais e acompanhamento dos fechamentos de vendas no CRM/WhatsApp." }
    ]
  }
}

REGRAS SOBERANAS DO MOTOR ZPE (LEI MARCIAL ANTI-GENÉRICA):
1. PROIBIDO CONTEÚDO GENÉRICO OU RESUMOS DE TEMPLATE: Você está operando sobre dados profundos de diagnóstico de uma empresa real (ex: se o cliente é uma FÁBRICA DE GELO CONSOLIDADA HÁ 40 ANOS, um restaurante, uma clínica ou corretora, TODOS os textos, roteiros de reels, hooks de anúncios e palavras de marca têm que exalar o vocabulário real, a tradição e os produtos específicos do setor!).
2. REGRA DE OURO PARA O GOOGLE ADS: NUNCA, SOB HIPÓTESE ALGUMA, gere palavras-chave preguiçosas ou genéricas como "+contratar empresa especialista", "+melhor serviço profissional" ou termos com colchetes. Crie termos comerciais REAIS e ESPECÍFICOS para o produto/serviço que a empresa vende!
3. REGRA DE OURO PARA O META ADS (HOOK E ROTEIRO REELS): 
   - NUNCA use hooks de template escolar como "Cansado de atrasos ao contratar serviços?". Escreva um hook poderoso, chamando a atenção do decisor específico daquele setor para o maior pesadelo ou desejo da sua rotina.
   - NUNCA escreva resumos teóricos para o Roteiro do Reels ("Cena 1: Quebrar o clichê do mercado. Cena 2: Apresentar o Mecanismo Único..."). Você é O ENGENHEIRO E CRIADOR: escreva o texto COMPLETO do roteiro para ser gravado imediatamente, com as FALAS/LOCOÇÃO ESCRITAS VERBATIM e instruções da CENA VISUAL (ex: "Cena 1 (Visual: Gelo cristalino caindo em escala industrial...) - Áudio Locutor: 'Seu comércio não pode parar porque faltou gelo em pleno fim de semana...'").
4. PROFUNDIDADE CLÍNICA E CONSULTORIA AAA: O Mecanismo Único deve ser um conceito proprietário brilhante aplicável à realidade de engenharia ou serviço do cliente, diferenciando-o drasticamente na competição por preço baixo.
5. RETORNE APENAS O JSON VERDADEIRO SEM FORMATAÇÕES DE MARKDOWN EXTERNAS OU COMIDA SOLTA.
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
