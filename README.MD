<h1>🚀 AnahiSoft - Sistema Contable 🛒💻</h1>

<h2 id="requisitos-previos">📋 Requisitos</h2>

<ul>
  <li>🐘 <strong>PHP</strong>: 8.2+.</li>
  <li>🐘 <strong>Laravel</strong>: 12.</li>
  <li>🐘 <strong>Laravel Herd</strong>: https://herd.laravel.com/</li>
  <li>🎼 <strong>Composer</strong>.</li>
  <li>🟢 <strong>Node.js</strong>: 22+.</li>
  <li>📦 <strong>npm</strong>.</li>
  <li>🗄️ <strong>DB</strong>: MySQL.</li>
  <li>🌐 <strong>Servidor</strong>: Nginx.</li>
</ul>

<h2 id="instalación">⚡ Instalación</h2>

<ol>
  <li>🔽 <strong>Instalar Laravel Herd</strong>:
    <pre><code>https://herd.laravel.com/</code></pre>
  </li>
  <li>🔽 <strong>Clonar</strong>:
    <pre><code>git clone git@github.com:zxstudio-llc/anahisoft.git
cd anahisoft</code></pre>
  </li>
  <li>📦 <strong>Instalar PHP/Laravel</strong>:
    <pre><code>composer install</code></pre>
  </li>
  <li>🎭 <strong>Instalar JS</strong>:
    <pre><code>npm install</code></pre>
  </li>
</ol>

<h2 id="configuración">⚙️ Configuración</h2>

<ol>
  <li>📝 <strong>Copiar .env</strong>:
    <pre><code>cp .env.example .env</code></pre>
  </li>
  <li>🔑 <strong>Generar clave</strong>:
    <pre><code>php artisan key:generate</code></pre>
  </li>
  <li>🗄️ <strong>Migrar DB</strong>:
    <pre><code>php artisan migrate --seed</code></pre>
  </li>
  <li>🏗️ <strong>Compilar</strong>:
    <pre><code>npm run dev</code></pre>
  </li>
  <li>▶️ <strong>Iniciar servidor</strong>:
    <pre><code>php artisan serve</code></pre>
    📍 <a href="http://localhost:8000">http://localhost:8000</a>
  </li>
</ol>

