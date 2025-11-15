// src/components/ThemeSwitch.jsx
import React, { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <>
      {/* ESTILOS AJUSTADOS A TU PALETA Y TAMAÑO DE BOTONES */}
      <style>{`
        .switch-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 42px;              /* parecido a nav-btn */
          cursor: pointer;
        }

        .switch-button .switch-outer {
          height: 100%;
          background: var(--m100);   /* usa tu paleta */
          width: 90px;               /* ancho pill, tipo botón */
          border-radius: 999px;
          box-shadow: var(--shadow-m);
          border: 2px solid var(--m300);
          padding: 4px;
          box-sizing: border-box;
          position: relative;
          transition: 0.25s ease;
        }

        /* hover suave como los otros botones */
        .switch-button:hover .switch-outer {
          border-color: var(--m500);
          box-shadow: var(--shadow-l);
          transform: translateY(-2px);
        }

        .switch-button .switch-outer input[type="checkbox"] {
          opacity: 0;
          appearance: none;
          position: absolute;
        }

        .switch-button .switch-outer .button {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: space-between;
          position: relative;
        }

        /* círculo que se mueve */
        .switch-button .switch-outer .button-toggle {
          height: 32px;
          width: 32px;
          background: linear-gradient(135deg, var(--m500), var(--m600));
          border-radius: 999px;
          box-shadow: inset 0px 3px 4px rgba(255,255,255,0.35),
                      0px 4px 10px rgba(0,0,0,0.25);
          position: relative;
          z-index: 2;
          transition: left 0.25s ease-in;
          left: 0;
        }

        /* lado derecho: indicador (como “ON/OFF” visual) */
        .switch-button .switch-outer .button-indicator {
          height: 20px;
          width: 20px;
          top: 50%;
          transform: translateY(-50%);
          border-radius: 50%;
          border: 3px solid var(--m400);
          box-sizing: border-box;
          right: 8px;
          position: relative;
          opacity: 1;
          transition: border-color 0.25s ease, opacity 0.25s ease;
        }

        /* cuando está activado (modo oscuro) */
        .switch-button
          .switch-outer
          input[type="checkbox"]:checked
          + .button
          .button-toggle {
          left: 52%;
        }

        .switch-button
          .switch-outer
          input[type="checkbox"]:checked
          + .button
          .button-indicator {
          animation: indicator 0.8s forwards;
        }

        @keyframes indicator {
          0% {
            opacity: 1;
            border-color: var(--m400);
            left: 0;
          }
          30% {
            opacity: 0;
          }
          100% {
            opacity: 1;
            border-color: var(--m600);
            left: -60%;
          }
        }

        /* Ajuste en modo oscuro: que el fondo del switch también se vea bien */
        body.dark-mode .switch-button .switch-outer {
          background: var(--m200);
          border-color: var(--m500);
        }

        body.dark-mode .switch-button .switch-outer .button-toggle {
          background: linear-gradient(135deg, var(--m400), var(--m600));
        }
      `}</style>

      <label className="switch-button" title="Cambiar tema">
        <div className="switch-outer">
          <input
            type="checkbox"
            checked={dark}
            onChange={() => setDark((d) => !d)}
          />
          <div className="button">
            <span className="button-toggle" />
            <span className="button-indicator" />
          </div>
        </div>
      </label>
    </>
  );
}
