# 🚀 Satiro AI Kwai - Google Colab ULTRA FAST (Tudo-em-Um)

Este guia foi otimizado para rodar **TUDO EM UMA ÚNICA CÉLULA**.
Basta copiar o bloco de código abaixo, colar em um novo [Notebook do Google Colab](https://colab.research.google.com/) e apertar o Play.

---

## ⚡ O SUPER-COMBO (Configuração + Inicialização + Execução)
Copie e cole este bloco inteiro no seu Colab. Ele faz tudo sozinho!

```python
# ==============================================================================
# 🚀 SATIRO AI KWAI - AUTOMATION PRO-MAX (MODO DIRECTO)
# ==============================================================================
import os
import time

# --- PARÂMETROS DE EXECUÇÃO ---
# @markdown ### Configurações do Vídeo
MODO = "standard" # @param ["standard", "react"]
VIDEO_INPUT = "video_original.mp4" # @param {type:"string"}
IMAGEM_FUNDO = "fundo.jpg" # @param {type:"string"}
IMAGEM_OVERLAY = "logo.png" # @param {type:"string"}

def run_step(name, command):
    print(f"\n--- ⏳ INICIANDO: {name} ---")
    start_time = time.time()
    !{command}
    end_time = time.time()
    print(f"✅ CONCLUÍDO: {name} ({int(end_time - start_time)}s)")

# 1. SETUP DO SISTEMA
if not os.path.exists("/usr/bin/node"):
    run_step("Instalação Node.js 18", "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs")

run_step("Dependências do Sistema (FFmpeg/Chromium)", "sudo apt-get install -y ffmpeg libnss3 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2 libpango-1.0-0 libpangocairo-1.0-0")

run_step("Bibliotecas Python GPU", "pip install onnxruntime-gpu vosk pydub rembg mediapipe moviepy opencv-python numpy Pillow")

# 2. DOWNLOAD DO PROJETO E MODELO
os.chdir('/content') # Garante que estamos na raiz do Colab
if not os.path.exists("SatiroAiKwai"):
    run_step("Download do Código (GitHub)", "git clone https://github.com/noviso123/SatiroAiKwai.git")

%cd /content/SatiroAiKwai

if not os.path.exists("scripts/ai/model"):
    run_step("Download Modelo Vosk PT-BR", "mkdir -p scripts/ai/model && wget -q https://alphacephei.com/vosk/models/vosk-model-small-pt-0.3.zip && unzip -q vosk-model-small-pt-0.3.zip && mv vosk-model-small-pt-0.3/* scripts/ai/model/ && rm -rf vosk-model-small-pt-0.3.zip vosk-model-small-pt-0.3")

# 3. INSTALAÇÃO DE MÓDULOS
if not os.path.exists("node_modules"):
    run_step("Instalação node_modules (Remotion)", "npm install --legacy-peer-deps")

# 4. EXECUÇÃO DO PIPELINE (GPU ACCELERATED)
output_dir = "public/output"
os.makedirs(output_dir, exist_ok=True)

# Garante que os arquivos de entrada existam antes de rodar
if not os.path.exists(f"../{VIDEO_INPUT}"):
    print(f"❌ ERRO: O arquivo '{VIDEO_INPUT}' não foi encontrado! Faça o upload dele na pasta raiz do Colab.")
else:
    # Ajusta caminho do input pois estamos dentro da pasta do projeto
    input_path = f"../{VIDEO_INPUT}"

    if MODO == "standard":
        cmd_exec = f'python scripts/ai/orchestrator.py "{input_path}" "{output_dir}" standard --gpu'
    else:
        cmd_exec = f'python scripts/ai/orchestrator.py "{input_path}" "{output_dir}" react "../{IMAGEM_FUNDO}" "../{IMAGEM_OVERLAY}" --gpu'

    run_step(f"Pipeline Satiro AI ({MODO})", cmd_exec)

    # 5. FINALIZAÇÃO E DOWNLOAD
    run_step("Compactação de Resultados", "zip -r -q ../satiro_results.zip public/output/")

    from google.colab import files
    print("\n🎉 TUDO PRONTO! O download começará em instantes...")
    files.download('../satiro_results.zip')
```

---

## 📝 Como rodar (Passo-a-Passo):
1. **Ative a GPU:** Vá em *Ambiente de Execução* > *Alterar tipo de ambiente de execução* e selecione **T4 GPU**.
2. **Suba seus arquivos:** Na barra lateral esquerda do Colab, clique no ícone de pasta (📂). **Arraste seu vídeo (`video_original.mp4`) para o espaço vazio abaixo da pasta 'sample_data' (na raiz).**
3. **Cole e Rode:** Cole o código acima em uma célula e aperte o botão de play.

**Guia de Cores:** O sistema vai te avisar de cada etapa com ícones e tempo de execução. Se faltar algum arquivo, ele vai te dar um alerta claro em vermelho!
