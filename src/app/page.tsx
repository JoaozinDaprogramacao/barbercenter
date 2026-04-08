import { redirect } from 'next/navigation';

export default function RootPage() {
  // O redirecionamento acontece no servidor antes de chegar ao cliente
  redirect('/login');

  // Este retorno nunca será executado, mas é necessário para a tipagem do React
  return null;
}