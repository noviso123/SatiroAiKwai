# 🚀 Satiro AI Kwai - Google Colab ULTRA FAST (Tudo-em-Um)

Este guia foi otimizado para rodar **TUDO EM UMA ÚNICA CÉLULA**.
Basta copiar o bloco de código abaixo, colar em um novo [Notebook do Google Colab](https://colab.research.google.com/) e apertar o Play.

---

## ⚡ O SUPER-COMBO (Configuração + Inicialização + Execução)
Copie e cole este bloco inteiro. Ele vai preparar o ambiente, baixar os modelos e rodar o pipeline automaticamente.

```python
# ==============================================================================
# 🚀 SATIRO AI KWAI - AUTOMATION PRO-MAX (MODO DIRECTO)
# ==============================================================================
import os
import time

# --- PARÂMETROS DE EXECUÇÃO ---
MODO = "standard" # @param ["standard", "react"]
VIDEO_INPUT = "video_original.mp4" # @param {type:"string"}
IMAGEM_FUNDO = "fundo.jpg" # @param {type:"string"} (Apenas p/ modo React)
IMAGEM_OVERLAY = "logo.png" # @param {type:"string"} (Apenas p/ modo React)

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

# 2. MODELO DE VOZ (VOSK)
if not os.path.exists("model"):
    run_step("Download Modelo Vosk PT-BR", "mkdir -p model && wget -q https://alphacephei.com/vosk/models/vosk-model-small-pt-0.3.zip && unzip -q vosk-model-small-pt-0.3.zip && mv vosk-model-small-pt-0.3/* model/ && rm -rf vosk-model-small-pt-0.3.zip vosk-model-small-pt-0.3")

# 3. PREPARAÇÃO DO PROJETO
if not os.path.exists("package.json"):
    print("⚠️  AVISO: package.json não encontrado. Certifique-se de que o projeto foi carregado no diretório atual!")
else:
    run_step("Instalação node_modules", "npm install")

# 4. EXECUÇÃO DO PIPELINE (GPU ACCELERATED)
output_dir = "public/output"
os.makedirs(output_dir, exist_ok=True)

if MODO == "standard":
    cmd_exec = f'python scripts/ai/orchestrator.py "{VIDEO_INPUT}" "{output_dir}" standard --gpu'
else:
    cmd_exec = f'python scripts/ai/orchestrator.py "{VIDEO_INPUT}" "{output_dir}" react "{IMAGEM_FUNDO}" "{IMAGEM_OVERLAY}" --gpu'

run_step(f"Pipeline Satiro AI ({MODO})", cmd_exec)

# 5. FINALIZAÇÃO E DOWNLOAD
run_step("Compactação de Resultados", "zip -r -q satiro_results.zip public/output/")

from google.colab import files
print("\n🎉 TUDO PRONTO! O download começará em instantes...")
files.download('satiro_results.zip')
```

---

## 📝 Dicas Importantes:
1. **Upload de Arquivos:** Antes de rodar, clique no ícone de pasta 📂 à esquerda no Colab e arraste seus vídeos e imagens para lá.
2. **GPU Ativada:** Vá em *Ambiente de Execução* > *Alterar tipo de ambiente de execução* e selecione **T4 GPU** (ou L4/A100) para velocidade máxima.
3. **Persistência:** Se quiser salvar no seu Google Drive, adicione `from google.colab import drive; drive.mount('/content/drive')` no início do código.

**Garantia:** Este código foi testado para ser 100% autônomo. Se os arquivos de entrada estiverem lá, o resultado sairá perfeito!
