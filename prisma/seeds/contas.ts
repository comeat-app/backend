import { Conta } from '@prisma/client';
import { hashPassword } from '../../src/utils/hash-password';

type RawConta = Omit<Conta, 'contaId' | 'criadoEm' | 'atualizadoEm'>;

export async function contasSeed() {
  const senhaHash = await hashPassword('123456');
  const accounts = <RawConta[]>[
    {
      cpf: '28327439006',
      nome: 'Usuário administrador',
      email: 'admin@gmail.com',
      senhaHash: senhaHash,
      dataNascimento: new Date('2004-01-01'),
      telefone: '11999999999',
    },
  ];

  return accounts;
}
