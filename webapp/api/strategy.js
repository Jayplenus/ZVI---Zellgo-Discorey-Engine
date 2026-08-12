/* ==========================================================================
   ZELLGO STRATEGY ENGINE (ZSE v1.0) — VERCEL SERVERLESS AI BACK-END
   Motor de Inteligência Comercial e Proposta (Transforma Diagnóstico em Escopo)
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
    return res.status(405).json({ error: 'Método não permitido. Utilize POST para acionar o Motor ZSE.' });
  }

  const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: 'API Key do Google não configurada',
      message: 'Variável GOOGLE_API_KEY ausente na Vercel para o Motor ZSE.',
      fallback_required: true
    });
  }

  try {
    let zdeInput = req.body || {};
    if (typeof req.body === 'string') {
      try { zdeInput = JSON.parse(req.body); } catch(e) {}
    }

    const promptInstructs = `
Você é o Motor de Inteligência Estratégica e Comercial Zellgo Strategy Engine (ZSE v1.0), o segundo motor da arquitetura ZVI (Zellgo Visual Intelligence OS - zellgo.com.br).
Sua missão: Você recebe o relatório JSON de Diagnóstico gerado pelo motor anterior (ZDE) e responde com precisão cirúrgica à pergunta: "O que a Zellgo deve fazer para resolver o negócio deste cliente?".
Você transforma: Problema ➔ Estratégia ➔ Solução ➔ Escopo ➔ Proposta.

Abaixo está o relatório JSON do ZDE recebido na entrada do sistema:
${JSON.stringify(zdeInput, null, 2)}

Sua tarefa é gerar uma estratégia comercial e de escopo de alto padrão, devolvendo uma resposta EXCLUSIVAMENTE EM JSON VÁLIDO (sem formatação markdown de crases ou texto externo), obedecendo rigorosamente a este esquema estrutural.
MUITO IMPORTANTE: Os valores inseridos neste JSON (como "92% de Alavancagem", etc.) são APENAS UM EXEMPLO FICTÍCIO. VOCÊ DEVE GERAR SEUS PRÓPRIOS VALORES REAIS baseando-se EXCLUSIVAMENTE nos dados recebidos. Se os dados de entrada estiverem vazios, retorne índices zerados e indique falta de informações.

{
  "cliente": "Nome da empresa identificada no diagnóstico",
  "segmento": "Segmento da empresa",
  "indice_oportunidade": "92% de Alavancagem Comercial (ou taxa percentual similar baseada nas lacunas encontradas)",
  "mapeamento": {
    "problema": "O problema raiz diagnosticado (ex: Baixa autoridade digital, dependência de indicação manual ou lentidão no atendimento no WhatsApp)",
    "estrategia": "A estratégia da virada (ex: Construção de posicionamento premium e automação imediata de captação)",
    "solucao": "As ferramentas integradas da Zellgo (ex: Branding + Website High-End + Agente IA 24/7 no WhatsApp + Tráfego Cirúrgico)"
  },
  "modulos_prioritarios": [
    { "icone": "🎨", "categoria": "Branding & Identidade", "titulo": "Reposição Visual Premium", "desc": "Desenvolvimento ou refinamento da identidade de marca e manual para projetar autoridade imediata." },
    { "icone": "🌐", "categoria": "Website & Plataforma", "titulo": "Vitrine & Landing Page High-End", "desc": "Estrutura web moderna e elegante focada em converter visitantes em cotações qualificadas." },
    { "icone": "🤖", "categoria": "IA & Automação", "titulo": "Agente de Conversão no WhatsApp (Zellgo Bot)", "desc": "Atendimento automatizado 24/7 para responder cotações e eliminar perda de clientes no tempo de espera." },
    { "icone": "📱", "categoria": "Conteúdo & Autoridade", "titulo": "Linha Editorial & Social", "desc": "Estratégia de comunicação diretiva para redes sociais e apresentações comerciais." },
    { "icone": "🎯", "categoria": "Tráfego & Campanhas", "titulo": "Ativação de Aquisição", "desc": "Campanhas locais de alta precisão para alimentar o funil de vendas sem desperdício de verba." }
  ],
  "roadmap_90_dias": [
    { "etapa": "Mês 1: Fundação", "titulo": "Estruturação & Automação IA", "acao": "Implementação do Agente Inteligente no WhatsApp 24/7 e alinhamento do posicionamento comercial." },
    { "etapa": "Mês 2: Construção", "titulo": "Lançamento da Autoridade", "acao": "Ativação das novas interfaces digitais e Landing Page de alta conversão no mercado." },
    { "etapa": "Mês 3: Escala & Aceleração", "titulo": "Expansão do Funil e ROI", "acao": "Otimização de campanhas pagas e mensuração do crescimento de margem e lucros do trimestre." }
  ],
  "investimento_estrategico": {
    "fundacao_label": "Fundação (Setup Modular Essencial)",
    "fundacao_val": "R$ 3.500 a R$ 6.500",
    "construcao_label": "Construção (Expansão de Canais & Vitrine)",
    "construcao_val": "R$ 4.500 a R$ 7.000",
    "aceleracao_label": "Aceleração (Retainer & Manutenção Evolutiva)",
    "aceleracao_val": "+ a partir de R$ 1.600 / mês"
  }
}

REGRAS RÍGIDAS DE INTELIGÊNCIA COMERCIAL E PRECIFICAÇÃO MODULAR (ZSE v1.0 / ZDE v2.3):
- NUNCA mencione "preço gerado pela IA" ou textos similares! Apresente como "Investimento Estratégico Zellgo".
- É OBRIGATÓRIO manter a objetividade numérica nos valores (range real), aplicando nossa política de valores fatiados por módulos:
  * PARA EMPRESAS PEQUENAS OU OPERAÇÕES ENXUTAS (até R$ 35k faturamento / 1 a 6 funcionários / Tier 1):
    - 'fundacao_val': OBRIGATÓRIO usar um range claro entre "R$ 3.500 a R$ 6.500" (ex: Agente IA WhatsApp + Reposição Visual ou Site).
    - 'construcao_val': OBRIGATÓRIO usar um range complementar como "R$ 3.500 a R$ 5.500" ou "R$ 4.500 a R$ 7.000" para a segunda etapa de ampliação.
    - 'aceleracao_val': OBRIGATÓRIO ser "+ a partir de R$ 1.600 / mês" (Fee mensal mínimo inviolável no Tier 1 para evoluir a inteligência artificial e manter a estrutura).
  * PARA EMPRESAS MÉDIAS (faturamento R$ 40k a 150k / Tier 2):
    - 'fundacao_val': "R$ 8.000 a R$ 14.000".
    - 'construcao_val': "R$ 6.000 a R$ 9.500".
    - 'aceleracao_val': "+ R$ 2.500 a R$ 3.500 / mês".
  * PARA EMPRESAS GRANDES OU PROJETOS AAA (Tier 3):
    - 'fundacao_val': "R$ 16.000 a R$ 25.000+".
    - 'construcao_val': "R$ 12.000 a R$ 18.000".
    - 'aceleracao_val': "+ a partir de R$ 4.500 / mês".
- RETORNE EXCLUSIVAMENTE O JSON VERDADEIRO SEM COMIDA OU CITAÇÃO DE MARKDOWN NA FORMA DE TEXTO SOLTO.
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;

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
      throw new Error(`Erro na API do Google no Motor ZSE: ${apiResponse.status} - ${errText}`);
    }

    const geminiData = await apiResponse.json();
    const rawAiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawAiText) {
      throw new Error('A API do Google retornou uma resposta vazia para o Motor ZSE.');
    }

    const cleanJsonText = rawAiText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsedStrategy = JSON.parse(cleanJsonText);

    return res.status(200).json({
      success: true,
      engine: "ZSE v1.0",
      data: parsedStrategy
    });

  } catch (error) {
    console.error('❌ Erro no processamento do Motor ZSE na Vercel:', error);
    return res.status(500).json({
      error: 'Erro no processamento ZSE',
      message: error.message || 'Falha ao gerar estratégia.',
      fallback_required: true
    });
  }
}
