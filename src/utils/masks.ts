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

// Máscara para Moeda: R$ 0,00 (Opcional, mas útil para os serviços)
export const maskCurrency = (value: string) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = (Number(value) / 100).toFixed(2).replace(".", ",");
  return value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
};