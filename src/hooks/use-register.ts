import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const register = async (formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', { // Ajuste para a sua rota de registro
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barbershopName: formData.barbershopName,
          userName: formData.userName,
          userEmail: formData.userEmail,
          userPassword: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar conta');
      }

      // Se criou com sucesso, faz o login automático
      const result = await signIn('credentials', {
        email: formData.userEmail,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Conta criada, mas erro ao logar. Tente entrar manualmente.");
      } else {
        router.push('/admin'); // Ou a rota principal do seu SaaS
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading, error };
}