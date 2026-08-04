# ESTRUTURA MODULAR DO BRIEFING — ZVI (ZDE v1.1)
**Versão:** 1.0  
**Conceito:** Fricção Zero | Resposta Rápida & Estratégica  
**Conectividade:** Compatível 1:1 com a skill `SKILL_ZDE_v1.1.md` e com a futura interface Web / App Interno da Zellgo.

---

## 🎨 Princípio de Design (UX do Formulário)
O formulário foi desenhado para ser **sucinto, direto e sem burocracia**.  
* **Para a Equipe Zellgo (Uso Interno):** Permite preencher em menos de 5 minutos com notas soltas colhidas em reuniões ou chamadas rápidas.  
* **Para o Cliente (Página Externa no Site):** Apresenta um layout Dark Mode Premium, interativo e leve, com perguntas abertas de múltipla escolha ou texto curto, evitando sensação de "interrogatório bancário".

---

## 📦 OS 8 BLOCOS DO DISCOVERY ENGINE

### 🟢 BLOCO A — Identidade & Empresa
*O ponto de partida: entender o terreno e o tempo de jogo.*
1. **Nome da Empresa / Marca:**  
   *(Ex: Zellgo Tech / Dr. Lucas Ortodontia)*
2. **Segmento e Nicho de Atuação:**  
   *(Ex: Saúde, Incorporação Imobiliária, E-commerce B2B)*
3. **O que vendem (Produtos/Serviços Principais):**  
   *(Resumo curto de 1 ou 2 frases do core business)*
4. **Momento da Empresa:**  
   *( ) Lançamento / Startup (0-2 anos)*  
   *( ) Em expansão / Buscando escala*  
   *( ) Consolidada, mas precisando modernização digital*

---

### 🔵 BLOCO B — Mercado & Posicionamento
*Como a empresa se enxerga na arena competitiva.*
5. **Quem são seus 2 ou 3 maiores Concorrentes ou Referências no mercado?**  
   *(Nomes, sites ou perfis de Instagram)*
6. **Como o preço e percepção de valor estão posicionados hoje?**  
   *( ) Mais acessível / Volume*  
   *( ) Intermediário / Competitivo*  
   *( ) Premium / High-ticket (Foco em Autoridade/Exclusividade)*

---

### 🟣 BLOCO C — Público & Persona
*Quem compra e por qual razão.*
7. **Quem é o Cliente Ideal (B2C ou B2B)?**  
   *(Ex: Diretores financeiros de indústrias, ou Mulheres classe A/B de 30-45 anos)*
8. **Qual é a principal dor ou desejo do seu cliente na hora da compra?**  
   *(O que tira o sono de quem compra seu serviço?)*

---

### 🟠 BLOCO D — Marca & Diferenciais
*A blindagem da percepção e ativos visuais.*
9. **Qual é o seu Diferencial Exclusivo? Por que escolhem você e não o concorrente?**  
   *(Se não souber responder com certeza, marque como: "Em Definição")*
10. **Como está a Maturidade da Marca hoje?**  
    *( ) Não temos identidade profissional ou logotipo estabelecido*  
    *( ) Temos logo básico, mas sem manual ou coesão visual moderna*  
    *( ) Temos Identidade e Manual da Marca profissionais e atualizados*

---

### 🔴 BLOCO E — Presença & Canais de Tração
*O motor de marketing e geração de demanda atual.*
11. **De onde vem a maioria dos novos clientes HOJE?** *(Marque os principais)*  
    *( ) Indicação / Boca a boca / Orgânico*  
    *( ) Tráfego Pago (Instagram Ads / Google Ads / LinkedIn)*  
    *( ) Prospecção ativa / Equipe de vendas na rua*
12. **Quais canais sociais estão ativos hoje?**  
    *(Instagram, YouTube, LinkedIn, TikTok, Blog, Podcast...)*

---

### 🟡 BLOCO F — Ativos Digitais & Tecnologia
*O inventário digital e estrutura de conversão no front-end.*
13. **Endereço do Site e Landing Pages atuais (se houver):**  
    *(URL do site para análise do ZDE)*
14. **Qual a sua percepção sobre o seu site atual?**  
    *( ) Não temos site (operamos só em redes sociais)*  
    *( ) Site antigo, lento ou que não converte bem em dispositivos móveis*  
    *( ) Site moderno e rápido, mas queremos evoluir / integrar tecnologias*
15. **Quais ferramentas usam no dia a dia?**  
    *(Ex: RD Station, WordPress, HubSpot, Meta Ads, Google Analytics, Excel)*

---

### 🟤 BLOCO G — Comercial & Operação
*A engrenagem dos bastidores e a caça por ineficiências manuais.*
16. **Como funciona o atendimento de novos leads/pedidos?**  
    *( ) Manualmente pelo WhatsApp / Direct com equipe humana*  
    *( ) Formulário ou e-mail que demora para ser respondido*  
    *( ) Já possuímos alguma automação ou chatbot básico*
17. **Qual é o maior gargalo ou reclamação operacional interna hoje?**  
    *(Ex: Demora para produzir vídeos, leads frios no WhatsApp, desorganização no comercial)*

---

### ⚪ BLOCO H — Objetivos & Restrições (O Escopo)
*Para onde o barco deve navegar nos próximos meses.*
18. **Qual é o principal objetivo para os próximos 90 dias com a Zellgo?**  
    *(Ex: Criar nova marca, dobrar leads com LP de alta conversão, automatizar atendimento com Agentes IA, produzir conteúdos cinematográficos por IA)*
19. **Expectativa de Prazo e Prioridade:**  
    *( ) Urgência total (Implementação imediata / Quick Wins)*  
    *( ) Planejamento estruturado para lançamento em 30 a 60 dias*
20. **Existe uma estimativa ou limiar de orçamento alocado para este salto de crescimento?**  
    *(Opcional - Ajuda a equipe Zellgo a dimensionar o pacote de serviços)*

---

## 🛠️ Conexão com o Sistema (JSON Schema Blueprint)
*Esboço estrutural do payload que a aplicação web (Front-End) enviará ao motor ZDE para processamento automático:*
```json
{
  "bloco_A": { "nome": "", "nicho": "", "core_business": "", "momento": "" },
  "bloco_B": { "concorrentes": [], "posicionamento": "" },
  "bloco_C": { "persona": "", "dor_principal": "" },
  "bloco_D": { "diferencial": "", "maturidade_marca": "" },
  "bloco_E": { "origem_clientes": [], "canais_ativos": [] },
  "bloco_F": { "site_url": "", "status_site": "", "tech_stack": [] },
  "bloco_G": { "tipo_atendimento": "", "gargalo_operacional": "" },
  "bloco_H": { "meta_90_dias": "", "prazos": "", "orcamento_esperado": "" }
}
```
*Fim do Documento.*
