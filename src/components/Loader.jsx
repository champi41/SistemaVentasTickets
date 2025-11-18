// src/components/Loader.jsx
import React from "react";
import styled from "styled-components";

const StyledWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.75rem;

  .container {
    position: relative;
    border-radius: 50%;
    height: 80px;
    width: 80px;
    animation: rotate_3922 1.4s linear infinite;
    background: radial-gradient(circle at 30% 30%, #000000ff, #010002ff, #0b0b0bff);
    box-shadow:
      0 0 18px rgba(168, 85, 247, 0.8),
      0 0 45px rgba(90, 25, 140, 0.7);
    overflow: visible;
  }

  .container span {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, #f5f3ff, #a855f7, #3b0764);
    opacity: 0.55;
    filter: blur(4px);
  }

  .container span:nth-of-type(2) {
    filter: blur(8px);
    opacity: 0.6;
  }

  .container span:nth-of-type(3) {
    filter: blur(16px);
    opacity: 0.5;
  }

  .container span:nth-of-type(4) {
    filter: blur(26px);
    opacity: 0.35;
  }

  .ticket-svg {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    filter: drop-shadow(0 0 4px rgba(0, 2, 3, 0.9));
  }

  .ticket-svg svg {
    width: 60px;
    height: 60px;
    fill: #f9fafb;
  }

  @keyframes rotate_3922 {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="container">
        <span />
        <span />
        <span />
        <span />
        <div className="ticket-svg">
          <svg viewBox="0 0 64 64" aria-hidden="true">
            {/* Boleto de cine estilizado */}
            <path d="M4 20v24c4 0 8 4 8 8h40c0-4 4-8 8-8V20c-4 0-8-4-8-8H12c0 4-4 8-8 8zm48 4a4 4 0 118 0 4 4 0 01-8 0zm0 16a4 4 0 118 0 4 4 0 01-8 0zM12 16h32v32H12V16z" />
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
};

export default Loader;
