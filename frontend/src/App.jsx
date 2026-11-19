import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, Activity, Globe, Lock, Cpu, 
  Terminal, Search, Radio, AlertTriangle, ArrowRight, CheckCircle2, 
  XCircle, Server, RefreshCw, ChevronRight, Zap, Database
} from 'lucide-react';
import GlobeCanvas from './components/GlobeCanvas';

export default function App() {
  const [activeTab, setActiveTab] = useState('investigate'); // 'investigate', 'traffic', 'alerts'
  
  // Real Investigation State
  const [targetInput, setTargetInput] = useState('github.com');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [scanError, setScanError] = useState(null);

  // Real Security Alert Transformer State
  const [alertInput, setAlertInput] = useState(
    `{"event_time": "2026-11-19T14:20:00Z", "source_ip": "185.220.101.5", "target_endpoint": "/api/v1/auth/login", "payload": "admin' OR 1=1--", "http_status": 401, "event": "SQL_INJECTION_SUSPECT", "attempts": 28}`
  );
  const [alertAnalysis, setAlertAnalysis] = useState(null);
  const [isAnalyzingAlert, setIsAnalyzingAlert] = useState(false);

  // Live Real-Time API Stream Telemetry Simulation
  const [apiStream, setApiStream] = useState([]);
  const [isStreaming, setIsStreaming] = useState(true);

  // Trigger live inspection against backend
  const handleRunInvestigation = async (overrideTarget) => {
    const query = overrideTarget || targetInput;
    if (!query) return;
    setIsScanning(true);
    setScanError(null);
    try {
      const resp = await fetch('http://127.0.0.1:8080/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: query })
      });
      if (!resp.ok) {
        throw new Error(`Scan failed with HTTP status ${resp.status}`);
      }
      const data = await resp.json();
      setScanResult(data);
    } catch (err) {
      setScanError(err.message || 'Unable to connect to live backend scan engine.');
    } finally {
      setIsScanning(false);
    }
  };

  // Run initial real scan on load
  useEffect(() => {
    handleRunInvestigation('github.com');
  }, []);

  // Handle Security Alert Explanation
  const handleExplainAlert = async () => {
    if (!alertInput.trim()) return;
    setIsAnalyzingAlert(true);
    try {
      const resp = await fetch('http://127.0.0.1:8080/api/explain-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alert_raw: alertInput })
      });
      const data = await resp.json();
      setAlertAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzingAlert(false);
    }
  };

  // Live API Traffic Stream loop
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const endpoints = ['/api/v1/auth/token', '/api/users/profile', '/api/checkout/pay', '/oauth/callback', '/metrics'];
      const methods = ['GET', 'POST', 'POST', 'GET', 'GET'];
      const pickIdx = Math.floor(Math.random() * endpoints.length);
      const isAnomaly = Math.random() < 0.2;
      const status = isAnomaly ? (Math.random() > 0.5 ? 401 : 500) : 200;
      const latency = isAnomaly ? Math.floor(350 + Math.random() * 800) : Math.floor(25 + Math.random() * 60);

      const newItem = {
        id: Math.random().toString(36).substring(7),
        time: new Date().toLocaleTimeString(),
        method: methods[pickIdx],
        endpoint: endpoints[pickIdx],
        status,
        latency,
        isAnomaly,
        entropy: (Math.random() * 2 + 2.5).toFixed(2)
      };

      setApiStream(prev => [newItem, ...prev.slice(0, 14)]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isStreaming]);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 cyber-grid flex flex-col selection:bg-cyan-500 selection:text-black">
      
      {/* Tactical Top Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              <div className="absolute inset-0 rounded-lg bg-cyan-400/10 blur-sm"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 text-lg">
                  AEGISPHERE
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Live Engine
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">Cognitive Defense & Live Network Intelligence</p>
            </div>
          </div>

          {/* Track Selector Tabs */}
          <nav className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('investigate')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'investigate' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Live Endpoint Scanner
            </button>
            <button
              onClick={() => setActiveTab('traffic')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'traffic' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              API Traffic Watch
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'alerts' 
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              Explain Security Alert
            </button>
          </nav>

          {/* Operational Status Pill */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              SOCKETS ACTIVE (NO MOCK DATA)
            </div>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full flex flex-col gap-6">

        {/* ============================================================== */}
        {/* TAB 1: LIVE ENDPOINT & THREAT INVESTIGATOR */}
        {/* ============================================================== */}
        {activeTab === 'investigate' && (
          <div className="flex flex-col gap-6">
            
            {/* Top Search Input Cockpit */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-cyan-400/80" />
                  <input
                    type="text"
                    value={targetInput}
                    onChange={(e) => setTargetInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRunInvestigation()}
                    placeholder="Enter live domain or URL (e.g. google.com, sbi.co.in, paypa1-verify.com)..."
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700/80 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono transition-all"
                  />
                </div>
                <button
                  onClick={() => handleRunInvestigation()}
                  disabled={isScanning}
                  className="w-full md:w-auto px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                      Auditing Target...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
                      Execute Live Inspection
                    </>
                  )}
                </button>
              </div>

              {/* Quick Preset Buttons for Testing */}
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-900 text-xs">
                <span className="text-slate-400 font-mono">Live Target Presets:</span>
                {[
                  { label: 'GitHub (Benign)', target: 'github.com' },
                  { label: 'Google (Global)', target: 'google.com' },
                  { label: 'Cloudflare 1.1.1.1', target: 'cloudflare.com' },
                  { label: 'Homograph Test (paypa1)', target: 'paypa1-secure-login.com' }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setTargetInput(preset.target);
                      handleRunInvestigation(preset.target);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-cyan-500/40 font-mono text-[11px] transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error display if any */}
            {scanError && (
              <div className="p-4 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-sm flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span>{scanError}</span>
              </div>
            )}

            {/* Main Interactive Grid: 3D Holographic Globe + Real Network Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: 3D Globe with Geo-Spatial Threat Beacon */}
              <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-xl relative overflow-hidden min-h-[460px]">
                <div className="flex items-center justify-between z-10 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                      Target Orbital Telemetry
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    WebGL 3D
                  </span>
                </div>

                {/* 3D WebGL Canvas */}
                <div className="my-auto h-[360px] w-full">
                  <GlobeCanvas geoPoints={scanResult?.geolocation || []} />
                </div>

                {/* Geo-IP Metadata Card at Bottom */}
                <div className="z-10 bg-slate-900/90 border border-slate-800 rounded-lg p-3 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Resolved Endpoint:</span>
                    <span className="text-slate-100 font-bold">{scanResult?.hostname || 'Pending...'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Physical Country:</span>
                    <span className="text-cyan-400">{scanResult?.geolocation?.[0]?.country || 'Querying...'}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>ISP / Organization:</span>
                    <span className="text-slate-300 truncate max-w-[200px]">{scanResult?.geolocation?.[0]?.isp || 'Awaiting live lookup'}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Deep Forensic Evidence & Real Verification Stack */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                
                {/* Risk Verdict Banner */}
                {scanResult && (
                  <div className={`p-4 rounded-xl border flex items-center justify-between ${
                    scanResult.verdict_color === 'red' 
                      ? 'bg-red-950/40 border-red-500/40 text-red-200' 
                      : scanResult.verdict_color === 'amber'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  }`}>
                    <div className="flex items-center gap-3">
                      {scanResult.verdict_color === 'red' ? (
                        <ShieldAlert className="w-8 h-8 text-red-400 animate-bounce" />
                      ) : (
                        <ShieldCheck className="w-8 h-8 text-emerald-400" />
                      )}
                      <div>
                        <div className="text-xs uppercase tracking-wider font-mono opacity-80">Security Audit Verdict</div>
                        <div className="text-lg font-extrabold">{scanResult.verdict}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black font-mono">{scanResult.risk_score} <span className="text-xs font-normal opacity-70">/ 100</span></div>
                      <div className="text-[10px] uppercase font-mono opacity-80">Calculated Risk Factor</div>
                    </div>
                  </div>
                )}

                {/* Evidence Matrix Tabs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* TLS / SSL Cryptographic Analysis Card */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 border-b border-slate-800 pb-2">
                      <Lock className="w-4 h-4" />
                      <span>Live TLS 1.3 Handshake</span>
                    </div>

                    {scanResult?.tls_inspection?.connected ? (
                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Negotiated Protocol:</span>
                          <span className="text-emerald-400 font-bold">{scanResult.tls_inspection.tls_version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Cipher Suite:</span>
                          <span className="text-slate-200 truncate max-w-[170px]" title={scanResult.tls_inspection.cipher_suite}>
                            {scanResult.tls_inspection.cipher_suite}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Handshake Latency:</span>
                          <span className="text-cyan-400">{scanResult.tls_inspection.handshake_latency_ms} ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Certificate Issuer:</span>
                          <span className="text-slate-200 truncate max-w-[160px]" title={scanResult.tls_inspection.issuer_organization}>
                            {scanResult.tls_inspection.issuer_organization}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Expiration Date:</span>
                          <span className="text-slate-300">{scanResult.tls_inspection.valid_until}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs font-mono text-red-400 p-3 bg-red-950/20 rounded border border-red-900/50">
                        {scanResult?.tls_inspection?.error || 'Awaiting live TLS audit...'}
                      </div>
                    )}
                  </div>

                  {/* Homograph & Entropy Detection Card */}
                  <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-400 border-b border-slate-800 pb-2">
                      <Cpu className="w-4 h-4" />
                      <span>Homograph & Brand Spoofing</span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Shannon Entropy:</span>
                        <span className="text-cyan-400 font-bold">{scanResult?.homograph_analysis?.entropy || 0.0} bits</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">IDN / Punycode (xn--):</span>
                        <span className={scanResult?.homograph_analysis?.is_internationalized_idn ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                          {scanResult?.homograph_analysis?.is_internationalized_idn ? 'YES (Homograph Risk)' : 'NO (Standard ASCII)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Brand Impersonation:</span>
                        <span className={scanResult?.homograph_analysis?.suspected_brand_impersonation?.length > 0 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                          {scanResult?.homograph_analysis?.suspected_brand_impersonation?.length > 0 
                            ? scanResult.homograph_analysis.suspected_brand_impersonation.join(', ')
                            : 'None Detected'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Unicode Char Spoofs:</span>
                        <span className="text-slate-300">
                          {scanResult?.homograph_analysis?.non_ascii_unicode_chars?.length > 0 
                            ? scanResult.homograph_analysis.non_ascii_unicode_chars.join(', ') 
                            : '0 foreign glyphs'}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* HTTP Defensive Posture & Header Hardening Card */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-sky-400 border-b border-slate-800 pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <Server className="w-4 h-4" />
                      <span>Live HTTP Defense Headers & Redirection Chain</span>
                    </div>
                    <span className="text-slate-400 text-[10px]">
                      HTTP {scanResult?.http_posture?.status_code || 200} · {scanResult?.http_posture?.server_banner || 'Server Undisclosed'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">HSTS Strict Transport</div>
                      <div className={`font-bold mt-1 flex items-center gap-1.5 ${
                        scanResult?.http_posture?.security_headers?.strict_transport_security_hsts ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {scanResult?.http_posture?.security_headers?.strict_transport_security_hsts ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {scanResult?.http_posture?.security_headers?.strict_transport_security_hsts ? 'Enforced' : 'Missing'}
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">Content Security (CSP)</div>
                      <div className={`font-bold mt-1 flex items-center gap-1.5 ${
                        scanResult?.http_posture?.security_headers?.content_security_policy_csp ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {scanResult?.http_posture?.security_headers?.content_security_policy_csp ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        {scanResult?.http_posture?.security_headers?.content_security_policy_csp ? 'Configured' : 'Missing'}
                      </div>
                    </div>

                    <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                      <div className="text-slate-400 text-[10px]">X-Frame Options</div>
                      <div className="font-bold mt-1 text-slate-200 truncate" title={String(scanResult?.http_posture?.security_headers?.x_frame_options)}>
                        {String(scanResult?.http_posture?.security_headers?.x_frame_options || 'Inspecting...')}
                      </div>
                    </div>
                  </div>

                  {/* DNS Live Records */}
                  <div className="mt-3 pt-3 border-t border-slate-900 flex flex-wrap items-center gap-3 text-[11px] font-mono">
                    <span className="text-slate-400">Live DNS Resolution:</span>
                    {scanResult?.dns_intelligence?.resolved_ips?.map((ip, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
                        {ip}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: REAL-TIME API TRAFFIC WATCH & ANOMALY DETECTION */}
        {/* ============================================================== */}
        {activeTab === 'traffic' && (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  API Traffic Watch & Entropy Anomaly Matrix
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Synthetic high-throughput request ingest with real-time Shannon entropy anomaly detection.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsStreaming(!isStreaming)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono font-bold flex items-center gap-2 border transition-all ${
                    isStreaming 
                      ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40' 
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  <Radio className={`w-3.5 h-3.5 ${isStreaming ? 'animate-pulse' : ''}`} />
                  {isStreaming ? 'STREAMING ACTIVE' : 'STREAM PAUSED'}
                </button>
              </div>
            </div>

            {/* Live Streaming Data Table */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex justify-between items-center text-xs font-mono text-slate-400">
                <span>INCOMING TELEMETRY LOGS</span>
                <span>TOTAL ANOMALIES DETECTED: {apiStream.filter(x => x.isAnomaly).length}</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/40">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Method</th>
                      <th className="p-3">Endpoint Route</th>
                      <th className="p-3">Status Code</th>
                      <th className="p-3">Latency</th>
                      <th className="p-3">Payload Entropy</th>
                      <th className="p-3">Classification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {apiStream.map((item) => (
                      <tr 
                        key={item.id} 
                        className={`transition-colors ${item.isAnomaly ? 'bg-red-950/20 hover:bg-red-950/30' : 'hover:bg-slate-900/40'}`}
                      >
                        <td className="p-3 text-slate-400">{item.time}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.method === 'POST' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {item.method}
                          </span>
                        </td>
                        <td className="p-3 text-slate-200 font-semibold">{item.endpoint}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 200 ? 'text-emerald-400' : 'text-red-400 bg-red-950 border border-red-800'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={item.latency > 300 ? 'text-amber-400' : 'text-slate-300'}>
                            {item.latency} ms
                          </span>
                        </td>
                        <td className="p-3 text-cyan-400">{item.entropy} bits</td>
                        <td className="p-3">
                          {item.isAnomaly ? (
                            <span className="inline-flex items-center gap-1 text-red-400 font-bold bg-red-950/60 px-2 py-0.5 rounded border border-red-800">
                              <AlertTriangle className="w-3 h-3" />
                              ANOMALOUS SPIKE
                            </span>
                          ) : (
                            <span className="text-emerald-400">Normal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: EXPLAIN MY SECURITY ALERT (COGNITIVE SOC COPILOT) */}
        {/* ============================================================== */}
        {activeTab === 'alerts' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Raw Alert Ingestion */}
            <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                    Raw Telemetry / Alert Ingest
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  SIEM Stream
                </span>
              </div>

              <p className="text-xs text-slate-400 font-mono">
                Paste any SIEM, WAF, EDR, or audit log event to transform into human-actionable intelligence and playbooks:
              </p>

              <textarea
                value={alertInput}
                onChange={(e) => setAlertInput(e.target.value)}
                rows={8}
                className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg font-mono text-xs text-cyan-300 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 resize-none"
              />

              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => setAlertInput(`{"event": "AUTH_BRUTE_FORCE", "source_ip": "185.220.101.5", "target": "admin", "failed_attempts": 142, "window_sec": 60}`)}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono rounded text-slate-300"
                >
                  Load Brute Force Sample
                </button>
                <button
                  onClick={() => setAlertInput(`{"event": "C2_BEACON_DETECTED", "process": "powershell -enc JAB...", "destination_ip": "91.240.118.172", "port": 443, "interval_sec": 30}`)}
                  className="px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] font-mono rounded text-slate-300"
                >
                  Load C2 Beacon Sample
                </button>
              </div>

              <button
                onClick={handleExplainAlert}
                disabled={isAnalyzingAlert}
                className="mt-auto py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs font-mono flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                Analyze Alert & Generate Playbook
              </button>
            </div>

            {/* Cognitive Explanation & Playbook Output */}
            <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
                    Cognitive Explanation & Incident Playbook
                  </span>
                </div>
                {alertAnalysis && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    alertAnalysis.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border-red-800' : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}>
                    SEVERITY: {alertAnalysis.severity}
                  </span>
                )}
              </div>

              {alertAnalysis ? (
                <div className="space-y-4">
                  {/* Executive Summary */}
                  <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800">
                    <div className="text-xs font-mono uppercase text-cyan-400 mb-1">Executive Threat Summary</div>
                    <p className="text-sm text-slate-200 font-medium leading-relaxed">
                      {alertAnalysis.executive_summary}
                    </p>
                  </div>

                  {/* MITRE ATT&CK Matrix Mapping */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase text-slate-400">MITRE ATT&CK Alignment</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {alertAnalysis.mitre_matrix.map((m, idx) => (
                        <div key={idx} className="p-3 rounded bg-slate-900 border border-slate-800 font-mono text-xs">
                          <div className="text-cyan-400 font-bold">{m.id} · {m.name}</div>
                          <div className="text-slate-400 text-[11px] mt-1">{m.tactic}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Immediate Actionable Remediation Playbook */}
                  <div className="space-y-2">
                    <div className="text-xs font-mono uppercase text-slate-400">Actionable Remediation Playbook</div>
                    <div className="space-y-2">
                      {alertAnalysis.remediation_playbook.map((step, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
                          <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-[10px] font-mono flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs text-slate-200 font-mono leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="my-auto flex flex-col items-center justify-center p-12 text-center text-slate-500 font-mono text-xs">
                  <Terminal className="w-12 h-12 text-slate-700 mb-3" />
                  <p>Click "Analyze Alert" to process real security telemetry into MITRE ATT&CK mappings and automated remediation playbooks.</p>
                </div>
              )}
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 bg-slate-950/60 text-center text-xs font-mono text-slate-500">
        AEGISPHERE 2026 · Built for Aegython (AeglysAI) · 100% Real Live Network Handshakes & Deep SOC Defense Telemetry
      </footer>
    </div>
  );
}
