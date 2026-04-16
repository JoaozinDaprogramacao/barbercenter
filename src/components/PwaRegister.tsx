"use client";
import { useEffect } from "react";

export function PwaRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/sw.js").then(
          function (registration) {
            console.log("Service Worker registrado com sucesso: ", registration.scope);
          },
          function (err) {
            console.log("Falha ao registrar o Service Worker: ", err);
          }
        );
      });
    }
  }, []);

  return null;
}