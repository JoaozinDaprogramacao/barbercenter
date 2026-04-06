// src/utils/masks.ts

// Máscara para Telefone: (99) 99999-9999
export const maskPhone = (value: string) => {
    if (!value) return "";
    value = value.replace(/\D/g, ""); // Remove tudo o que não é número
    value = value.slice(0, 11); // Limita a 11 dígitos

    return value
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
};
// src/utils/masks.ts

export const maskMoeda = (valor: string) => {
    if (!valor) return "";

    // Remove tudo que não é dígito
    const apenasNumeros = valor.replace(/\D/g, "");

    // Converte para decimal (centavos)
    const padraoMoeda = (Number(apenasNumeros) / 100).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    return padraoMoeda;
};

// Útil para salvar no banco de dados (ex: "R$ 30,00" -> "30.00")
export const desmascararMoeda = (valor: string) => {
    return valor.replace(/\D/g, "");
};