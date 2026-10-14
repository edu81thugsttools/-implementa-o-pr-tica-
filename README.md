# SAID Framework — DeepSeek + JSON Contract Validation

Projeto demonstrativo do **Método SAID (Sistema de Arquitetura, Integração e Desempenho com IA)**. O exemplo mostra como separar regras de negócio determinísticas da explicação gerada por um LLM, validar o contrato JSON com Zod e medir latência/tokens da chamada.

> **Estado do projeto:** protótipo local de portfólio. Usa uma política fixa fictícia para demonstrar o fluxo. Ainda não implementa embeddings, banco vetorial, recuperação semântica (RAG), MCP ou deploy de produção. Não utilize os dados nem a regra de exemplo para decisões reais de transporte.

## Arquitetura

```text
Entrada de teste
    │
    ▼
Validação Zod + regras determinísticas
    │  calcula peso líquido, excesso e status
    ▼
Fatos calculados (fonte de verdade)
    │
    ▼
DeepSeek JSON Mode (gera explicação, não decide o status)
    │
    ▼
JSON.parse + validação Zod
    │
    ├── inválido/vazio/erro API → bloqueia a saída
    ▼
Resultado final + latência medida + uso de tokens
```

## Requisitos

- Node.js LTS instalado
- Git instalado
- VS Code ou outro editor
- Chave da API DeepSeek para a execução conectada (a execução dos testes não precisa da chave)

## 1. Preparar o projeto

Baixe o ZIP do projeto e extraia a pasta `said-framework-deepseek`. Abra essa pasta no VS Code e escolha **Terminal → New Terminal**.

Confira as versões:

```bash
node --version
npm --version
git --version
```

Instale as dependências:

```bash
npm install
```

## 2. Execute testes sem consumir API

```bash
npm test
npm run typecheck
```

Os testes cobrem cálculo do peso líquido, limite e tolerância, entrada inválida e rejeição de campos extras. Eles não chamam a API DeepSeek.

## 3. Configurar a chave DeepSeek localmente

1. Crie/consulte sua chave na plataforma oficial DeepSeek.
2. Na raiz do projeto, copie `.env.example` para `.env`.
3. Edite `.env` e configure `DEEPSEEK_API_KEY` com sua chave real.
4. Mantenha a linha `DEEPSEEK_MODEL=deepseek-flash` ou escolha um modelo suportado pela sua conta/API.

**Nunca publique `.env`, nunca cole a chave em README, código, issues ou mensagens.** O `.gitignore` já exclui `.env`. Se uma chave vazar, revogue-a e gere outra.

No Windows PowerShell, para criar o arquivo a partir do exemplo:

```powershell
Copy-Item .env.example .env
```

## 4. Executar a demonstração conectada

```bash
npm run dev
```

Essa etapa faz uma chamada paga à API, conforme a tarifa vigente da sua conta. O exemplo usa dados fictícios: peso bruto de 45.000 kg, tara de 15.000 kg, peso líquido de 30.000 kg, limite de 28.000 kg e tolerância de 5%. O cálculo e o status são decididos pelo código; o LLM apenas explica os fatos em JSON.

Se a resposta vier vazia, inválida ou fora do contrato, a aplicação bloqueia o resultado em vez de aceitá-lo silenciosamente.

## 5. Publicar no GitHub

### Caminho recomendado: criar repositório vazio

1. Entre no GitHub e clique em **New repository**.
2. Nome: `said-framework-deepseek`.
3. Escolha `Public` para divulgar o portfólio (ou `Private` enquanto desenvolve).
4. Para evitar conflito no primeiro push, não marque a criação automática de README, `.gitignore` ou licença — os arquivos já estão neste projeto.
5. Na raiz da pasta local, execute os comandos abaixo; troque `SEU-USUARIO` pelo seu usuário GitHub:

```bash
git init
git add .
git status
git commit -m "Initial SAID DeepSeek validation project"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/said-framework-deepseek.git
git push -u origin main
```

Antes do commit, confira `git status`: `.env` e `node_modules` não devem aparecer como arquivos a publicar. Se `git remote add origin` disser que `origin` já existe, confira com `git remote -v` em vez de repetir o comando.

## 6. Atualizar alterações depois

```bash
git add .
git commit -m "Describe your change"
git push
```

## Próximos incrementos no roadmap SAID

1. Separar configuração, domínio, integração com LLM, observabilidade e API HTTP.
2. Aumentar o dataset de testes e criar um relatório de Evaluation.
3. Implementar embeddings e recuperação vetorial real; citar IDs de documentos recuperados.
4. Adicionar autenticação, autorização, limites de consumo, timeout, retries controlados e tratamento de erros.
5. Implantar em ambiente de teste com secrets na configuração do serviço, sem armazenar chave no Git.
6. Medir qualidade, latência p50/p95, tokens/custo e custo por tarefa aprovada antes de afirmar ganho financeiro.

## Limitações importantes

- JSON válido não garante que os fatos estejam corretos; o contrato verifica estrutura e tipos.
- `temperature` baixa ou zero não torna uma LLM totalmente determinística.
- O campo de latência é medido pela aplicação, não estimado pela IA.
- O contexto/política deste protótipo está fixo no código; não é RAG nem base vetorial.
- Este projeto é uma demonstração de portfólio e não está certificado para produção.
