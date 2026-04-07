import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function useLogin() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg("");

        try {
            // O signIn chama a rota do NextAuth que criamos na etapa anterior
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false, // Mantém o usuário na tela para podermos tratar o erro visualmente
            });

            if (result?.error) {
                // Se o NextAuth retornar um erro (senha inválida, usuário não existe, etc)
                setErrorMsg(result.error);
                setIsLoading(false);
            } else if (result?.ok) {
                // Login com sucesso, manda para o dashboard
                router.push("/admin");
            }
        } catch (error) {
            setErrorMsg("Ocorreu um erro inesperado. Tente novamente.");
            setIsLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        errorMsg,
        handleLogin,
    };
}