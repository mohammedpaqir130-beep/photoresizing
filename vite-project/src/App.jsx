// src/App.jsx
import { useEffect, useRef, useState } from "react";
import AdSense from "./AdSense.jsx";

/* ============================================================
   CONFIG — point these to your model files
   ============================================================ */
const MODEL_X2_URL = "/models/realesrgan_x2.onnx";
const MODEL_X4_URL = "/models/realesrgan_x4.onnx";
const ORT_CDN = "https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js";

/* If your model expects BGR instead of RGB */
const MODEL_EXPECTS_BGR = true;

/* Model output range: "auto" | "0to1" | "neg1to1" | "0to255" */
const MODEL_OUTPUT_RANGE = "auto";

/* Debug options */
const FORCE_WASM = false;         // force CPU if true
const MAX_SIDE_FOR_DEBUG = 0;     // 0 = off

/* Default fixed tile sizes (overwritten by model metadata if present) */
const TILE_SIZE_X2 = 64;
const TILE_SIZE_X4 = 128;
const TILE_OVERLAP = 8;

/* ============================================================
   Ad placeholder (unused now but kept if you want it later)
   ============================================================ */
function AdSlot({ label = "Ad", size = "300×600" }) {
  return (
    <div className="ad-slot" style={adStyles.slot} aria-label={`${label} ${size}`}>
      <div style={adStyles.inner}>
        <div style={adStyles.badge}>{label}</div>
        <div style={adStyles.size}>{size}</div>
      </div>
    </div>
  );
}

/* ============================================================
   Content sections (adds REAL text for AdSense)
   ============================================================ */
function ContentSections() {
  return (
    <>
      {/* ABOUT / INTRO */}
      <section id="about" style={styles.card}>
        <h2 style={styles.h2}>What is PhotoResizing?</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7 }}>
          <strong>PhotoResizing</strong> is a free, browser-based image tool. You can resize, crop,
          compress and enhance your pictures without installing any software or creating an account.
          Everything runs directly in your browser, which means your images stay on your device.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.7 }}>
          The tool is perfect for social media posts, YouTube thumbnails, school projects, online
          shops, blogs and even 2D game assets. Just upload a photo, choose your options and download
          the optimized image in seconds.
        </p>
      </section>

      {/* HOW TO USE */}
      <section id="how-to" style={styles.card}>
        <h2 style={styles.h2}>How to Use the Photo Resizer</h2>
        <ol style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Click <strong>Upload</strong> and choose a JPG, PNG or WebP image.</li>
          <li>
            Pick a mode:
            <ul style={{ marginTop: 4, paddingLeft: 18 }}>
              <li><strong>Enhance &amp; Upscale (AI)</strong> for improving quality or making small images larger.</li>
              <li><strong>Resize &amp; Crop</strong> for exact pixel sizes and simple edits.</li>
              <li><strong>Studio Tools</strong> for rotate, flip and quick presets.</li>
              <li><strong>Filters</strong> for cinematic / warm / cool / retro looks.</li>
              <li><strong>Text &amp; Watermark</strong> to add your logo or text.</li>
              <li><strong>Background Remover</strong> to make the background transparent (for PNG).</li>
            </ul>
          </li>
          <li>Adjust the width and height or use the percentage buttons (25%, 50%, 200%, etc.).</li>
          <li>Optionally draw a crop area on the image to cut out a specific part.</li>
          <li>Use Studio / Filters / Text / Background tabs to finish your edit.</li>
          <li>Select the output format (PNG, JPG or WebP) and quality level.</li>
          <li>Click <strong>Download image</strong> to save the result to your device.</li>
        </ol>
        <p style={styles.muted}>
          Tip: For transparent background, export as <strong>PNG</strong> so the alpha channel is kept.
        </p>
      </section>

      {/* FEATURES */}
      <section id="features" style={styles.card}>
        <h2 style={styles.h2}>Why Use PhotoResizing?</h2>
        <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
          <li>
            <strong>Fast:</strong> Resize and compress images in a few seconds, even on slower PCs.
          </li>
          <li>
            <strong>Simple:</strong> Clean interface made for beginners and power users. No hidden
            menus or complicated options.
          </li>
          <li>
            <strong>Private:</strong> Images are processed in your browser using modern Web
            technology. They are not permanently uploaded to a server.
          </li>
          <li>
            <strong>Multi-purpose:</strong> Works great for social media, websites, school work,
            presentations and 2D game graphics.
          </li>
          <li>
            <strong>AI Upscaling:</strong> Improve small or slightly blurry images using AI models,
            then fine-tune sharpness and noise.
          </li>
          <li>
            <strong>Studio &amp; Filters:</strong> Rotate, flip, apply cinematic looks and add custom
            watermarks for a complete mini photo studio.
          </li>
          <li>
            <strong>Magic Background Remover:</strong> Detect the background color and make it transparent
            for product photos, sprites and thumbnails.
          </li>
        </ul>
      </section>

      {/* TIPS / BEST PRACTICES */}
      <section id="tips" style={styles.card}>
        <h2 style={styles.h2}>Tips for Smaller Files Without Losing Quality</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7 }}>
          If your image looks too blurry or blocky after compression, try these tricks:
        </p>
        <ul style={{ fontSize: 14, lineHeight: 1.8, paddingLeft: 20 }}>
          <li>
            Start with a higher quality setting (around <strong>0.7–0.85</strong>) instead of going
            straight to very low values like 0.3.
          </li>
          <li>
            Resize very large images (for example, 4000×3000px) down to the real size you need
            (maybe 1920×1080px for a screen or 1080×1080px for Instagram).
          </li>
          <li>
            Use <strong>JPG</strong> or <strong>WebP</strong> for photos, and <strong>PNG</strong> when
            you need transparency or super-sharp UI elements and logos.
          </li>
          <li>
            If you are making a website, try to keep most images below{" "}
            <strong>300–500 KB</strong> so your pages load quickly on mobile data.
          </li>
          <li>
            For game developers: export your sprites at power-of-two sizes (for example 256×256 or
            512×512) when possible to keep things cleaner in engines like Godot or Unity.
          </li>
        </ul>
      </section>

      {/* FAQ */}
      <section id="faq" style={styles.card}>
        <h2 style={styles.h2}>Frequently Asked Questions</h2>

        <h3 style={faqTitle}>Is PhotoResizing free?</h3>
        <p style={faqText}>
          Yes. You can resize, crop, compress and enhance as many images as you want for free. The
          site is supported by respectful ads.
        </p>

        <h3 style={faqTitle}>Do you store my pictures?</h3>
        <p style={faqText}>
          No. All processing happens in your browser using JavaScript and ONNX Runtime. We do not
          permanently store or sell your images.
        </p>

        <h3 style={faqTitle}>Which formats are supported?</h3>
        <p style={faqText}>
          You can upload JPG, PNG and (in most browsers) WebP files. You can download the result as
          PNG, JPG or WebP depending on what you choose in the Download step.
        </p>

        <h3 style={faqTitle}>Can I use the results for commercial projects?</h3>
        <p style={faqText}>
          Yes, as long as you own the original image or have permission to use it. PhotoResizing only
          changes the size and quality of your files; it does not change the ownership.
        </p>

        <h3 style={faqTitle}>Will the AI always improve my image?</h3>
        <p style={faqText}>
          AI upscaling works best on photos and detailed textures. For very low-resolution or heavily
          compressed images, it can still add detail, but sometimes the classic resize mode might look
          more natural. You can always compare the results in the Preview area.
        </p>
      </section>

      {/* PRIVACY POLICY */}
      <section id="privacy-policy" style={styles.card}>
        <h2 style={styles.h2}>Privacy Policy</h2>

        <p style={{ fontSize: 14, lineHeight: 1.7 }}>
          This website provides free online tools for resizing, compressing and enhancing images.
          We care about your privacy and try to keep things as simple and transparent as possible.
        </p>

        <h3 style={faqTitle}>Image processing</h3>
        <p style={faqText}>
          Images that you upload are processed directly in your browser using HTML5 canvas and
          optional AI models. We do not use your images to train models, and we do not sell or
          share your images with third parties.
        </p>

        <h3 style={faqTitle}>Log data &amp; basic analytics</h3>
        <p style={faqText}>
          Like most websites, basic technical information may be collected automatically such as
          your browser type, approximate region, device type and pages you visit. This information
          is used to keep the site running well and to understand how people use the tools.
        </p>

        <h3 style={faqTitle}>Cookies &amp; advertising</h3>
        <p style={faqText}>
          This site uses Google AdSense to display ads. Third-party vendors, including Google, may
          use cookies to serve ads based on your previous visits to this or other websites. Google&apos;s
          use of advertising cookies enables it and its partners to serve ads based on your visit
          to this site and/or other sites on the Internet.
        </p>
        <p style={faqText}>
          You can opt out of personalized advertising by visiting Google&apos;s Ads Settings, or by
          using other tools that block or control cookies in your browser.
        </p>

        <h3 style={faqTitle}>Links to other sites</h3>
        <p style={faqText}>
          This website may contain links to external sites (for example, documentation or help
          articles). We are not responsible for the content or privacy practices of those sites.
        </p>

        <h3 style={faqTitle}>Changes to this policy</h3>
        <p style={faqText}>
          This privacy policy may be updated from time to time as the site evolves. When changes
          are made, the updated policy will be posted on this page.
        </p>

        <h3 style={faqTitle}>Contact</h3>
        <p style={faqText}>
          If you have any questions about this privacy policy, you can contact the developer at
          the email address listed in the About section of this page.
        </p>
      </section>

      {/* ABOUT / CONTACT NOTE */}
      <section id="about-owner" style={styles.card}>
        <h2 style={styles.h2}>About the Creator</h2>
        <p style={{ fontSize: 14, lineHeight: 1.7 }}>
          PhotoResizing is built and maintained by an independent developer who loves building tools
          for creators, students and game developers. The goal is to keep this site{" "}
          <strong>simple, fast and ad-friendly</strong> without pop-ups or fake download buttons.
        </p>
        <p style={{ fontSize: 14, lineHeight: 1.7 }}>
          If you find a bug or have a feature request, you can contact me directly at{" "}
          <a href="mailto:mohammedpaqir130@gmail.com" style={{ color: "#a9e9ff" }}>
            mohammedpaqir130@gmail.com
          </a>.
        </p>
      </section>
    </>
  );
}

/* ============================================================
   Sub-components
   ============================================================ */
function PreviewSection({ canvasRef, overlayRef, showOverlay, onReset, canReset }) {
  return (
    <section className="card-hover" style={styles.card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={styles.h2}>4) Preview</h2>
        <button className="btn" style={btn} onClick={onReset} disabled={!canReset}>
          Reset to original
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="preview-wrap" style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
          <canvas ref={canvasRef} className="preview-canvas" />
          {showOverlay && <canvas ref={overlayRef} className="overlay" style={overlayCSS} />}
        </div>
      </div>
    </section>
  );
}

function DownloadSection({ format, setFormat, quality, setQuality, imgObj, compressedURL, compressedSize, onDownload }) {
  return (
    <section className="card-hover" style={styles.card}>
      <h2 style={styles.h2}>5) Download</h2>
      <div style={{ ...styles.controls, textAlign: "center" }}>
        <label style={styles.label}>
          Format
          <select style={styles.input} value={format} onChange={(e) => setFormat(e.target.value)} disabled={!imgObj}>
            <option value="image/png">PNG (lossless, supports transparency)</option>
            <option value="image/jpeg">JPG (small, lossy)</option>
            <option value="image/webp">WebP (small, modern)</option>
          </select>
        </label>
        {(format === "image/jpeg" || format === "image/webp") && (
          <label style={styles.label}>
            Quality: {quality.toFixed(2)}
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.01"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              disabled={!imgObj}
            />
          </label>
        )}

        {compressedURL && (
          <div style={{ display: "grid", gap: 8, justifyItems: "center", marginTop: 8 }}>
            <img
              src={compressedURL}
              alt="Compressed preview"
              style={{ maxWidth: 320, maxHeight: 180, borderRadius: 8, border: "1px solid #2b2b2b" }}
            />
            <div style={{ fontSize: 12, color: "#a9e9ff" }}>
              Estimated file size: {(compressedSize / 1024).toFixed(1)} KB
            </div>
          </div>
        )}

        <button className="btn-primary" style={styles.btnPrimary} onClick={onDownload} disabled={!imgObj}>
          Download image
        </button>
      </div>
    </section>
  );
}

/* ============================ MAIN APP ============================ */
export default function App() {
  // Refs
  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const fileInputRef = useRef(null);

  // Core image state
  const [imgObj, setImgObj] = useState(null);
  const [natW, setNatW] = useState(0);
  const [natH, setNatH] = useState(0);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);

  const [format, setFormat] = useState("image/png");
  const [quality, setQuality] = useState(0.92);
  const [fileName, setFileName] = useState("");

  // Drag & drop + compressed preview
  const [isDragging, setIsDragging] = useState(false);
  const [compressedURL, setCompressedURL] = useState(null);
  const [compressedSize, setCompressedSize] = useState(0);

  // TABS: "ai" | "resize" | "studio" | "filters" | "text" | "bg"
  const [tab, setTab] = useState("ai");

  // ============== Enhance & Upscale (AI) state ==============
  const [upscaleFactor, setUpscaleFactor] = useState(2); // 2 or 4
  const [faceEnhance, setFaceEnhance] = useState(false); // placeholder toggle
  const [aiReady, setAiReady] = useState(false);
  const [aiStatus, setAiStatus] = useState("");
  const [aiBusy, setAiBusy] = useState(false);
  const [detailBoost, setDetailBoost] = useState(0.60);
  const [microContrast, setMicroContrast] = useState(0.30);
  const [denoise, setDenoise] = useState(0.15);

  // ============== Resize & Crop state ==============
  const [lockAspect, setLockAspect] = useState(true);
  const aspect = natW && natH ? natW / natH : 1;

  const [cropMode, setCropMode] = useState(false);
  const [sel, setSel] = useState(null);
  const draggingRef = useRef(false);
  const startPtRef = useRef(null);

  // ============== Filters & Watermark state ==============
  const [filterStrength, setFilterStrength] = useState(0.8);

  const [wmText, setWmText] = useState("PhotoResizing.net");
  const [wmSize, setWmSize] = useState(32);
  const [wmOpacity, setWmOpacity] = useState(0.5);
  const [wmPosition, setWmPosition] = useState("bottom-right"); // "top-left", etc.
  const [wmColor, setWmColor] = useState("#ffffff");

  // ============== Magic Background Remover state ==============
  const [bgTolerance, setBgTolerance] = useState(60); // color distance threshold
  const [bgFeather, setBgFeather] = useState(20);     // smooth edge width in color space
  const [bgSamplePreview, setBgSamplePreview] = useState(null); // "rgb(r,g,b)"

  /* ---------- helpers ---------- */
  function dataURLBytes(dataURL) {
    const base64 = dataURL.split(",")[1] || "";
    const len = base64.length;
    const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
    return Math.floor((len * 3) / 4) - padding;
  }
  function updateCompressedPreview() {
    const c = canvasRef.current;
    if (!c || !imgObj) { setCompressedURL(null); setCompressedSize(0); return; }
    const useQ = (format === "image/jpeg" || format === "image/webp") ? quality : undefined;
    const url = c.toDataURL(format, useQ);
    setCompressedURL(url);
    setCompressedSize(dataURLBytes(url));
  }

  /* ---------- file load ---------- */
  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImgObj(img);
      setNatW(img.naturalWidth); setNatH(img.naturalHeight);
      setW(img.naturalWidth); setH(img.naturalHeight);
      draw(img, img.naturalWidth, img.naturalHeight);
      URL.revokeObjectURL(url);
      updateCompressedPreview();
      // Reset crop state on new image
      setCropMode(false); setSel(null);
      overlayClear();
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }

  function draw(image, dw, dh) {
    const c = canvasRef.current; if (!c || !image) return;
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    c.width = dw; c.height = dh;
    ctx.clearRect(0, 0, dw, dh);
    ctx.drawImage(image, 0, 0, dw, dh);
  }

  /* ===================== Image helpers (quality) ===================== */
  function cloneCanvas(src) {
    const c = document.createElement("canvas");
    c.width = src.width; c.height = src.height;
    c.getContext("2d").drawImage(src, 0, 0);
    return c;
  }
  function convolve3x3Canvas(srcCanvas, kernel, divisor = 1, bias = 0) {
    const w = srcCanvas.width, h = srcCanvas.height;
    const sctx = srcCanvas.getContext("2d");
    const src = sctx.getImageData(0, 0, w, h);
    const dst = sctx.createImageData(w, h);
    const S = src.data, D = dst.data, k = kernel;

    const iOf = (x,y)=>((y*w+x)<<2);
    for (let y=0;y<h;y++){
      for (let x=0;x<w;x++){
        let r=0,g=0,b=0;
        for (let ky=-1;ky<=1;ky++){
          const yy = Math.max(0, Math.min(h-1, y+ky));
          for (let kx=-1;kx<=1;kx++){
            const xx = Math.max(0, Math.min(w-1, x+kx));
            const ii = iOf(xx,yy), kv = k[(ky+1)*3 + (kx+1)];
            r += S[ii]   * kv;
            g += S[ii+1] * kv;
            b += S[ii+2] * kv;
          }
        }
        const o = iOf(x,y);
        D[o]   = Math.max(0, Math.min(255, (r/divisor)+bias));
        D[o+1] = Math.max(0, Math.min(255, (g/divisor)+bias));
        D[o+2] = Math.max(0, Math.min(255, (b/divisor)+bias));
        D[o+3] = S[o+3];
      }
    }
    const out = document.createElement("canvas");
    out.width = w; out.height = h;
    out.getContext("2d").putImageData(dst, 0, 0);
    return out;
  }
  function unsharpCanvas(srcCanvas, amount = 0.5) {
    const blur = convolve3x3Canvas(srcCanvas, [
      1,1,1, 1,1,1, 1,1,1
    ], 9, 0);
    const w = srcCanvas.width, h = srcCanvas.height;
    const actx = srcCanvas.getContext("2d");
    const A = actx.getImageData(0, 0, w, h);
    const B = blur.getContext("2d").getImageData(0, 0, w, h);
    const d = A.data, b = B.data;
    const k = Math.max(0, Math.min(1, amount));
    for (let i=0;i<d.length;i+=4){
      d[i]   = Math.max(0, Math.min(255, d[i]   + (d[i]   - b[i])   * k));
      d[i+1] = Math.max(0, Math.min(255, d[i+1] + (d[i+1] - b[i+1]) * k));
      d[i+2] = Math.max(0, Math.min(255, d[i+2] + (d[i+2] - b[i+2]) * k));
    }
    const out = document.createElement("canvas");
    out.width = w; out.height = h;
    out.getContext("2d").putImageData(A, 0, 0);
    return out;
  }
  function highPassBoost(srcCanvas, strength = 0.25) {
    const w = srcCanvas.width, h = srcCanvas.height;
    const blur = convolve3x3Canvas(srcCanvas, [
      1,1,1, 1,1,1, 1,1,1
    ], 9, 0);
    const sctx = srcCanvas.getContext("2d");
    const bctx = blur.getContext("2d");
    const S = sctx.getImageData(0,0,w,h);
    const B = bctx.getImageData(0,0,w,h);
    const d = S.data, bb = B.data;
    const k = Math.max(0, Math.min(1, strength));
    for (let i=0;i<d.length;i+=4){
      const hpR = d[i]   - bb[i];
      const hpG = d[i+1] - bb[i+1];
      const hpB = d[i+2] - bb[i+2];
      d[i]   = Math.max(0, Math.min(255, d[i]   + hpR * k));
      d[i+1] = Math.max(0, Math.min(255, d[i+1] + hpG * k));
      d[i+2] = Math.max(0, Math.min(255, d[i+2] + hpB * k));
    }
    const out = document.createElement("canvas");
    out.width = w; out.height = h;
    out.getContext("2d").putImageData(S, 0, 0);
    return out;
  }
  function denoiseLight(srcCanvas, amount = 0.2) {
    if (amount <= 0) return cloneCanvas(srcCanvas);
    const blur = convolve3x3Canvas(srcCanvas, [
      1,2,1, 2,4,2, 1,2,1
    ], 16, 0);
    const w = srcCanvas.width, h = srcCanvas.height;
    const sctx = srcCanvas.getContext("2d");
    const bctx = blur.getContext("2d");
    const S = sctx.getImageData(0,0,w,h);
    const B = bctx.getImageData(0,0,w,h);
    const d = S.data, bb = B.data;
    const mix = Math.max(0, Math.min(1, amount));
    for (let i=0;i<d.length;i+=4){
      d[i]   = Math.round(d[i]   * (1-mix) + bb[i]   * mix);
      d[i+1] = Math.round(d[i+1] * (1-mix) + bb[i+1] * mix);
      d[i+2] = Math.round(d[i+2] * (1-mix) + bb[i+2] * mix);
    }
    const out = document.createElement("canvas");
    out.width = w; out.height = h;
    out.getContext("2d").putImageData(S, 0, 0);
    return out;
  }
  function qualityPipeline(srcCanvas, opts) {
    const { detail = 0.60, micro = 0.30, de = 0.15 } = opts || {};
    let work = cloneCanvas(srcCanvas);
    if (de > 0) work = denoiseLight(work, de);
    if (detail > 0) work = unsharpCanvas(work, detail);
    if (micro > 0) work = highPassBoost(work, micro);
    return work;
  }

  /* ===================== AI ENGINE ===================== */
  async function ensureAiReady() {
    const webgpuOK = typeof navigator !== "undefined" && !!navigator.gpu && !FORCE_WASM;

    if (!MODEL_X2_URL && !MODEL_X4_URL) {
      setAiStatus("AI model URLs not set. Using Classic mode.");
      setAiReady(false);
      return false;
    }
    try {
      setAiStatus("Loading AI engine…");
      if (!window.ort) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = ORT_CDN;
          s.async = true;
          s.onload = () => resolve();
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      setAiReady(true);
      setAiStatus(webgpuOK ? "AI ready (WebGPU) ✅" : "AI ready (CPU/WASM) ✅");
      return true;
    } catch (e) {
      console.error(e);
      setAiReady(false);
      setAiStatus("Failed to init AI. Falling back to Classic.");
      return false;
    }
  }

  /* ===================== One-Button Enhance & Upscale ===================== */
  async function enhanceAndUpscaleOneClick() {
    if (!imgObj || !canvasRef.current) return;

    const factor = upscaleFactor;
    const useModel = factor === 4 ? MODEL_X4_URL : MODEL_X2_URL;

    const ok = await ensureAiReady();
    if (!ok || !useModel) {
      setAiStatus("AI not available — using Classic.");
      upscaleClassicThenEnhance(factor);
      return;
    }
    try {
      await aiUpscaleThenEnhance(factor);
    } catch (err) {
      console.error("[AI ERROR]", err);
      setAiStatus(`AI failed: ${(err && (err.message || err.toString())) || "Unknown"}. Using Classic fallback.`);
      upscaleClassicThenEnhance(factor);
    }
  }

  /* ===================== Classic path ===================== */
  function upscaleClassicThenEnhance(factor = 2) {
    const src = canvasRef.current;
    if (!src) return;

    const upW = Math.max(1, Math.round(src.width * factor));
    const upH = Math.max(1, Math.round(src.height * factor));
    const tmp = document.createElement("canvas");
    tmp.width = upW; tmp.height = upH;
    const tctx = tmp.getContext("2d");
    tctx.imageSmoothingEnabled = true;
    tctx.imageSmoothingQuality = "high";
    tctx.drawImage(src, 0, 0, upW, upH);

    const boosted = qualityPipeline(tmp, { detail: detailBoost, micro: microContrast, de: denoise });

    const ctx = src.getContext("2d");
    src.width = upW; src.height = upH;
    ctx.drawImage(boosted, 0, 0);

    setW(upW); setH(upH);
    updateCompressedPreview();
  }

  /* ===================== Edge-extend padding ===================== */
  function makeEdgePadded(source, tileW, tileH, overlap) {
    const W = source.width, H = source.height;
    const strideX = tileW - overlap * 2;
    const strideY = tileH - overlap * 2;

    const padW = (W <= tileW) ? tileW
      : (W % strideX === 0 ? W + overlap * 2 : Math.ceil((W - tileW) / strideX) * strideX + tileW);
    const padH = (H <= tileH) ? tileH
      : (H % strideY === 0 ? H + overlap * 2 : Math.ceil((H - tileH) / strideY) * strideY + tileH);

    const c = document.createElement("canvas");
    c.width = padW; c.height = padH;
    const ctx = c.getContext("2d");
    ctx.clearRect(0, 0, padW, padH);

    // draw source at (0,0)
    ctx.drawImage(source, 0, 0);

    const right = W - 1, bottom = H - 1;

    // left/right edge replicate
    if (padW > W) {
      ctx.drawImage(source, 0, 0, 1, H, -overlap, 0, overlap, H);
      ctx.drawImage(source, right, 0, 1, H, W, 0, padW - W, H);
    }
    // top/bottom edge replicate
    if (padH > H) {
      ctx.drawImage(source, 0, 0, W, 1, 0, -overlap, W, overlap);
      ctx.drawImage(source, 0, bottom, W, 1, 0, H, W, padH - H);
    }
    // corners (1×1 stretched)
    if (padW > W && padH > H) {
      ctx.drawImage(source, 0, 0, 1, 1, -overlap, -overlap, overlap, overlap);
      ctx.drawImage(source, right, 0, 1, 1, W, -overlap, padW - W, overlap);
      ctx.drawImage(source, 0, bottom, 1, 1, -overlap, H, overlap, padH - H);
      ctx.drawImage(source, right, bottom, 1, 1, W, H, padW - W, padH - H);
    }
    return { canvas: c, padW, padH, strideX, strideY };
  }

  /* ===================== AI path (Upscale → Enhance) ===================== */
  async function aiUpscaleThenEnhance(factor = 2) {
    if (!imgObj || !canvasRef.current) return;

    const modelURL = factor === 4 ? MODEL_X4_URL : MODEL_X2_URL;
    if (!modelURL) throw new Error("Model URL is not set for the selected factor.");

    if (MAX_SIDE_FOR_DEBUG > 0) {
      const src = canvasRef.current;
      const maxSide = MAX_SIDE_FOR_DEBUG;
      if (src.width > maxSide || src.height > maxSide) {
        const scale = maxSide / Math.max(src.width, src.height);
        const tmp = document.createElement("canvas");
        tmp.width = Math.round(src.width * scale);
        tmp.height = Math.round(src.height * scale);
        tmp.getContext("2d").drawImage(src, 0, 0, tmp.width, tmp.height);
        const ctx = src.getContext("2d");
        src.width = tmp.width; src.height = tmp.height;
        ctx.drawImage(tmp, 0, 0);
        setW(src.width); setH(src.height);
      }
    }

    const ort = window.ort;
    setAiBusy(true);
    try {
      setAiStatus(`Fetching model: ${modelURL} …`);
      const resp = await fetch(modelURL, { cache: "force-cache" });
      if (!resp.ok) throw new Error(`Model fetch ${resp.status} ${resp.statusText} at ${modelURL}`);
      const modelBytes = await resp.arrayBuffer();

      const webgpuOK = typeof navigator !== "undefined" && !!navigator.gpu && !FORCE_WASM;
      const ep = webgpuOK ? ["webgpu", "wasm"] : ["wasm"];
      const epLabel = webgpuOK ? "WEBGPU → WASM" : "WASM";
      setAiStatus(`Initializing session (${epLabel})…`);

      const session = await ort.InferenceSession.create(modelBytes, {
        executionProviders: ep,
        graphOptimizationLevel: "all",
      });
      const inputName = session.inputNames?.[0] ?? "input";

      // Determine tile size from model metadata (if fixed)
      let tileW = factor === 4 ? TILE_SIZE_X4 : TILE_SIZE_X2;
      let tileH = tileW;
      let overlap = Math.max(0, Math.min(TILE_OVERLAP, Math.floor(Math.min(tileW, tileH) / 4)));
      try {
        const meta = session.inputMetadata?.[inputName];
        const dims = meta?.dimensions;
        const reqH = (typeof dims?.[2] === "number" && dims[2] > 0) ? dims[2] : null;
        const reqW = (typeof dims?.[3] === "number" && dims[3] > 0) ? dims[3] : null;
        if (reqW && reqH) { tileW = reqW; tileH = reqH; overlap = Math.max(0, Math.min(TILE_OVERLAP, Math.floor(Math.min(tileW, tileH) / 4))); }
      } catch {}

      tileW = Math.max(1, Math.round(tileW));
      tileH = Math.max(1, Math.round(tileH));

      async function runTile(imageData, inW, inH, normHint) {
        const data = imageData.data;
        const trySeq = normHint === "auto" ? ["0to1", "neg1to1", "0to255"] : [normHint];

        const tryOnce = async (mode) => {
          const chw = new Float32Array(3 * inH * inW);
          let p = 0, c0 = 0, c1 = inH * inW, c2 = 2 * inH * inW;

          for (let y = 0; y < inH; y++) {
            for (let x = 0; x < inW; x++) {
              let r = data[p], g = data[p+1], b = data[p+2]; p += 4;
              if (mode === "0to1") { r/=255; g/=255; b/=255; }
              else if (mode === "neg1to1"){ r=(r/255-0.5)/0.5; g=(g/255-0.5)/0.5; b=(b/255-0.5)/0.5; }

              if (MODEL_EXPECTS_BGR) { chw[c0++]=b; chw[c1++]=g; chw[c2++]=r; }
              else { chw[c0++]=r; chw[c1++]=g; chw[c2++]=b; }
            }
          }
          const inputTensor = new ort.Tensor("float32", chw, [1, 3, inH, inW]);
          const outputs = await session.run({ [inputName]: inputTensor });
          const outName = session.outputNames?.[0] ?? Object.keys(outputs)[0];
          return { tensor: outputs[outName] };
        };

        let lastErr = null;
        for (const mode of trySeq) {
          try { return await tryOnce(mode); } catch (e) { lastErr = e; }
        }
        throw lastErr || new Error("Inference failed for all normalization modes");
      }

      const source = canvasRef.current; // current visible image
      const W = source.width, H = source.height;

      // Edge-extend padded source for tiles (no black padding)
      const { canvas: srcPadded, padW, padH, strideX, strideY } =
        makeEdgePadded(source, tileW, tileH, TILE_OVERLAP);

      const tilesX = (padW <= tileW) ? 1 : Math.ceil((padW - tileW) / strideX) + 1;
      const tilesY = (padH <= tileH) ? 1 : Math.ceil((padH - tileH) / strideY) + 1;

      const assembled = document.createElement("canvas");
      assembled.width = padW * factor;
      assembled.height = padH * factor;
      const actx = assembled.getContext("2d");

      const tIn = document.createElement("canvas");
      tIn.width = tileW; tIn.height = tileH;
      const tInCtx = tIn.getContext("2d");

      setAiStatus(`Upscaling ${tilesX * tilesY} tiles (${tileW}×${tileH} → ${tileW*factor}×${tileH*factor})…`);
      for (let ty = 0; ty < tilesY; ty++) {
        for (let tx = 0; tx < tilesX; tx++) {
          const sx = Math.min(tx * strideX, padW - tileW);
          const sy = Math.min(ty * strideY, padH - tileH);

          tInCtx.clearRect(0, 0, tileW, tileH);
          tInCtx.drawImage(srcPadded, sx, sy, tileW, tileH, 0, 0, tileW, tileH);

          const imgData = tInCtx.getImageData(0, 0, tileW, tileH);
          const { tensor } = await runTile(imgData, tileW, tileH, "auto");

          let Hs = Number(tensor?.dims?.[2]);
          let Ws = Number(tensor?.dims?.[3]);
          if (!Number.isFinite(Hs) || Hs <= 0) Hs = tileH * factor;
          if (!Number.isFinite(Ws) || Ws <= 0) Ws = tileW * factor;

          const plane = Hs * Ws;
          const buf = tensor?.data;
          if (!buf || buf.length < plane * 3) {
            throw new Error(`Model output size mismatch. got=${buf ? buf.length : 0}, expected=${plane * 3}`);
          }

          const outImg = new ImageData(Ws, Hs);
          let q = 0;

          const outIsNeg1to1 = MODEL_OUTPUT_RANGE === "neg1to1" ||
            (MODEL_OUTPUT_RANGE === "auto" && Math.min(buf[0], buf[plane], buf[2*plane]) < 0);
          const outIs0to255 = MODEL_OUTPUT_RANGE === "0to255" ||
            (MODEL_OUTPUT_RANGE === "auto" && Math.max(buf[0], buf[plane], buf[2*plane]) > 1.5);

          const deNorm = (v) => {
            if (!Number.isFinite(v)) return 0;
            if (outIs0to255) return Math.max(0, Math.min(255, v));
            if (outIsNeg1to1) return Math.max(0, Math.min(255, Math.round((v * 0.5 + 0.5) * 255)));
            return Math.max(0, Math.min(255, Math.round(v * 255)));
          };

          const outputIsBGR = false;

          for (let i = 0; i < plane; i++) {
            const r = deNorm(buf[outputIsBGR ? plane*2 + i : i]);
            const g = deNorm(buf[plane + i]);
            const b = deNorm(buf[outputIsBGR ? i : plane*2 + i]);
            outImg.data[q++] = r; outImg.data[q++] = g; outImg.data[q++] = b; outImg.data[q++] = 255;
          }

          const tOut = document.createElement("canvas");
          tOut.width = Ws; tOut.height = Hs;
          tOut.getContext("2d").putImageData(outImg, 0, 0);

          const cropL = (sx === 0) ? 0 : TILE_OVERLAP * factor;
          const cropT = (sy === 0) ? 0 : TILE_OVERLAP * factor;
          const isRight = (sx + tileW >= padW);
          const isBottom = (sy + tileH >= padH);
          const cropR = isRight ? 0 : TILE_OVERLAP * factor;
          const cropB = isBottom ? 0 : TILE_OVERLAP * factor;

          const srcX = cropL, srcY = cropT;
          const srcW = Ws - cropL - cropR, srcH = Hs - cropT - cropB;

          const dstX = (sx * factor) + cropL;
          const dstY = (sy * factor) + cropT;

          actx.drawImage(tOut, srcX, srcY, srcW, srcH, dstX, dstY, srcW, srcH);
        }
      }

      const dest = canvasRef.current;
      const finalW = W * factor;
      const finalH = H * factor;
      // Crop assembled back to exact original field (no padded borders)
      dest.width = finalW; dest.height = finalH;
      const dctx = dest.getContext("2d");
      dctx.drawImage(assembled, 0, 0, finalW, finalH, 0, 0, finalW, finalH);

      // Optional extra enhancement
      const boosted = qualityPipeline(canvasRef.current, {
        detail: detailBoost,
        micro: microContrast,
        de: denoise,
      });
      dctx.clearRect(0,0,dest.width,dest.height);
      dctx.drawImage(boosted, 0, 0);

      setW(dest.width); setH(dest.height);
      updateCompressedPreview();
      setAiStatus(`Done ✅`);
    } finally {
      setAiBusy(false);
    }
  }

  /* ---------- Download ---------- */
  function download() {
    if (!canvasRef.current) return;
    const useQ = (format === "image/jpeg" || format === "image/webp") ? quality : undefined;
    const url = canvasRef.current.toDataURL(format, useQ);
    const a = document.createElement("a");
    const ext = format === "image/jpeg" ? "jpg" : format === "image/webp" ? "webp" : "png";
    a.download = `image.${ext}`; a.href = url; a.click();
  }

  /* ---------- Drag & drop ---------- */
  function handleFilesFromList(list) {
    const file = list?.[0];
    if (!file) return;
    try {
      const dt = new DataTransfer();
      dt.items.add(file);
      if (fileInputRef.current) fileInputRef.current.files = dt.files;
    } catch {}
    setFileName(file.name);
    const fake = { target: { files: [file] } };
    handleFile(fake);
  }
  function onDragOver(e) {
    e.preventDefault();
    if (!imgObj) setIsDragging(true);
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  }
  function onDragLeave() { setIsDragging(false); }
  function onDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer?.files?.length) handleFilesFromList(e.dataTransfer.files);
  }

  /* ===================== Resize & Crop Logic ===================== */
  function onWidthChange(next) {
    const val = parseInt(next || "0", 10) || 0;
    if (lockAspect && aspect) { setW(val); setH(Math.max(1, Math.round(val / aspect))); }
    else setW(val);
  }
  function onHeightChange(next) {
    const val = parseInt(next || "0", 10) || 0;
    if (lockAspect && aspect) { setH(val); setW(Math.max(1, Math.round(val * aspect))); }
    else setH(val);
  }

  // High quality live-resize FROM ORIGINAL (prevents blur accumulation)
  useEffect(() => {
    if (!imgObj || !canvasRef.current) return;
    if (tab !== "resize") return;
    if (w <= 0 || h <= 0) return;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const tmpW = Math.max(1, Math.round(w));
    const tmpH = Math.max(1, Math.round(h));
    c.width = tmpW; c.height = tmpH;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, tmpW, tmpH);
    ctx.drawImage(imgObj, 0, 0, imgObj.naturalWidth, imgObj.naturalHeight, 0, 0, tmpW, tmpH);
    updateCompressedPreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h, tab]);

  function resetOriginal() {
    if (!imgObj) return;
    draw(imgObj, natW, natH);
    setW(natW); setH(natH);
    setSel(null); setCropMode(false);
    overlayClear();
    updateCompressedPreview();
  }

  function syncOverlayBitmapToCanvas() {
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!canvas || !overlay) return;
    if (overlay.width !== canvas.width || overlay.height !== canvas.height) {
      overlay.width = canvas.width;
      overlay.height = canvas.height;
    }
  }
  function overlayDrawRect(nextSel) {
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    if (!overlay || !canvas) return;
    const ctx = overlay.getContext("2d");
    if (overlay.width !== canvas.width || overlay.height !== canvas.height) {
      overlay.width = canvas.width;
      overlay.height = canvas.height;
    }
    ctx.clearRect(0, 0, overlay.width, overlay.height);
    if (!nextSel) return;

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0, 0, overlay.width, overlay.height);
    ctx.clearRect(nextSel.x, nextSel.y, nextSel.w, nextSel.h);

    ctx.strokeStyle = "#00b3ff";
    ctx.lineWidth = 2;
    ctx.strokeRect(nextSel.x + 1, nextSel.y + 1, nextSel.w - 2, nextSel.h - 2);

    const handle = 8;
    const c = [
      [nextSel.x, nextSel.y],
      [nextSel.x + nextSel.w, nextSel.y],
      [nextSel.x, nextSel.y + nextSel.h],
      [nextSel.x + nextSel.w, nextSel.y + nextSel.h],
    ];
    ctx.fillStyle = "#00b3ff";
    for (const [cx, cy] of c) ctx.fillRect(cx - handle / 2, cy - handle / 2, handle, handle);
  }
  function overlayClear() {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const ctx = overlay.getContext("2d");
    ctx.clearRect(0, 0, overlay.width, overlay.height);
  }

  function mapClientToCanvas(clientX, clientY) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const xCSS = clientX - rect.left;
    const yCSS = clientY - rect.top;
    const clampedX = Math.max(0, Math.min(xCSS, rect.width));
    const clampedY = Math.max(0, Math.min(yCSS, rect.height));
    const scaleX = (canvas.width || 1) / rect.width;
    const scaleY = (canvas.height || 1) / rect.height;
    return { x: Math.round(clampedX * scaleX), y: Math.round(clampedY * scaleY) };
  }
  function onOverlayPointerDown(e) {
    if (!cropMode) return;
    e.preventDefault();
    syncOverlayBitmapToCanvas();
    const p = mapClientToCanvas(e.clientX, e.clientY);
    startPtRef.current = p;
    draggingRef.current = true;
    const next = { x: p.x, y: p.y, w: 1, h: 1 };
    setSel(next);
    overlayDrawRect(next);
    window.addEventListener("pointermove", onGlobalPointerMove);
    window.addEventListener("pointerup", onGlobalPointerUp, { once: true });
  }
  function onGlobalPointerMove(e) {
    if (!cropMode || !draggingRef.current || !startPtRef.current) return;
    const p = mapClientToCanvas(e.clientX, e.clientY);
    const nx = Math.min(startPtRef.current.x, p.x);
    const ny = Math.min(startPtRef.current.y, p.y);
    const nw = Math.max(1, Math.abs(p.x - startPtRef.current.x));
    const nh = Math.max(1, Math.abs(p.y - startPtRef.current.y));
    const next = { x: nx, y: ny, w: nw, h: nh };
    setSel(next);
    overlayDrawRect(next);
  }
  function onGlobalPointerUp() {
    if (!cropMode) return;
    draggingRef.current = false;
    startPtRef.current = null;
    window.removeEventListener("pointermove", onGlobalPointerMove);
    if (imgObj && sel && sel.w > 1 && sel.h > 1) applyCrop();
  }
  function applyCrop() {
    if (!imgObj || !sel || sel.w < 2 || sel.h < 2) return;
    const srcCanvas = canvasRef.current;
    const tmp = document.createElement("canvas");
    tmp.width = sel.w;
    tmp.height = sel.h;
    const tctx = tmp.getContext("2d");
    tctx.drawImage(srcCanvas, sel.x, sel.y, sel.w, sel.h, 0, 0, sel.w, sel.h);

    const ctx = srcCanvas.getContext("2d");
    srcCanvas.width = sel.w;
    srcCanvas.height = sel.h;
    ctx.drawImage(tmp, 0, 0);

    setW(sel.w); setH(sel.h);
    setSel(null);
    overlayClear();
    updateCompressedPreview();
  }
  function clearCrop() { setSel(null); overlayClear(); }

  /* ===================== STUDIO TOOLS (rotate, flip, presets) ===================== */

  function applyPresetSize(targetW, targetH) {
    if (!imgObj || !canvasRef.current) return;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const wNew = Math.max(1, targetW);
    const hNew = Math.max(1, targetH);
    c.width = wNew;
    c.height = hNew;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.clearRect(0, 0, wNew, hNew);
    ctx.drawImage(
      imgObj,
      0, 0, imgObj.naturalWidth, imgObj.naturalHeight,
      0, 0, wNew, hNew
    );
    setW(wNew);
    setH(hNew);
    updateCompressedPreview();
  }

  function rotateCanvas(direction) {
    if (!canvasRef.current) return;
    const src = canvasRef.current;
    const temp = cloneCanvas(src);
    const ctx = src.getContext("2d");
    const angle = direction === "left" ? -Math.PI / 2 : Math.PI / 2;
    const newW = temp.height;
    const newH = temp.width;
    src.width = newW;
    src.height = newH;
    ctx.save();
    ctx.translate(newW / 2, newH / 2);
    ctx.rotate(angle);
    ctx.drawImage(temp, -temp.width / 2, -temp.height / 2);
    ctx.restore();
    setW(newW);
    setH(newH);
    updateCompressedPreview();
  }

  function flipCanvas(mode) {
    if (!canvasRef.current) return;
    const src = canvasRef.current;
    const temp = cloneCanvas(src);
    const ctx = src.getContext("2d");
    const wNew = temp.width;
    const hNew = temp.height;
    src.width = wNew;
    src.height = hNew;
    ctx.save();
    ctx.translate(
      mode === "horizontal" ? wNew : 0,
      mode === "vertical" ? hNew : 0
    );
    ctx.scale(
      mode === "horizontal" ? -1 : 1,
      mode === "vertical" ? -1 : 1
    );
    ctx.drawImage(temp, 0, 0);
    ctx.restore();
    setW(wNew);
    setH(hNew);
    updateCompressedPreview();
  }

  /* ===================== FILTERS TAB (cinematic / warm / cool / retro) ===================== */

  function applyPresetFilter(preset) {
    if (!canvasRef.current || !imgObj) return;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    const d = imgData.data;
    const s = Math.max(0, Math.min(1, filterStrength));

    for (let i = 0; i < d.length; i += 4) {
      let r = d[i];
      let g = d[i + 1];
      let b = d[i + 2];

      const avg = (r + g + b) / 3;

      if (preset === "cinematic") {
        // teal shadows, warm highlights, slight contrast
        const contrast = 1 + 0.3 * s;
        r = (r - 128) * contrast + 128;
        g = (g - 128) * contrast + 128;
        b = (b - 128) * contrast + 128;

        // teal in shadows
        const shadowFactor = (255 - avg) / 255 * s;
        b += 25 * shadowFactor;
        g += 10 * shadowFactor;

        // warm highlights
        const highlightFactor = avg / 255 * s;
        r += 20 * highlightFactor;
      } else if (preset === "warm") {
        r += 25 * s;
        g += 10 * s;
        b -= 10 * s;
      } else if (preset === "cool") {
        r -= 10 * s;
        g += 5 * s;
        b += 25 * s;
      } else if (preset === "retro") {
        // slight fade + warm shift + low sat
        const fade = 1 - 0.15 * s;
        r *= fade;
        g *= fade;
        b *= fade;
        const gray = 0.3 * r + 0.59 * g + 0.11 * b;
        r = gray + (r - gray) * (1 - 0.3 * s);
        g = gray + (g - gray) * (1 - 0.3 * s);
        b = gray + (b - gray) * (1 - 0.5 * s);
        r += 15 * s;
        b -= 5 * s;
      }

      d[i] = Math.max(0, Math.min(255, r));
      d[i + 1] = Math.max(0, Math.min(255, g));
      d[i + 2] = Math.max(0, Math.min(255, b));
    }

    ctx.putImageData(imgData, 0, 0);
    updateCompressedPreview();
  }

  /* ===================== TEXT & WATERMARK TAB ===================== */

  function applyWatermark() {
    if (!canvasRef.current || !imgObj || !wmText) return;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");

    ctx.save();
    ctx.font = `${wmSize}px Inter, system-ui, sans-serif`;
    ctx.textBaseline = "bottom";

    const metrics = ctx.measureText(wmText);
    const textW = metrics.width;
    const textH = wmSize;

    let x = 0;
    let y = 0;
    const margin = 16;

    if (wmPosition === "top-left") {
      x = margin;
      y = margin + textH;
    } else if (wmPosition === "top-right") {
      x = c.width - textW - margin;
      y = margin + textH;
    } else if (wmPosition === "bottom-left") {
      x = margin;
      y = c.height - margin;
    } else if (wmPosition === "bottom-right") {
      x = c.width - textW - margin;
      y = c.height - margin;
    } else { // center
      x = (c.width - textW) / 2;
      y = (c.height + textH) / 2;
    }

    ctx.globalAlpha = Math.max(0, Math.min(1, wmOpacity));
    ctx.fillStyle = wmColor;
    ctx.shadowColor = "rgba(0,0,0,0.7)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillText(wmText, x, y);
    ctx.restore();

    updateCompressedPreview();
  }

  /* ===================== MAGIC BACKGROUND REMOVER ===================== */

  function estimateBackgroundFromImageData(imgData, width, height) {
    const d = imgData.data;
    if (!width || !height) return [255, 255, 255];

    const pts = [
      [0, 0],
      [width - 1, 0],
      [0, height - 1],
      [width - 1, height - 1],
      [Math.floor(width / 2), 0],
      [Math.floor(width / 2), height - 1],
      [0, Math.floor(height / 2)],
      [width - 1, Math.floor(height / 2)],
    ];

    let r = 0, g = 0, b = 0, n = 0;
    for (const [x, y] of pts) {
      const idx = (y * width + x) * 4;
      r += d[idx];
      g += d[idx + 1];
      b += d[idx + 2];
      n++;
    }
    if (!n) return [255, 255, 255];
    return [
      Math.round(r / n),
      Math.round(g / n),
      Math.round(b / n),
    ];
  }

  function applyMagicBackgroundRemoval() {
    if (!canvasRef.current || !imgObj) return;
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const width = c.width;
    const height = c.height;
    if (!width || !height) return;

    const imgData = ctx.getImageData(0, 0, width, height);
    const d = imgData.data;

    const [bgR, bgG, bgB] = estimateBackgroundFromImageData(imgData, width, height);
    setBgSamplePreview(`rgb(${bgR}, ${bgG}, ${bgB})`);

    const tol = Math.max(0, bgTolerance);
    const feather = Math.max(0, bgFeather);

    for (let i = 0; i < d.length; i += 4) {
      const r = d[i];
      const g = d[i + 1];
      const b = d[i + 2];
      const a = d[i + 3];

      const dr = r - bgR;
      const dg = g - bgG;
      const db = b - bgB;
      const dist = Math.sqrt(dr*dr + dg*dg + db*db);

      if (dist <= tol - feather) {
        // very close to background color → fully transparent
        d[i + 3] = 0;
      } else if (feather > 0 && dist < tol + feather) {
        // in soft edge zone → fade alpha
        const t = (dist - (tol - feather)) / (2 * feather); // 0..1
        const k = Math.max(0, Math.min(1, t));
        d[i + 3] = Math.round(a * k);
      } else {
        // far from background → keep alpha
      }
    }

    ctx.putImageData(imgData, 0, 0);
    updateCompressedPreview();
  }

  /* ---------- Effects ---------- */
  useEffect(() => { updateCompressedPreview(); }, [format, quality, imgObj]);
  useEffect(() => { ensureAiReady(); }, []);
  useEffect(() => {
    function onResize(){ /* responsive via CSS; overlay bitmap synced when drawing */ }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* ---------- UI ---------- */
  return (
    <div style={styles.page}>
      <style>{`
        .layout {
          display: grid;
          grid-template-columns: 300px minmax(680px, 900px) 300px;
          gap: 20px; align-items: start; justify-content: center;
          width: 100%; max-width: 1600px; margin: 0 auto; padding: 0 12px;
        }
        @media (max-width: 1200px) { .layout { grid-template-columns: 1fr minmax(640px,900px) 1fr; } }
        @media (max-width: 1000px) { .layout { grid-template-columns: minmax(320px,900px); } .rail-left,.rail-right{display:none;} }

        canvas.preview-canvas {
          max-width: 100%;
          display: block;
          margin: 0 auto;
          background: transparent;
        }
        .overlay { position:absolute; inset:0; pointer-events:auto; cursor:crosshair; }
        .tabs-bar {
          display:flex; gap:10px; justify-content:center; align-items:center;
          padding: 10px 12px; background:#121212; border-bottom:1px solid #2b2b2b;
          position: sticky; top: 0; z-index: 20;
        }
        .tabbtn {
          position: relative;
          padding:10px 14px; border-radius:10px;
          border:1px solid #2b2b2b; background:#151515; color:#bdbdbd;
          cursor:pointer; transition: all .15s ease;
          font-size: 13px;
        }
        .tabbtn:hover { border-color:#00b3ff; color:#a9e9ff; }
        .tabbtn.active {
          border-color:#00b3ff; color:#e9faff; background:#0f1b22;
        }
        .tabbtn.active::after {
          content:""; position:absolute; left:10px; right:10px; bottom:-9px; height:2px;
          background: linear-gradient(90deg,#00b3ff,#6ae3ff 50%,#00b3ff);
          border-radius: 2px;
        }
      `}</style>

      {/* HEADER */}
      <header style={styles.header}>
        <h1 style={{ margin: 0, textAlign: "center" }}>
          PhotoResizing — Free Online Image Resizer &amp; AI Upscaler &amp; more
        </h1>
        <p style={{ margin: "8px 0 0", color: "#9ca3af", textAlign: "center", fontSize: 14 }}>
          Resize, crop, enhance, filter, watermark and remove backgrounds in the browser.
        </p>

      {/* Simple anchor nav for content sections */}
        <nav style={{ marginTop: 12, fontSize: 13, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#how-to" style={navLink}>How it works</a>
          <a href="#features" style={navLink}>Features</a>
          <a href="#tips" style={navLink}>Tips</a>
          <a href="#faq" style={navLink}>FAQ</a>
          <a href="#about-owner" style={navLink}>About</a>
        </nav>
      </header>

      {/* TABS AT VERY TOP (sticky) */}
      <div className="tabs-bar">
        <button
          className={`tabbtn ${tab === "ai" ? "active" : ""}`}
          onClick={() => { setTab("ai"); setCropMode(false); setSel(null); overlayClear(); }}
        >
          AI Enhance
        </button>
        <button
          className={`tabbtn ${tab === "resize" ? "active" : ""}`}
          onClick={() => setTab("resize")}
        >
          Resize &amp; Crop
        </button>
        <button
          className={`tabbtn ${tab === "studio" ? "active" : ""}`}
          onClick={() => { setTab("studio"); setCropMode(false); setSel(null); overlayClear(); }}
        >
          Studio Tools
        </button>
        <button
          className={`tabbtn ${tab === "filters" ? "active" : ""}`}
          onClick={() => { setTab("filters"); setCropMode(false); setSel(null); overlayClear(); }}
        >
          Filters
        </button>
        <button
          className={`tabbtn ${tab === "text" ? "active" : ""}`}
          onClick={() => { setTab("text"); setCropMode(false); setSel(null); overlayClear(); }}
        >
          Text &amp; Watermark
        </button>
        <button
          className={`tabbtn ${tab === "bg" ? "active" : ""}`}
          onClick={() => { setTab("bg"); setCropMode(false); setSel(null); overlayClear(); }}
        >
          Background Remover
        </button>
      </div>

      {/* LAYOUT */}
      <main className="layout" style={styles.main}>
        {/* LEFT AD RAIL */}
        <aside className="rail-left sticky">
          {/* Rail_Left_responsive */}
          <AdSense slot="6685203163" />
          <div style={{ height: 16 }} />
        </aside>

        {/* CENTER COLUMN */}
        <div>
          {/* 1) UPLOAD */}
          <section
            className="card-hover"
            style={{
              ...styles.card,
              border: isDragging ? "1px solid #00b3ff" : styles.card.border,
              boxShadow: isDragging ? "0 0 0 2px rgba(0,179,255,0.35)" : styles.card.boxShadow
            }}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <h2 style={styles.h2}>1) Upload</h2>
            <div style={{ display: "grid", gap: 8, justifyItems: "center" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => { setFileName(e.target.files?.[0]?.name || ""); handleFile(e); }}
              />
              {fileName && <div style={{ fontSize: 12, color: "#a9e9ff" }}>Selected: {fileName}</div>}
              <div style={{ fontSize: 12, color: "#9ca3af" }}>or drag &amp; drop an image here</div>
            </div>
            {natW > 0 && (
              <p style={styles.muted}>
                Loaded: {natW} × {natH}px ({Math.round((natW * natH) / 1e6 * 10) / 10} MP)
              </p>
            )}
          </section>

          {/* TAB CONTENTS */}
          {tab === "ai" && (
            <section className="card-hover" style={styles.card}>
              <h2 style={styles.h2}>2) Enhance &amp; Upscale (AI)</h2>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <label className="pill">
                  Scale:
                  <select
                    style={{ ...styles.input, minWidth: 120, padding: "6px 10px" }}
                    value={upscaleFactor}
                    onChange={(e) => setUpscaleFactor(parseInt(e.target.value, 10))}
                    disabled={!imgObj || aiBusy}
                  >
                    <option value={2}>2× (Recommended)</option>
                    <option value={4}>4× (Beta)</option>
                  </select>
                </label>

                <label className="pill" style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <input
                    type="checkbox"
                    checked={faceEnhance}
                    onChange={(e)=>setFaceEnhance(e.target.checked)}
                    disabled={!imgObj || aiBusy}
                  />
                  Face Enhance (beta)
                </label>

                <label className="pill">
                  Detail: {detailBoost.toFixed(2)}
                  <input
                    type="range" min="0" max="1" step="0.01"
                    value={detailBoost}
                    onChange={(e)=>setDetailBoost(parseFloat(e.target.value))}
                    style={{ width:140 }}
                    disabled={!imgObj || aiBusy}
                  />
                </label>
                <label className="pill">
                  Micro-contrast: {microContrast.toFixed(2)}
                  <input
                    type="range" min="0" max="1" step="0.01"
                    value={microContrast}
                    onChange={(e)=>setMicroContrast(parseFloat(e.target.value))}
                    style={{ width:140 }}
                    disabled={!imgObj || aiBusy}
                  />
                </label>
                <label className="pill">
                  Denoise: {denoise.toFixed(2)}
                  <input
                    type="range" min="0" max="1" step="0.01"
                    value={denoise}
                    onChange={(e)=>setDenoise(parseFloat(e.target.value))}
                    style={{ width:140 }}
                    disabled={!imgObj || aiBusy}
                  />
                </label>
              </div>

              <div style={{ display: "grid", gap: 8, justifyItems: "center", marginTop: 12 }}>
                <button
                  className="btn-primary"
                  style={styles.btnPrimary}
                  disabled={!imgObj || aiBusy}
                  onClick={enhanceAndUpscaleOneClick}
                >
                  {aiBusy ? "Enhancing & Upscaling…" : "Enhance & Upscale (AI)"}
                </button>
                <div style={{
                  marginTop:6, padding:"8px 10px", borderRadius:8,
                  border:"1px solid " + (aiStatus.toLowerCase().includes("failed") ? "#ff7373" : "#2b2b2b"),
                  background: aiStatus.toLowerCase().includes("failed") ? "rgba(255,60,60,.08)" : "#141414",
                  color: aiStatus.toLowerCase().includes("failed") ? "#ffb3b3" : "#9ca3af",
                  fontSize:12
                }}>
                  {aiStatus || (aiReady ? "AI ready ✅" : "AI will auto-fallback if unavailable.")}
                </div>
              </div>
            </section>
          )}

          {tab === "resize" && (
            <>
              {/* 2) RESIZE */}
              <section className="card-hover" style={styles.card}>
                <h2 style={styles.h2}>2) Resize</h2>

                <div style={{ display: "grid", gap: 12, justifyItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                    <label style={styles.label}>
                      Width (px)
                      <input
                        style={styles.input}
                        type="number"
                        min="1"
                        value={w || ""}
                        onChange={(e) => onWidthChange(e.target.value)}
                        disabled={!imgObj}
                      />
                    </label>
                    <label style={styles.label}>
                      Height (px)
                      <input
                        style={styles.input}
                        type="number"
                        min="1"
                        value={h || ""}
                        onChange={(e) => onHeightChange(e.target.value)}
                        disabled={!imgObj}
                      />
                    </label>
                    <label style={{ ...styles.label, alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={lockAspect}
                        onChange={(e) => setLockAspect(e.target.checked)}
                        disabled={!imgObj}
                      />
                      Lock aspect ratio
                    </label>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                    {[25, 50, 75, 100, 150, 200, 400].map((p) => (
                      <button
                        key={p}
                        className="btn"
                        style={btn}
                        disabled={!imgObj}
                        onClick={() => {
                          if (!natW || !natH) return;
                          const s = p / 100;
                          const newW = Math.max(1, Math.round(natW * s));
                          const newH = Math.max(1, Math.round(natH * s));
                          setW(newW);
                          setH(lockAspect ? Math.round(newW / (natW / natH)) : newH);
                        }}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* 3) CROP */}
              <section className="card-hover" style={styles.card}>
                <h2 style={styles.h2}>3) Crop</h2>

                <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => {
                      setCropMode((v) => !v);
                      if (!cropMode) setSel(null);
                    }}
                    title="Click & drag on the image to crop (release anywhere)."
                  >
                    {cropMode ? "Disable Crop" : "Enable Crop"}
                  </button>

                  <button className="btn" style={btn} disabled={!imgObj || !sel} onClick={clearCrop}>
                    Clear Selection
                  </button>
                </div>

                <p style={styles.muted}>
                  Tip: When Crop is ON, click &amp; drag over the image. The crop applies automatically when you
                  release (even outside the canvas). Selection respects image bounds.
                </p>
              </section>
            </>
          )}

          {tab === "studio" && (
            <section className="card-hover" style={styles.card}>
              <h2 style={styles.h2}>2) Studio Tools — Quick Edits</h2>

              {/* PRESETS */}
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, margin: "0 0 8px" }}>Popular Presets</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => applyPresetSize(1920, 1080)}
                  >
                    1920×1080 (YouTube / Screen)
                  </button>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => applyPresetSize(1280, 720)}
                  >
                    1280×720 (HD Thumbnail)
                  </button>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => applyPresetSize(1080, 1080)}
                  >
                    1080×1080 (Square / Insta)
                  </button>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => applyPresetSize(512, 512)}
                  >
                    512×512 (Icon / Sprite)
                  </button>
                </div>
              </div>

              {/* ROTATE / FLIP */}
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, margin: "0 0 8px" }}>Rotate &amp; Flip</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => rotateCanvas("left")}
                  >
                    ⟲ Rotate 90° Left
                  </button>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => rotateCanvas("right")}
                  >
                    ⟳ Rotate 90° Right
                  </button>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => flipCanvas("horizontal")}
                  >
                    ⇋ Flip Horizontal
                  </button>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => flipCanvas("vertical")}
                  >
                    ⇅ Flip Vertical
                  </button>
                </div>
              </div>

              <p style={styles.muted}>
                Use Studio for fast layout changes. For color and mood, switch to the Filters tab.
              </p>
            </section>
          )}

          {tab === "filters" && (
            <section className="card-hover" style={styles.card}>
              <h2 style={styles.h2}>2) Filters &amp; Looks</h2>
              <p style={styles.muted}>
                Choose a look and adjust the strength. Filters stack on top of the current image. You can always reset
                from the Preview section to go back to the original upload.
              </p>

              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, margin: "0 0 8px" }}>Filter Strength</h3>
                <label style={styles.label}>
                  Strength: {filterStrength.toFixed(2)}
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={filterStrength}
                    onChange={(e) => setFilterStrength(parseFloat(e.target.value))}
                    disabled={!imgObj}
                  />
                </label>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, margin: "0 0 8px" }}>Filter Presets</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => applyPresetFilter("cinematic")}
                  >
                    Cinematic (teal &amp; orange)
                  </button>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => applyPresetFilter("warm")}
                  >
                    Warm sunset
                  </button>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => applyPresetFilter("cool")}
                  >
                    Cool blue
                  </button>
                  <button
                    className="btn"
                    style={btn}
                    disabled={!imgObj}
                    onClick={() => applyPresetFilter("retro")}
                  >
                    Retro / faded
                  </button>
                </div>
              </div>
            </section>
          )}

          {tab === "text" && (
            <section className="card-hover" style={styles.card}>
              <h2 style={styles.h2}>2) Text &amp; Watermark</h2>

              <div style={{ display: "grid", gap: 12 }}>
                <label style={styles.label}>
                  Watermark text
                  <input
                    style={styles.input}
                    type="text"
                    value={wmText}
                    onChange={(e) => setWmText(e.target.value)}
                    placeholder="Your brand / channel / website"
                    disabled={!imgObj}
                  />
                </label>

                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                  <label style={styles.label}>
                    Size: {wmSize}px
                    <input
                      type="range"
                      min="10"
                      max="96"
                      step="1"
                      value={wmSize}
                      onChange={(e) => setWmSize(parseInt(e.target.value, 10))}
                      disabled={!imgObj}
                    />
                  </label>

                  <label style={styles.label}>
                    Opacity: {wmOpacity.toFixed(2)}
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={wmOpacity}
                      onChange={(e) => setWmOpacity(parseFloat(e.target.value))}
                      disabled={!imgObj}
                    />
                  </label>

                  <label style={styles.label}>
                    Color
                    <input
                      type="color"
                      value={wmColor}
                      onChange={(e) => setWmColor(e.target.value)}
                      disabled={!imgObj}
                      style={{ width: 60, height: 32, padding: 0, borderRadius: 8, border: "1px solid #2b2b2b" }}
                    />
                  </label>
                </div>

                <div>
                  <h3 style={{ fontSize: 15, margin: "0 0 8px", textAlign: "center" }}>Position</h3>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                    {[
                      ["top-left", "Top left"],
                      ["top-right", "Top right"],
                      ["center", "Center"],
                      ["bottom-left", "Bottom left"],
                      ["bottom-right", "Bottom right"],
                    ].map(([value, labelText]) => (
                      <button
                        key={value}
                        className="btn"
                        style={{
                          ...btn,
                          borderColor: wmPosition === value ? "#00b3ff" : btn.border,
                          background: wmPosition === value ? "#0f1b22" : btn.background,
                        }}
                        disabled={!imgObj}
                        onClick={() => setWmPosition(value)}
                      >
                        {labelText}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <button
                    className="btn-primary"
                    style={styles.btnPrimary}
                    disabled={!imgObj || !wmText}
                    onClick={applyWatermark}
                  >
                    Apply text / watermark
                  </button>
                  <p style={styles.muted}>
                    Tip: Use a light color with low opacity in a corner for a clean, professional watermark.
                  </p>
                </div>
              </div>
            </section>
          )}

          {tab === "bg" && (
            <section className="card-hover" style={styles.card}>
              <h2 style={styles.h2}>2) Magic Background Remover</h2>
              <p style={styles.muted}>
                This tool automatically samples the background color from the edges of your image and
                makes similar pixels transparent. Works best if the background is fairly solid
                (for example white, green or a simple gradient).
              </p>

              <div style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                  <label style={styles.label}>
                    Tolerance: {bgTolerance}
                    <input
                      type="range"
                      min="10"
                      max="140"
                      step="2"
                      value={bgTolerance}
                      onChange={(e) => setBgTolerance(parseInt(e.target.value, 10))}
                      disabled={!imgObj}
                    />
                  </label>

                  <label style={styles.label}>
                    Feather: {bgFeather}
                    <input
                      type="range"
                      min="0"
                      max="60"
                      step="2"
                      value={bgFeather}
                      onChange={(e) => setBgFeather(parseInt(e.target.value, 10))}
                      disabled={!imgObj}
                    />
                  </label>
                </div>

                {bgSamplePreview && (
                  <div style={{ textAlign: "center", fontSize: 12, color: "#9ca3af" }}>
                    Detected background color:{" "}
                    <span
                      style={{
                        display: "inline-block",
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: "1px solid #2b2b2b",
                        verticalAlign: "middle",
                        background: bgSamplePreview,
                        marginLeft: 6,
                      }}
                    />
                    <span style={{ marginLeft: 6 }}>{bgSamplePreview}</span>
                  </div>
                )}

                <div style={{ textAlign: "center", marginTop: 8 }}>
                  <button
                    className="btn-primary"
                    style={styles.btnPrimary}
                    disabled={!imgObj}
                    onClick={applyMagicBackgroundRemoval}
                  >
                    Remove background (make it transparent)
                  </button>
                  <p style={styles.muted}>
                    Best used with PNG format in the Download step, so the transparent background is preserved.
                  </p>
                </div>
              </div>
            </section>
          )}

          <PreviewSection
            canvasRef={canvasRef}
            overlayRef={overlayRef}
            showOverlay={tab === "resize" && imgObj && cropMode}
            onReset={resetOriginal}
            canReset={!!imgObj}
          />

          <DownloadSection
            format={format} setFormat={setFormat}
            quality={quality} setQuality={setQuality}
            imgObj={imgObj}
            compressedURL={compressedURL} compressedSize={compressedSize}
            onDownload={download}
          />

          {/* NEW: long-form content sections for AdSense */}
          <ContentSections />
        </div>

        {/* RIGHT AD RAIL */}
        <aside className="rail-right sticky">
          {/* Rail_Right_responsive */}
          <AdSense slot="4400168213" />
          <div style={{ height: 16 }} />
        </aside>
      </main>

      <footer style={styles.footer}>
        <div>
          © {new Date().getFullYear()} PhotoResizing — Free online image tools. Respectful, no spam.
        </div>
        <div style={{ marginTop: 4 }}>
          <a
            href="#privacy-policy"
            style={{ color: "#a9e9ff", textDecoration: "none" }}
          >
            Privacy Policy
          </a>
        </div>
      </footer>

      {/* Overlay events mount only when needed */}
      {tab === "resize" && imgObj && cropMode && (
        <OverlayEvents overlayRef={overlayRef} onPointerDown={onOverlayPointerDown}/>
      )}
    </div>
  );

  function OverlayEvents({ overlayRef, onPointerDown }) {
    useEffect(() => {
      const el = overlayRef.current;
      if (!el) return;
      const down = (e) => onPointerDown(e);
      el.addEventListener("pointerdown", down);
      return () => el.removeEventListener("pointerdown", down);
      // eslint-disable-next-line
    }, [overlayRef, cropMode, sel, imgObj]);
    return null;
  }
}

/* ---------- styles ---------- */
const styles = {
  page: {
    fontFamily: "Inter, Segoe UI, Roboto, sans-serif",
    background: "#0e0e0e",
    color: "#f5f5f5",
    minHeight: "100vh",
  },
  header: {
    padding: "20px 16px",
    borderBottom: "1px solid #2b2b2b",
    textAlign: "center",
    background: "#111",
    boxShadow: "0 2px 10px rgba(0,0,0,.5)",
  },
  main: { maxWidth: "100%", margin: "0 auto", padding: "16px 12px" },
  card: {
    border: "1px solid #2b2b2b",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    background: "#1a1a1a",
    boxShadow: "0 2px 10px rgba(0,0,0,.5)",
  },
  h2: { margin: 0, marginBottom: 12, fontSize: 20, color: "#f5f5f5" },
  controls: { display: "grid", gap: 12, alignItems: "center", justifyItems: "center" },
  label: { display: "flex", flexDirection: "column", fontSize: 14, gap: 6, alignItems: "center" },
  input: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #2b2b2b",
    background: "#111",
    color: "#f5f5f5",
    minWidth: 180,
  },
  btnPrimary: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    background: "#00b3ff",
    color: "#0e0e0e",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all .2s ease-in-out",
    minWidth: 240,
  },
  muted: { fontSize: 12, color: "#9ca3af", marginTop: 8, textAlign: "left" },
  footer: {
    borderTop: "1px solid #2b2b2b",
    marginTop: 24,
    padding: "16px",
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 12,
    background: "#111",
  },
};

const btn = {
  padding: "8px 12px",
  borderRadius: 8,
  border: "1px solid #00b3ff",
  background: "transparent",
  color: "#00b3ff",
  cursor: "pointer",
  transition: "all .2s ease-in-out",
};

const adStyles = {
  slot: {
    border: "1px dashed #2b2b2b",
    borderRadius: 12,
    background: "linear-gradient(180deg, rgba(0,179,255,0.08), rgba(0,0,0,0))",
    padding: 8,
    minHeight: 250,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "inset 0 0 0 1px rgba(0,179,255,0.1)",
  },
  inner: { textAlign: "center", color: "#9ca3af", display: "grid", gap: 6 },
  badge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 999,
    background: "rgba(0,179,255,0.15)",
    color: "#a9e9ff",
    fontSize: 12,
  },
  size: { fontSize: 13, opacity: 0.9 },
};

const overlayCSS = {
  width: "100%",
  height: "100%",
  imageRendering: "pixelated",
  pointerEvents: "auto",
  cursor: "crosshair",
};

const navLink = {
  color: "#a9e9ff",
  textDecoration: "none",
  padding: "4px 8px",
  borderRadius: 999,
  border: "1px solid transparent",
};
const faqTitle = { fontSize: 15, margin: "10px 0 4px" };
const faqText = { fontSize: 14, lineHeight: 1.7 };
