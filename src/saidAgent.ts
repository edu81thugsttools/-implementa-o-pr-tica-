import 'dotenv/config';
import { generateObject } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';
import { z } from 'zod';

// 3. CONTRATO DE SOFTWARE: o JSON que o backend espera
const ContratoSchema = z.object({
  pedido_id: z.string(),
  material: z.string(),
  quantidade: z.number().int().positive(),
  fornecedor: z.string(),
  status_validacao: z.enum(['APROVADO', 'REPROVADO']),
  motivo: z.string(),
});

// 1. CONTEXTO VETORIAL: por enquanto simulado (depois vira busca real no banco vetorial)
const contextoRecuperado = `
Regra: pedidos acima de 1000 unidades do material MAT-001 exigem aprovação do gerente.
Fornecedor homologado para MAT-001: Fornecedor Alfa.
`;

const inputDados = `Pedido PO-2026-001: 500 unidades de MAT-001 do Fornecedor Alfa.`;

const system = `Atue como um compilador determinístico. Você receberá um contexto
recuperado via busca vetorial delimitado por <context> e um input de dados.
Mapeie os campos, valide as regras de negócio e responda apenas com o objeto
que obedece ao schema. Não inclua saudações nem texto explicativo.`;

async function main() {
  // 2. DEEPSEEK CORE: saída estruturada, validada pelo Zod
  const { object } = await generateObject({
    model: deepseek('deepseek-chat'),
    schema: ContratoSchema,
    temperature: 0,
    system,
    prompt: `<context>${contextoRecuperado}</context>\n<input>${inputDados}</input>`,
  });

  console.log(JSON.stringify(object, null, 2));
}

main().catch((err) => {
  console.error('Falha na validação do contrato:', err);
  process.exit(1);
});
