export const HomePage = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Ndevu's Portfolio API - REST API Backend</title>
    <meta name="description" content="Professional REST API backend for Ndevu's portfolio website. Built with Node.js, Express, TypeScript, and MongoDB.">
    <meta name="author" content="Ndevu">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
      /* CSS Reset and Base Styles */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      :root {
        --primary: #101426;
        --secondary: #1a1e32;
        --accent: #FFD43B;
        --dark-blue: #1f2d74;
        --light-text: #d8d3d5;
        --header-bg: rgb(17, 17, 33);
        --footer-bg: #0d0f16;
        --button-hover: rgb(224, 193, 16);
        --card-border: #9f84c2;
      }

      body {
        font-family: 'Roboto', sans-serif;
        background-color: var(--primary);
        color: var(--light-text);
        min-height: 100vh;
        line-height: 1.6;
      }

      /* Container and Layout */
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }      .grid {
        display: grid;
        gap: 2rem;
      }

      .grid-cols-2 {
        grid-template-columns: repeat(2, 1fr);
      }

      .grid-cols-3 {
        grid-template-columns: repeat(3, 1fr);
      }

      .grid-cols-4 {
        grid-template-columns: repeat(4, 1fr);
      }/* Responsive Grid */
      .lg-grid-cols-2 {
        grid-template-columns: repeat(2, 1fr);
      }

      .lg-grid-cols-3 {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 1024px) {
        .lg-grid-cols-3 {
          grid-template-columns: repeat(2, 1fr);
        }
        .lg-grid-cols-2 {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      @media (max-width: 768px) {
        .md-grid-cols-2, .lg-grid-cols-2, .lg-grid-cols-3 {
          grid-template-columns: 1fr;
        }
      }

      /* Flexbox Utilities */
      .flex {
        display: flex;
      }

      .flex-col {
        flex-direction: column;
      }

      .flex-wrap {
        flex-wrap: wrap;
      }

      .items-center {
        align-items: center;
      }

      .justify-between {
        justify-content: space-between;
      }

      .justify-center {
        justify-content: center;
      }

      .justify-end {
        justify-content: flex-end;
      }

      .gap-3 {
        gap: 0.75rem;
      }

      .gap-4 {
        gap: 1rem;
      }

      .gap-6 {
        gap: 1.5rem;
      }

      .gap-8 {
        gap: 2rem;
      }

      /* Typography */
      .text-center {
        text-align: center;
      }

      .text-left {
        text-align: left;
      }

      .text-right {
        text-align: right;
      }

      .text-white {
        color: white;
      }

      .text-accent {
        color: var(--accent);
      }

      .text-light {
        color: var(--light-text);
      }

      .text-sm {
        font-size: 0.875rem;
      }

      .text-lg {
        font-size: 1.125rem;
      }

      .text-xl {
        font-size: 1.25rem;
      }

      .text-2xl {
        font-size: 1.5rem;
      }

      .text-3xl {
        font-size: 1.875rem;
      }

      .text-4xl {
        font-size: 2.25rem;
      }

      .text-6xl {
        font-size: 3.75rem;
      }

      .font-medium {
        font-weight: 500;
      }

      .font-semibold {
        font-weight: 600;
      }

      .font-bold {
        font-weight: 700;
      }

      .leading-tight {
        line-height: 1.25;
      }

      .leading-relaxed {
        line-height: 1.625;
      }

      /* Spacing */
      .p-4 { padding: 1rem; }
      .p-6 { padding: 1.5rem; }
      .p-8 { padding: 2rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
      .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .px-8 { padding-left: 2rem; padding-right: 2rem; }
      
      .m-0 { margin: 0; }
      .mb-1 { margin-bottom: 0.25rem; }
      .mb-2 { margin-bottom: 0.5rem; }
      .mb-3 { margin-bottom: 0.75rem; }
      .mb-4 { margin-bottom: 1rem; }
      .mb-6 { margin-bottom: 1.5rem; }
      .mb-8 { margin-bottom: 2rem; }
      .mb-12 { margin-bottom: 3rem; }
      .mb-16 { margin-bottom: 4rem; }
      .mr-1 { margin-right: 0.25rem; }
      .mr-2 { margin-right: 0.5rem; }
      .mr-3 { margin-right: 0.75rem; }
      .mt-4 { margin-top: 1rem; }
      .mt-8 { margin-top: 2rem; }

      /* Border Radius */
      .rounded-full {
        border-radius: 9999px;
      }

      .rounded-2xl {
        border-radius: 1rem;
      }

      .rounded-3xl {
        border-radius: 1.5rem;
      }

      /* Width and Height */
      .w-3 { width: 0.75rem; }
      .w-5 { width: 1.25rem; }
      .w-16 { width: 4rem; }
      .w-20 { width: 5rem; }
      .h-3 { height: 0.75rem; }
      .h-16 { height: 4rem; }
      .h-20 { height: 5rem; }

      /* Background Colors and Effects */
      .bg-header {
        background: rgba(17, 17, 33, 0.9);
        backdrop-filter: blur(16px);
      }

      .bg-secondary {
        background: rgba(26, 30, 50, 0.8);
        backdrop-filter: blur(16px);
      }

      .bg-card {
        background: rgba(26, 30, 50, 0.6);
        backdrop-filter: blur(16px);
      }

      .bg-footer {
        background: rgba(13, 15, 22, 0.9);
        backdrop-filter: blur(16px);
      }

      .bg-accent {
        background-color: var(--accent);
        color: var(--primary);
      }

      .bg-gradient {
        background: linear-gradient(135deg, var(--dark-blue), var(--secondary));
      }

      .bg-icon-gradient {
        background: linear-gradient(135deg, var(--accent), var(--button-hover));
      }

      /* Borders */
      .border {
        border: 1px solid rgba(159, 132, 194, 0.3);
      }

      .border-accent {
        border: 2px solid var(--accent);
      }

      .border-separator {
        border-color: rgba(159, 132, 194, 0.3);
      }

      /* Hover Effects */
      .hover-border-accent:hover {
        border-color: rgba(255, 212, 59, 0.5);
      }

      .hover-bg-accent:hover {
        background-color: var(--accent);
        color: var(--primary);
      }

      .hover-bg-button:hover {
        background-color: var(--button-hover);
      }

      .hover-text-accent:hover {
        color: var(--accent);
      }

      .hover-text-button:hover {
        color: var(--button-hover);
      }

      .hover-scale:hover {
        transform: scale(1.05);
      }

      /* Transitions */
      .transition-all {
        transition: all 0.3s ease;
      }

      .transition-colors {
        transition: color 0.3s ease;
      }      /* Badge Styles */
      .badge {
        display: inline-block;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .badge::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.6s ease;
      }

      .badge:hover::before {
        left: 100%;
      }

      .badge-green {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.3));
        color: #4ade80;
        border: 1px solid rgba(34, 197, 94, 0.4);
        box-shadow: 0 4px 15px rgba(34, 197, 94, 0.2);
      }

      .badge-green:hover {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.4));
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(34, 197, 94, 0.3);
      }

      .badge-blue {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(59, 130, 246, 0.3));
        color: #60a5fa;
        border: 1px solid rgba(59, 130, 246, 0.4);
        box-shadow: 0 4px 15px rgba(59, 130, 246, 0.2);
      }

      .badge-blue:hover {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.4));
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
      }

      .badge-yellow {
        background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(234, 179, 8, 0.3));
        color: #facc15;
        border: 1px solid rgba(234, 179, 8, 0.4);
        box-shadow: 0 4px 15px rgba(234, 179, 8, 0.2);
      }

      .badge-yellow:hover {
        background: linear-gradient(135deg, rgba(234, 179, 8, 0.3), rgba(234, 179, 8, 0.4));
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(234, 179, 8, 0.3);
      }

      .badge-purple {
        background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.3));
        color: #c084fc;
        border: 1px solid rgba(168, 85, 247, 0.4);
        box-shadow: 0 4px 15px rgba(168, 85, 247, 0.2);
      }

      .badge-purple:hover {
        background: linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(168, 85, 247, 0.4));
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(168, 85, 247, 0.3);
      }

      /* Button Styles */
      .btn {
        display: inline-block;
        padding: 1rem 2rem;
        border-radius: 9999px;
        font-weight: 600;
        text-decoration: none;
        text-align: center;
        transition: all 0.3s ease;
        border: none;
        cursor: pointer;
      }

      .btn-primary {
        background-color: var(--accent);
        color: var(--primary);
      }

      .btn-outline {
        background: transparent;
        border: 2px solid var(--accent);
        color: var(--accent);
      }      /* Cards */
      .card {
        background: rgba(26, 30, 50, 0.6);
        backdrop-filter: blur(16px);
        border-radius: 1rem;
        padding: 1.5rem;
        border: 1px solid rgba(159, 132, 194, 0.3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
      }

      .card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent), var(--button-hover));
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      .card:hover {
        transform: translateY(-8px) scale(1.02);
        border-color: rgba(255, 212, 59, 0.6);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(255, 212, 59, 0.1);
      }

      .card:hover::before {
        transform: scaleX(1);
      }      .endpoint-card {
        background: rgba(26, 30, 50, 0.8);
        backdrop-filter: blur(20px);
        border-radius: 1.25rem;
        padding: 2rem;
        border: 1px solid rgba(159, 132, 194, 0.4);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: 450px;
      }

      .endpoint-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--accent), var(--button-hover));
        transform: scaleX(0);
        transition: transform 0.4s ease;
      }

      .endpoint-card:hover {
        transform: translateY(-12px) scale(1.03);
        border-color: rgba(255, 212, 59, 0.8);
        box-shadow: 
          0 25px 50px rgba(0, 0, 0, 0.4),
          0 0 40px rgba(255, 212, 59, 0.15),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }

      .endpoint-card:hover::before {
        transform: scaleX(1);
      }

      .endpoint-content {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .endpoint-list {
        flex: 1;
        margin-bottom: 1.5rem;
      }

      /* Navigation */
      .nav {
        background: rgba(17, 17, 33, 0.9);
        backdrop-filter: blur(16px);
        border-radius: 1rem;
        margin-bottom: 2rem;
        padding: 1.5rem;
      }

      /* Hero Section */
      .hero {
        background: rgba(26, 30, 50, 0.8);
        backdrop-filter: blur(16px);
        border-radius: 1.5rem;
        margin-bottom: 3rem;
        padding: 2rem;
      }

      @media (min-width: 1024px) {
        .hero {
          padding: 3rem;
        }
      }

      .hero-grid {
        display: grid;
        gap: 2rem;
        align-items: center;
      }

      @media (min-width: 1024px) {
        .hero-grid {
          grid-template-columns: 2fr 1fr;
        }
      }

      /* Tech Badge */
      .tech-badge {
        background-color: var(--accent);
        color: var(--primary);
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
        display: inline-block;
        margin: 0.25rem;
      }

      /* Stats Card */
      .stats-card {
        background: linear-gradient(135deg, var(--dark-blue), var(--secondary));
        border-radius: 1rem;
        padding: 2rem;
        text-align: center;
        border: 1px solid rgba(159, 132, 194, 0.3);
      }      /* Feature Icon */
      .feature-icon {
        width: 4rem;
        height: 4rem;
        background: linear-gradient(135deg, var(--accent), var(--button-hover));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        font-size: 1.5rem;
        color: var(--primary);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        box-shadow: 0 8px 20px rgba(255, 212, 59, 0.3);
      }

      .feature-icon::before {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(135deg, var(--accent), var(--button-hover));
        border-radius: inherit;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      .endpoint-card:hover .feature-icon {
        transform: scale(1.1) rotate(5deg);
        box-shadow: 0 12px 30px rgba(255, 212, 59, 0.4);
      }

      .endpoint-card:hover .feature-icon::before {
        opacity: 0.5;
      }

      .feature-icon-lg {
        width: 5rem;
        height: 5rem;
        font-size: 1.875rem;
        background: linear-gradient(135deg, var(--accent), var(--button-hover));
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        color: var(--primary);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 10px 25px rgba(255, 212, 59, 0.3);
        position: relative;
      }

      .feature-icon-lg::before {
        content: '';
        position: absolute;
        inset: -3px;
        background: linear-gradient(135deg, var(--accent), var(--button-hover));
        border-radius: inherit;
        z-index: -1;
        opacity: 0;
        transition: opacity 0.4s ease;
      }

      .feature-icon-lg:hover {
        transform: scale(1.15) rotate(-5deg);
        box-shadow: 0 15px 35px rgba(255, 212, 59, 0.5);
      }

      .feature-icon-lg:hover::before {
        opacity: 0.6;
      }      /* Endpoint Styles */
      .endpoint {
        background: rgba(255, 212, 59, 0.12);
        border-left: 4px solid var(--accent);
        padding: 1rem 1.25rem;
        margin: 0.75rem 0;
        border-radius: 0 12px 12px 0;
        font-family: 'Courier New', monospace;
        font-size: 0.9rem;
        color: var(--light-text);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;
        border-top: 1px solid rgba(255, 212, 59, 0.2);
        border-bottom: 1px solid rgba(255, 212, 59, 0.2);
        border-right: 1px solid rgba(255, 212, 59, 0.2);
      }

      .endpoint::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 4px;
        height: 100%;
        background: linear-gradient(180deg, var(--accent), var(--button-hover));
        transition: width 0.3s ease;
      }

      .endpoint:hover {
        background: rgba(255, 212, 59, 0.2);
        transform: translateX(8px) scale(1.02);
        border-color: var(--accent);
        box-shadow: 0 4px 15px rgba(255, 212, 59, 0.25);
      }

      .endpoint:hover::before {
        width: 100%;
        opacity: 0.1;
      }

      .endpoint:active {
        transform: translateX(4px) scale(0.98);
      }

      .copy-feedback {
        background: linear-gradient(135deg, #10b981, #059669) !important;
        color: white !important;
        border-left-color: #10b981 !important;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4) !important;
      }      /* Quick Start Section */
      .quick-start {
        background: rgba(26, 30, 50, 0.8);
        backdrop-filter: blur(20px);
        border-radius: 1.5rem;
        padding: 3rem;
        border: 1px solid rgba(159, 132, 194, 0.4);
        margin-bottom: 3rem;
        position: relative;
        overflow: hidden;
      }

      .quick-start::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent), var(--button-hover), var(--accent));
      }

      .quick-start-grid {
        display: grid;
        gap: 3rem;
      }

      @media (min-width: 1024px) {
        .quick-start-grid {
          grid-template-columns: 1fr 1fr;
        }
      }

      .quick-start-item {
        position: relative;
        padding: 1.5rem;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 1rem;
        border: 1px solid rgba(159, 132, 194, 0.2);
        transition: all 0.3s ease;
      }

      .quick-start-item:hover {
        background: rgba(255, 255, 255, 0.04);
        border-color: rgba(255, 212, 59, 0.3);
        transform: translateY(-4px);
      }      /* Footer */
      .footer {
        background: rgba(13, 15, 22, 0.95);
        backdrop-filter: blur(20px);
        border-radius: 1.5rem;
        padding: 3rem;
        text-align: center;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(159, 132, 194, 0.3);
      }

      .footer::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--accent), var(--button-hover), var(--accent));
      }

      .footer-grid {
        display: grid;
        gap: 3rem;
        margin-bottom: 2rem;
      }

      @media (min-width: 768px) {
        .footer-grid {
          grid-template-columns: 1fr 1fr;
          text-align: left;
        }

        .footer-right {
          text-align: right;
        }
      }

      .footer hr {
        border: none;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(159, 132, 194, 0.4), transparent);
        margin: 2rem 0;
      }

      .footer-contact-item {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        padding: 0.75rem;
        border-radius: 0.5rem;
        transition: all 0.3s ease;
      }

      .footer-contact-item:hover {
        background: rgba(255, 212, 59, 0.1);
        transform: translateX(8px);
      }

      .footer-contact-item i {
        margin-right: 1rem;
        width: 1.25rem;
        text-align: center;
      }

      /* Status Indicator */
      .status-dot {
        width: 0.75rem;
        height: 0.75rem;
        background-color: #10b981;
        border-radius: 50%;
        margin-right: 0.5rem;
        animation: pulse 2s infinite;
      }

      /* Animations */
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }

      @keyframes slideIn {
        from { 
          opacity: 0; 
          transform: translateY(20px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }

      @keyframes scaleUp {
        from { 
          opacity: 0; 
          transform: scale(0.9); 
        }
        to { 
          opacity: 1; 
          transform: scale(1); 
        }
      }

      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }

      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }

      .animate-fade-in {
        animation: fadeIn 0.8s ease forwards;
      }

      .animate-slide-in {
        animation: slideIn 0.8s ease forwards;
      }

      .animate-scale-up {
        animation: scaleUp 0.8s ease forwards;
      }

      .animate-float {
        animation: float 3s ease-in-out infinite;
      }

      .animate-pulse {
        animation: pulse 2s infinite;
      }

      /* Responsive utilities */
      @media (max-width: 640px) {
        .container {
          padding: 0 0.5rem;
        }
        
        .text-4xl {
          font-size: 1.875rem;
        }
        
        .hero {
          padding: 1.5rem;
        }
        
        .flex-col-sm {
          flex-direction: column;
        }
      }

      /* Link styles */
      a {
        text-decoration: none;
        color: inherit;
      }

      a:hover {
        text-decoration: none;
      }

      /* Space utilities */
      .space-y-2 > * + * {
        margin-top: 0.5rem;
      }

      .space-y-3 > * + * {
        margin-top: 0.75rem;
      }      /* Opacity utilities */
      .opacity-60 {
        opacity: 0.6;
      }

      .opacity-70 {
        opacity: 0.7;
      }

      .opacity-80 {
        opacity: 0.8;
      }

      .opacity-90 {
        opacity: 0.9;
      }

      /* Max width utilities */
      .max-w-2xl {
        max-width: 42rem;
      }

      .max-w-3xl {
        max-width: 48rem;
      }

      .mx-auto {
        margin-left: auto;
        margin-right: auto;
      }      /* Additional responsive improvements */
      @media (max-width: 768px) {
        .grid {
          gap: 1.5rem;
        }
        
        .endpoint-card {
          padding: 1.5rem;
          min-height: 400px;
        }

        .feature-icon-lg {
          width: 4rem;
          height: 4rem;
          font-size: 1.5rem;
        }

        .quick-start {
          padding: 2rem;
        }

        .footer {
          padding: 2rem;
        }

        .footer-grid {
          gap: 2rem;
        }

        .footer-contact-item {
          padding: 0.5rem;
        }
      }

      @media (max-width: 480px) {
        .grid {
          gap: 1rem;
        }
        
        .endpoint-card {
          padding: 1rem;
          min-height: 350px;
        }

        .quick-start {
          padding: 1.5rem;
        }

        .footer {
          padding: 1.5rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          font-size: 0.875rem;
        }

        .text-3xl {
          font-size: 1.75rem;
        }
      }
    </style>  </head>
  <body style="background-color: var(--primary); min-height: 100vh; color: var(--light-text); font-family: 'Roboto', sans-serif;">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
      <!-- Navigation -->
      <nav class="nav animate-fade-in">
        <div class="flex justify-between items-center">
          <div>
            <h4 class="text-2xl font-bold text-white mb-1">
              <i class="fas fa-code text-accent mr-2"></i>Ndevu's API
            </h4>
            <p class="text-light text-sm">Portfolio Backend Service</p>
          </div>
          <div class="flex items-center">
            <span class="status-dot"></span>
            <span style="color: #4ade80;" class="font-semibold">Online</span>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <div class="hero animate-slide-in" style="animation-delay: 0.2s">
        <div class="hero-grid">
          <div>
            <h1 class="text-4xl font-bold text-white mb-6 leading-tight" style="font-size: 2.25rem;">
              Welcome to <span class="text-accent">Ndevu's Portfolio API</span>
            </h1>
            <p class="text-light text-lg mb-8 leading-relaxed">
              A robust and scalable REST API backend powering a modern portfolio website. 
              Built with Node.js, Express, TypeScript, and MongoDB for optimal performance and maintainability.
            </p>
            <div class="flex flex-wrap gap-3 mb-8">
              <span class="tech-badge">
                <i class="fab fa-node-js mr-1"></i> Node.js
              </span>
              <span class="tech-badge">
                <i class="fas fa-code mr-1"></i> TypeScript
              </span>
              <span class="tech-badge">
                <i class="fas fa-server mr-1"></i> Express
              </span>
              <span class="tech-badge">
                <i class="fas fa-database mr-1"></i> MongoDB
              </span>
              <span class="tech-badge">
                <i class="fas fa-shield-alt mr-1"></i> JWT Auth
              </span>
              <span class="tech-badge">
                <i class="fas fa-cloud mr-1"></i> Cloudinary
              </span>
            </div>
            <div class="flex flex-col gap-4" style="flex-direction: column;">
              <div class="flex gap-4" style="flex-direction: row; flex-wrap: wrap;">
                <a href="/docs" class="btn btn-primary hover-bg-button hover-scale transition-all" style="transform-origin: center;">
                  <i class="fas fa-book mr-2"></i> API Documentation
                </a>
                <a href="https://ndevuspace.netlify.app/" class="btn btn-outline hover-bg-accent hover-scale transition-all" target="_blank" style="transform-origin: center;">
                  <i class="fas fa-globe mr-2"></i> Visit Portfolio
                </a>
              </div>
            </div>
          </div>
          <div>
            <div class="stats-card animate-float">
              <div class="text-6xl text-accent mb-4">
                <i class="fas fa-database"></i>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">10+ Endpoints</h3>
              <p class="text-light">Complete CRUD Operations</p>
            </div>
          </div>
        </div>
      </div>      <!-- API Endpoints Overview -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-white mb-4 text-center animate-fade-in">
          <i class="fas fa-api text-accent mr-3"></i>API Endpoints Overview
        </h2>
        <p class="text-light text-center mb-12 text-lg leading-relaxed max-w-3xl mx-auto">
          Comprehensive REST API with secure authentication, CRUD operations, and real-time features. 
          Click any endpoint to copy it to your clipboard.
        </p>
          <div class="grid lg-grid-cols-2">
          <!-- Authentication & Users -->
          <div class="endpoint-card hover-border-accent animate-scale-up" style="animation-delay: 0.1s">
            <div class="feature-icon mx-auto mb-6">
              <i class="fas fa-user-shield text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3 text-center">Authentication & Users</h3>
            <p class="text-light text-sm mb-6 text-center opacity-90">Secure user management with JWT authentication and role-based access control</p>
            <div class="space-y-3">
              <div class="endpoint">POST /v1/auth/signup</div>
              <div class="endpoint">POST /v1/auth/login</div>
              <div class="endpoint">POST /v1/auth/logout</div>
              <div class="endpoint">GET /v1/auth/status</div>
            </div>
            <div class="mt-6 text-center">
              <span class="badge badge-green">Secure JWT</span>
            </div>
          </div>

          <!-- Blog Management -->
          <div class="endpoint-card hover-border-accent animate-scale-up" style="animation-delay: 0.2s">
            <div class="feature-icon mx-auto mb-6">
              <i class="fas fa-blog text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3 text-center">Blog Management</h3>
            <p class="text-light text-sm mb-6 text-center opacity-90">Complete blog system with rich content, categories, and engagement features</p>
            <div class="space-y-3">
              <div class="endpoint">GET /v1/blogs/public</div>
              <div class="endpoint">POST /v1/blogs/create</div>
              <div class="endpoint">PUT /v1/blogs/update/:id</div>
              <div class="endpoint">DELETE /v1/blogs/delete/:id</div>
            </div>
            <div class="mt-6 text-center">
              <span class="badge badge-blue">CRUD Ready</span>
            </div>
          </div>

          <!-- User Profiles -->
          <div class="endpoint-card hover-border-accent animate-scale-up" style="animation-delay: 0.3s">
            <div class="feature-icon mx-auto mb-6">
              <i class="fas fa-user-edit text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3 text-center">User Profiles</h3>
            <p class="text-light text-sm mb-6 text-center opacity-90">Comprehensive profile management with avatar upload and personal settings</p>
            <div class="space-y-3">
              <div class="endpoint">GET /v1/profile/me</div>
              <div class="endpoint">PUT /v1/profile/me</div>
              <div class="endpoint">GET /v1/profile/:userId</div>
              <div class="endpoint">DELETE /v1/profile/me</div>
            </div>
            <div class="mt-6 text-center">
              <span class="badge badge-yellow">File Upload</span>
            </div>
          </div>

          <!-- Comments System -->
          <div class="endpoint-card hover-border-accent animate-scale-up" style="animation-delay: 0.4s">
            <div class="feature-icon mx-auto mb-6">
              <i class="fas fa-comments text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3 text-center">Comments System</h3>
            <p class="text-light text-sm mb-6 text-center opacity-90">Interactive commenting system for blog posts with moderation capabilities</p>
            <div class="space-y-3">
              <div class="endpoint">POST /v1/comment/add</div>
              <div class="endpoint">DELETE /v1/comment/:id</div>
              <div class="endpoint">GET /v1/comment/blog/:blogId</div>
            </div>
            <div class="mt-6 text-center">
              <span class="badge badge-purple">Interactive</span>
            </div>
          </div>

          <!-- Contact Messages -->
          <div class="endpoint-card hover-border-accent animate-scale-up" style="animation-delay: 0.5s">
            <div class="feature-icon mx-auto mb-6">
              <i class="fas fa-envelope text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3 text-center">Contact Messages</h3>
            <p class="text-light text-sm mb-6 text-center opacity-90">Contact form handling with message storage and admin management tools</p>
            <div class="space-y-3">
              <div class="endpoint">POST /v1/message/contact-me</div>
              <div class="endpoint">GET /v1/message/</div>
              <div class="endpoint">DELETE /v1/message/delete/:id</div>
            </div>
            <div class="mt-6 text-center">
              <span class="badge badge-green">Contact Form</span>
            </div>
          </div>

          <!-- Newsletter System -->
          <div class="endpoint-card hover-border-accent animate-scale-up" style="animation-delay: 0.6s">
            <div class="feature-icon mx-auto mb-6">
              <i class="fas fa-newspaper text-2xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3 text-center">Newsletter System</h3>
            <p class="text-light text-sm mb-6 text-center opacity-90">Subscriber management with notification system and email integration</p>
            <div class="space-y-3">
              <div class="endpoint">POST /v1/subscriber/create</div>
              <div class="endpoint">GET /v1/subscriber/</div>
              <div class="endpoint">PUT /v1/subscriber/update/:id</div>
              <div class="endpoint">DELETE /v1/subscriber/delete/:id</div>
            </div>
            <div class="mt-6 text-center">
              <span class="badge badge-blue">Email Ready</span>
            </div>
          </div>
        </div>
      </div>      <!-- Key Features -->
      <div class="mb-16">
        <h2 class="text-3xl font-bold text-white mb-6 text-center">
          <i class="fas fa-star text-accent mr-3"></i>Key Features
        </h2>
        <p class="text-light text-center mb-12 text-lg leading-relaxed max-w-3xl mx-auto">
          Built with modern technologies and best practices for scalability, security, and performance.
        </p>
          <div class="grid lg-grid-cols-3">
          <div class="text-center animate-fade-in" style="animation-delay: 0.7s">
            <div class="feature-icon-lg mx-auto mb-6 animate-float bg-icon-gradient">
              <i class="fas fa-shield-alt"></i>
            </div>            
            <h3 class="text-xl font-semibold text-white mb-4">Secure Authentication</h3>
            <p class="text-light leading-relaxed">Cookie-based JWT authentication with role-based access control and secure session management</p>
          </div>
          
          <div class="text-center animate-fade-in" style="animation-delay: 0.8s">
            <div class="feature-icon-lg mx-auto mb-6 animate-float bg-icon-gradient" style="animation-delay: 0.5s">
              <i class="fas fa-database"></i>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">MongoDB Integration</h3>
            <p class="text-light leading-relaxed">Robust data persistence with Mongoose ODM for efficient data modeling and queries</p>
          </div>
          
          <div class="text-center animate-fade-in" style="animation-delay: 0.9s">
            <div class="feature-icon-lg mx-auto mb-6 animate-float bg-icon-gradient" style="animation-delay: 1s">
              <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">File Upload</h3>
            <p class="text-light leading-relaxed">Cloudinary integration for optimized image management and CDN delivery</p>
          </div>
          
          <div class="text-center animate-fade-in" style="animation-delay: 1s">
            <div class="feature-icon-lg mx-auto mb-6 animate-float bg-icon-gradient" style="animation-delay: 1.5s">
              <i class="fas fa-code"></i>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">TypeScript</h3>
            <p class="text-light leading-relaxed">Type-safe development with full TypeScript support for better maintainability</p>
          </div>
          
          <div class="text-center animate-fade-in" style="animation-delay: 1.1s">
            <div class="feature-icon-lg mx-auto mb-6 animate-float bg-icon-gradient" style="animation-delay: 2s">
              <i class="fas fa-rocket"></i>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">High Performance</h3>
            <p class="text-light leading-relaxed">Optimized Express.js server with efficient middleware and response caching</p>
          </div>
          
          <div class="text-center animate-fade-in" style="animation-delay: 1.2s">
            <div class="feature-icon-lg mx-auto mb-6 animate-float bg-icon-gradient" style="animation-delay: 2.5s">
              <i class="fas fa-book-open"></i>
            </div>
            <h3 class="text-xl font-semibold text-white mb-4">API Documentation</h3>
            <p class="text-light leading-relaxed">Comprehensive Swagger documentation with interactive testing capabilities</p>
          </div>
        </div>
      </div>      <!-- Quick Start -->
      <div class="mb-12">
        <div class="quick-start animate-slide-in" style="animation-delay: 1.1s">
          <h2 class="text-3xl font-bold text-white mb-6 text-center">
            <i class="fas fa-rocket text-accent mr-3"></i>Quick Start Guide
          </h2>
          <p class="text-light text-center mb-10 text-lg leading-relaxed max-w-2xl mx-auto">
            Get started with the API in minutes. Follow these simple steps to begin integrating with your applications.
          </p>
          <div class="quick-start-grid">
            <div class="quick-start-item">
              <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                <span class="feature-icon mr-4" style="width: 2.5rem; height: 2.5rem; font-size: 1rem;">
                  <i class="fas fa-book"></i>
                </span>
                API Documentation
              </h3>
              <p class="text-light mb-6 leading-relaxed">Comprehensive Swagger documentation with interactive examples and detailed endpoint descriptions:</p>
              <div class="endpoint"><strong>GET</strong> /docs</div>
              
              <h3 class="text-xl font-semibold text-white mb-4 mt-8 flex items-center">
                <span class="feature-icon mr-4" style="width: 2.5rem; height: 2.5rem; font-size: 1rem;">
                  <i class="fas fa-link"></i>
                </span>
                Base URL
              </h3>
              <p class="text-light mb-4 leading-relaxed">All API endpoints are prefixed with:</p>
              <div class="endpoint">http://localhost:6090/v1</div>
            </div>
            <div class="quick-start-item">
              <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                <span class="feature-icon mr-4" style="width: 2.5rem; height: 2.5rem; font-size: 1rem;">
                  <i class="fas fa-shield-alt"></i>
                </span>
                Authentication
              </h3>
              <p class="text-light mb-6 leading-relaxed">Most endpoints require authentication. Include your JWT token in the request header:</p>
              <div class="endpoint">"credentials": "include"</div>
              <p class="text-sm opacity-70 mt-4" style="color: var(--light-text);">
                🔧 <strong>Fallback Method:</strong> Use Bearer tokens for API clients and mobile applications
              </p>
              
              <h3 class="text-xl font-semibold text-white mb-4 mt-8 flex items-center">
                <span class="feature-icon mr-4" style="width: 2.5rem; height: 2.5rem; font-size: 1rem;">
                  <i class="fas fa-play"></i>
                </span>
                Getting Started
              </h3>
              <p class="text-light mb-4 leading-relaxed">Start by creating an account or logging in:</p>
              <div class="endpoint">POST /v1/auth/signup</div>
            </div>
          </div>
        </div>
      </div>      <!-- Footer -->
      <footer class="footer animate-fade-in" style="animation-delay: 1.2s">
        <div class="footer-grid">
          <div class="text-left">
            <h3 class="text-xl font-semibold text-white mb-6 flex items-center">
              <i class="fas fa-address-card text-accent mr-3"></i>
              Contact Information
            </h3>
            <div class="space-y-3">
              <div class="footer-contact-item">
                <i class="fas fa-user text-accent"></i>
                <div>
                  <strong class="text-white">Ndevu</strong>
                  <p class="text-light text-sm">Full-Stack Software Engineer</p>
                </div>
              </div>
              <div class="footer-contact-item">
                <i class="fas fa-envelope text-accent"></i>
                <div>
                  <p class="text-light">niyokwizerwajeanpaulelisa@gmail.com</p>
                </div>
              </div>
              <div class="footer-contact-item">
                <i class="fas fa-globe text-accent"></i>
                <div>
                  <a href="https://ndevuspace.netlify.app/" target="_blank" class="text-accent hover-text-button transition-colors">
                    ndevuspace.netlify.app
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="footer-right">
            <h3 class="text-xl font-semibold text-white mb-6 flex items-center justify-end">
              <i class="fas fa-code text-accent mr-3"></i>
              Tech Stack
            </h3>
            <div class="mb-6">
              <p class="text-light mb-2 font-medium">Backend Technologies</p>
              <p class="text-sm text-light opacity-80 mb-4">Node.js • Express • TypeScript • MongoDB</p>
              <p class="text-light mb-2 font-medium">Additional Services</p>
              <p class="text-sm text-light opacity-80 mb-6">JWT Authentication • Cloudinary • Swagger • Jest Testing</p>
            </div>
            <div class="flex justify-end gap-4">
              <a href="/docs" class="btn btn-primary hover-bg-button hover-scale transition-all">
                <i class="fas fa-book mr-2"></i>API Docs
              </a>
              <a href="https://github.com/Ndevu12" class="btn btn-outline hover-bg-accent hover-scale transition-all" target="_blank">
                <i class="fab fa-github mr-2"></i>GitHub
              </a>
            </div>
          </div>
        </div>
        <hr class="border-separator">
        <div class="text-center">
          <p class="opacity-70 text-sm" style="color: var(--light-text);">
            © 2024 Ndevu's Portfolio API. Built with ❤️ using modern web technologies.
          </p>
          <p class="opacity-60 text-xs mt-2" style="color: var(--light-text);">
            Professional REST API • Secure • Scalable • Well-Documented
          </p>
        </div>
      </footer>
    </div>

    <script>
      // Add interactive features
      document.addEventListener('DOMContentLoaded', function() {
        // Copy endpoint on click with improved feedback
        const endpoints = document.querySelectorAll('.endpoint');
        endpoints.forEach(endpoint => {
          endpoint.title = 'Click to copy';
          endpoint.addEventListener('click', function() {
            navigator.clipboard.writeText(this.textContent.trim()).then(() => {
              this.classList.add('copy-feedback');
              this.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
              
              setTimeout(() => {
                this.classList.remove('copy-feedback');
                this.innerHTML = this.textContent;
              }, 2000);
            }).catch(() => {
              // Fallback for older browsers
              const textArea = document.createElement('textarea');
              textArea.value = this.textContent.trim();
              document.body.appendChild(textArea);
              textArea.select();
              document.execCommand('copy');
              document.body.removeChild(textArea);
              
              this.classList.add('copy-feedback');
              this.innerHTML = '<i class="fas fa-check mr-2"></i>Copied!';
              
              setTimeout(() => {
                this.classList.remove('copy-feedback');
                this.innerHTML = this.textContent;
              }, 2000);
            });
          });
        });        // Staggered animation for cards
        const cards = document.querySelectorAll('[class*="animate-scale-up"]');
        cards.forEach((card, index) => {
          card.style.animationDelay = (0.1 + (index * 0.1)) + 's';
        });
      });
    </script>
  </body>
</html>
`;
