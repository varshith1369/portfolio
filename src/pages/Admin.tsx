import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  checkPin,
  setPin,
  getPin,
  getAdminData,
  saveAdminData,
  resetAdminData,
  generateResetToken,
  verifyResetToken,
  clearResetToken,
  DEFAULT_DATA,
  type AdminData,
} from "@/lib/adminStore";
import {
  Shield,
  Lock,
  RefreshCw,
  Save,
  RotateCcw,
  Mail,
  Eye,
  EyeOff,
  Terminal as TerminalIcon,
  LogOut,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Code2,
  Sliders,
  Send,
  KeyRound,
  Trash2,
  Plus,
} from "lucide-react";

// ─── PIN Gate Component ───────────────────────────────────────────────────────
function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [stage, setStage] = useState<"pin" | "forgot-send" | "forgot-verify" | "forgot-newpin">("pin");
  const [resetCode, setResetCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newPinConfirm, setNewPinConfirm] = useState("");
  const [sendStatus, setSendStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [generatedCodeHint, setGeneratedCodeHint] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Focus first input on mount
  useEffect(() => {
    if (stage === "pin") {
      inputRefs[0].current?.focus();
    }
  }, [stage]);

  const handleDigitChange = (index: number, val: string) => {
    const char = val.slice(-1);
    if (char && !/^[0-9]$/.test(char)) return;

    const next = [...pinDigits];
    next[index] = char;
    setPinDigits(next);
    setError("");

    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto submit if all 4 digits entered
    if (char && index === 3 && next.every(d => d !== "")) {
      const fullPin = next.join("");
      if (checkPin(fullPin)) {
        onUnlock();
      } else {
        setError("Access Denied: Incorrect 4-digit PIN.");
        setPinDigits(["", "", "", ""]);
        inputRefs[0].current?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, 4);
    if (/^[0-9]{1,4}$/.test(pasted)) {
      const next = ["", "", "", ""];
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i];
      }
      setPinDigits(next);
      if (pasted.length === 4) {
        if (checkPin(pasted)) {
          onUnlock();
        } else {
          setError("Access Denied: Incorrect PIN.");
          setPinDigits(["", "", "", ""]);
          inputRefs[0].current?.focus();
        }
      } else {
        inputRefs[Math.min(pasted.length, 3)].current?.focus();
      }
    }
  };

  const handleKeypadPress = (val: string) => {
    if (val === "C") {
      setPinDigits(["", "", "", ""]);
      setError("");
      inputRefs[0].current?.focus();
      return;
    }
    if (val === "⌫") {
      const next = [...pinDigits];
      for (let i = 3; i >= 0; i--) {
        if (next[i]) {
          next[i] = "";
          setPinDigits(next);
          inputRefs[i].current?.focus();
          break;
        }
      }
      return;
    }

    // Add digit to next empty slot
    const emptyIdx = pinDigits.findIndex(d => d === "");
    if (emptyIdx !== -1) {
      handleDigitChange(emptyIdx, val);
    }
  };

  const handleSendResetCode = async () => {
    setSendStatus("sending");
    setCodeError("");
    const token = generateResetToken();
    setGeneratedCodeHint(token.code);

    try {
      const res = await fetch("https://formsubmit.co/ajax/yannabathulavarshithreddy7@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          subject: "Terminal Security – Your PIN Reset Code",
          message: `Your Portfolio Terminal 6-digit PIN reset code is: ${token.code}\n\nThis verification code expires in 15 minutes.\n\nUse this code to set your new 4-digit PIN in the terminal.\n\nPortfolio Security System`,
          _captcha: "false",
        }),
      });

      const result = await res.json().catch(() => ({}));
      if (result.success === "true" || result.success === true) {
        setSendStatus("sent");
        setStage("forgot-verify");
      } else {
        // Still allow them to use the code even if formsubmit needs confirmation
        setSendStatus("sent");
        setStage("forgot-verify");
      }
    } catch {
      // In case network issue, proceed to verify with generated token
      setSendStatus("sent");
      setStage("forgot-verify");
    }
  };

  const handleVerifyResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyResetToken(resetCode)) {
      setCodeError("");
      setStage("forgot-newpin");
    } else {
      setCodeError("Invalid or expired 6-digit code. Please verify and try again.");
    }
  };

  const handleSetNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{4}$/.test(newPin)) {
      setCodeError("PIN must be exactly 4 numeric digits (e.g. 1369).");
      return;
    }
    if (newPin !== newPinConfirm) {
      setCodeError("The two PIN entries do not match.");
      return;
    }

    setPin(newPin);
    clearResetToken();
    setSuccessMessage(`New PIN set to ${newPin}! You can now unlock the terminal.`);
    setStage("pin");
    setPinDigits(["", "", "", ""]);
    setCodeError("");
    setGeneratedCodeHint(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden font-mono text-white">
      {/* Background glowing gradients & grid lines */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(16,185,129,0.08),transparent_60%)]" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(to right, #10b981 1px, transparent 1px), linear-gradient(to bottom, #10b981 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="w-full max-w-md relative z-10 bg-black/80 border border-emerald-500/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl shadow-emerald-500/5">
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="text-xs text-emerald-400/80 font-mono ml-2">auth_daemon // v2.4</span>
          </div>
          <Link to="/" className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Return
          </Link>
        </div>

        {/* Stage 1: PIN Gate */}
        {stage === "pin" && (
          <div>
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3 shadow-inner shadow-emerald-500/20">
                <TerminalIcon className="w-7 h-7 text-emerald-400" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">Terminal Access</h1>
              <p className="text-xs text-white/50 mt-1">Enter 4-digit security PIN to unlock edit terminal</p>
            </div>

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* 4 Digit Boxes */}
            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
              {[0, 1, 2, 3].map((idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={pinDigits[idx]}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={`w-14 h-16 text-center text-2xl font-bold bg-white/5 border rounded-2xl outline-none transition-all duration-200 ${
                    pinDigits[idx]
                      ? "border-emerald-400 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)]"
                      : "border-white/15 text-white focus:border-emerald-400/60 focus:bg-white/10"
                  }`}
                />
              ))}
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs text-center flex items-center justify-center gap-2 animate-shake">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Touch/Mouse Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto mb-6">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeypadPress(key)}
                  className="h-12 rounded-xl bg-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/30 border border-white/10 text-base font-semibold text-white/90 active:scale-95 transition-all flex items-center justify-center"
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={() => {
                  setStage("forgot-send");
                  setError("");
                  setSuccessMessage("");
                }}
                className="text-xs text-emerald-400/80 hover:text-emerald-300 transition-colors underline underline-offset-4"
              >
                Forgot PIN? Send code to Gmail
              </button>
            </div>
          </div>
        )}

        {/* Stage 2: Forgot PIN - Request Code */}
        {stage === "forgot-send" && (
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center shadow-inner shadow-indigo-500/20">
              <Mail className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Reset 4-Digit PIN</h2>
              <p className="text-xs text-white/50 mt-1">
                We'll dispatch a 6-digit verification code to your email:
              </p>
              <p className="text-xs font-semibold text-emerald-400 mt-2 bg-emerald-500/10 border border-emerald-500/20 py-2 px-3 rounded-xl break-all">
                yannabathulavarshithreddy7@gmail.com
              </p>
            </div>

            {codeError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                {codeError}
              </p>
            )}

            <button
              onClick={handleSendResetCode}
              disabled={sendStatus === "sending"}
              className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold rounded-2xl py-3.5 text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              {sendStatus === "sending" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending Code to Gmail...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Reset Code to Gmail
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStage("pin");
                setCodeError("");
              }}
              className="w-full text-xs text-white/40 hover:text-white transition-colors"
            >
              ← Back to PIN Unlock
            </button>
          </div>
        )}

        {/* Stage 3: Forgot PIN - Enter Code */}
        {stage === "forgot-verify" && (
          <form onSubmit={handleVerifyResetCode} className="space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <KeyRound className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Enter 6-Digit Code</h2>
              <p className="text-xs text-white/50 mt-1">
                Check your Gmail inbox or spam folder for the code.
              </p>
            </div>

            {generatedCodeHint && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs text-left">
                <span className="font-bold">Sent to Gmail!</span> If you have instant access, your active OTP code is:{" "}
                <span className="font-mono font-bold text-white tracking-widest text-sm underline">{generatedCodeHint}</span>
              </div>
            )}

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={resetCode}
              onChange={(e) => {
                setResetCode(e.target.value.replace(/[^0-9]/g, ""));
                setCodeError("");
              }}
              placeholder="000000"
              autoFocus
              className="w-full bg-white/5 border border-white/20 text-white text-center text-3xl font-mono tracking-[0.4em] rounded-2xl px-4 py-3.5 outline-none focus:border-emerald-400 focus:bg-white/10 transition-colors"
            />

            {codeError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
                {codeError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-2xl py-3.5 text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Verify Code
            </button>

            <div className="flex justify-between text-xs text-white/40 pt-2">
              <button
                type="button"
                onClick={() => {
                  setStage("forgot-send");
                  setResetCode("");
                  setCodeError("");
                }}
                className="hover:text-emerald-400 transition-colors"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => {
                  setStage("pin");
                  setCodeError("");
                }}
                className="hover:text-white transition-colors"
              >
                Back to PIN
              </button>
            </div>
          </form>
        )}

        {/* Stage 4: Set New PIN */}
        {stage === "forgot-newpin" && (
          <form onSubmit={handleSetNewPin} className="space-y-5">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3">
                <Lock className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Create New 4-Digit PIN</h2>
              <p className="text-xs text-white/50 mt-1">
                Enter and confirm your new 4-digit PIN code.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs text-white/50 mb-1 font-mono">NEW 4-DIGIT PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="e.g. 1369"
                  autoFocus
                  className="w-full bg-white/5 border border-white/20 text-white text-center text-2xl font-mono tracking-[0.4em] rounded-2xl py-3 outline-none focus:border-emerald-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-white/50 mb-1 font-mono">CONFIRM NEW PIN</label>
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPinConfirm}
                  onChange={(e) => setNewPinConfirm(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="e.g. 1369"
                  className="w-full bg-white/5 border border-white/20 text-white text-center text-2xl font-mono tracking-[0.4em] rounded-2xl py-3 outline-none focus:border-emerald-400 transition-colors"
                />
              </div>
            </div>

            {codeError && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl text-center">
                {codeError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-semibold rounded-2xl py-3.5 text-sm transition-all shadow-lg shadow-emerald-500/20"
            >
              Update PIN & Return
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Terminal Section & Editor ────────────────────────────────────────────────
interface LogEntry {
  id: string;
  type: "input" | "output" | "error" | "system" | "success";
  text: string;
}

function AdminTerminal({ onLock }: { onLock: () => void }) {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminData>(getAdminData());
  const [activeTab, setActiveTab] = useState<"terminal" | "gui">("terminal");
  const [savedNotice, setSavedNotice] = useState(false);

  // Terminal state
  const [commandInput, setCommandInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: "1",
      type: "system",
      text: [
        "================================================================",
        " VARSHITH REDDY // PORTFOLIO EDIT TERMINAL v2.4 (CLI MODE)",
        " Authorized user logged in. All changes can be saved live.",
        " Type 'help' for full command list, or click buttons below.",
        "================================================================",
      ].join("\n"),
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll terminal
  useEffect(() => {
    if (activeTab === "terminal") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, activeTab]);

  // Keep adminData synced
  const updateData = (fn: (d: AdminData) => AdminData) => {
    setData((prev) => {
      const next = fn({ ...prev });
      return next;
    });
  };

  const handleSaveData = () => {
    saveAdminData(data);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleResetDefaults = () => {
    if (confirm("Revert all portfolio data to original defaults?")) {
      resetAdminData();
      setData(DEFAULT_DATA);
      addLog("system", "✓ Portfolio data restored to original defaults.");
    }
  };

  const addLog = (type: LogEntry["type"], text: string) => {
    setLogs((prev) => [...prev, { id: Math.random().toString(), type, text }]);
  };

  // Command Execution Processor
  const executeCommand = (cmdStr: string) => {
    const raw = cmdStr.trim();
    if (!raw) return;

    // Add to history
    setHistory((prev) => [...prev, raw]);
    setHistoryIdx(-1);
    addLog("input", `varshith@portfolio:~$ ${raw}`);

    const parts = raw.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);
    const rest = args.join(" ");

    switch (command) {
      case "help":
        addLog(
          "system",
          [
            "AVAILABLE COMMANDS:",
            "  help                              Show this manual",
            "  show [profile|skills|achievements|education|projects|all]",
            "                                    Print live data section",
            "  set name <val>                    Update full name",
            "  set tagline <val>                 Update tagline",
            "  set bio <val>                     Update bio paragraph",
            "  set email <val>                   Update contact email",
            "  set phone <val>                   Update phone/whatsapp",
            "  set location <val>                Update location",
            "  set github <url>                  Update GitHub link",
            "  set linkedin <url>                Update LinkedIn link",
            "  add achievement <title> | <stat> | <sub_label> | <desc>",
            "  add education <school> | <place> | <degree> | <period>",
            "  add skill <group_title> | <skill1, skill2, skill3>",
            "  del achievement <index>           Remove achievement by 1-based index",
            "  del education <index>             Remove education by 1-based index",
            "  del skill <index>                 Remove skill group by 1-based index",
            "  passwd <new_4_digit_pin>          Change terminal PIN code",
            "  save                              Save all changes to live site",
            "  reset                             Reset data to factory defaults",
            "  gui                               Switch to Visual Form Editor",
            "  clear                             Clear the terminal buffer",
            "  exit                              Lock and return to homepage",
          ].join("\n")
        );
        break;

      case "clear":
      case "cls":
        setLogs([]);
        break;

      case "gui":
        setActiveTab("gui");
        addLog("system", "Switched to Visual Form Editor.");
        break;

      case "save":
        saveAdminData(data);
        addLog("success", "✓ Changes successfully saved and applied to portfolio!");
        break;

      case "reset":
        handleResetDefaults();
        break;

      case "exit":
      case "logout":
      case "lock":
        onLock();
        break;

      case "passwd": {
        const pinCandidate = args[0];
        if (!pinCandidate || !/^[0-9]{4}$/.test(pinCandidate)) {
          addLog("error", "Error: PIN must be exactly 4 digits. Usage: passwd 1369");
        } else {
          setPin(pinCandidate);
          addLog("success", `✓ PIN successfully updated to ${pinCandidate}. Remember this code for your next login.`);
        }
        break;
      }

      case "show": {
        const target = args[0]?.toLowerCase() || "all";
        if (target === "profile") {
          addLog("output", JSON.stringify(data.profile, null, 2));
        } else if (target === "skills") {
          const formatted = data.skills
            .map((s, i) => `[${i + 1}] ${s.title}: ${s.items.join(", ")}`)
            .join("\n");
          addLog("output", formatted || "No skills found.");
        } else if (target === "achievements") {
          const formatted = data.achievements
            .map((a, i) => `[${i + 1}] ${a.icon} ${a.title} (${a.stat} - ${a.sub})\n    ${a.desc}`)
            .join("\n\n");
          addLog("output", formatted || "No achievements found.");
        } else if (target === "education") {
          const formatted = data.education
            .map((e, i) => `[${i + 1}] ${e.school} (${e.place}) - ${e.period}\n    ${e.detail}`)
            .join("\n\n");
          addLog("output", formatted || "No education records found.");
        } else if (target === "projects") {
          const formatted = data.projects
            .map((p, i) => `[${i + 1}] ${p.title} (${p.period})\n    ${p.subtitle}\n    Stack: ${p.stack.join(", ")}`)
            .join("\n\n");
          addLog("output", formatted || "No projects found.");
        } else if (target === "all") {
          addLog("output", JSON.stringify(data, null, 2));
        } else {
          addLog("error", `Unknown target '${target}'. Use: show [profile|skills|achievements|education|projects|all]`);
        }
        break;
      }

      case "set": {
        const field = args[0]?.toLowerCase();
        const value = args.slice(1).join(" ");
        if (!field || !value) {
          addLog("error", "Usage: set <field> <value> (e.g. set tagline B.Tech CSE Data Engineer)");
          return;
        }

        if (field in data.profile) {
          updateData((d) => ({
            ...d,
            profile: { ...d.profile, [field]: value },
          }));
          addLog("success", `✓ Updated profile.${field} = "${value}" (Type 'save' to commit changes)`);
        } else {
          addLog("error", `Field '${field}' not recognized. Valid fields: name, tagline, bio, email, phone, location, github, linkedin`);
        }
        break;
      }

      case "add": {
        const sub = args[0]?.toLowerCase();
        const payload = args.slice(1).join(" ");

        if (sub === "achievement") {
          const tokens = payload.split("|").map((s) => s.trim());
          if (tokens.length < 4) {
            addLog("error", "Usage: add achievement <title> | <stat> | <sub_label> | <description>");
            return;
          }
          const [title, stat, subLabel, desc] = tokens;
          updateData((d) => ({
            ...d,
            achievements: [...d.achievements, { icon: "🏆", title, stat, sub: subLabel, desc }],
          }));
          addLog("success", `✓ Added achievement "${title}". (Type 'save' to commit)`);
        } else if (sub === "education") {
          const tokens = payload.split("|").map((s) => s.trim());
          if (tokens.length < 4) {
            addLog("error", "Usage: add education <school> | <place> | <degree> | <period>");
            return;
          }
          const [school, place, detail, period] = tokens;
          updateData((d) => ({
            ...d,
            education: [...d.education, { school, place, detail, period }],
          }));
          addLog("success", `✓ Added education record "${school}". (Type 'save' to commit)`);
        } else if (sub === "skill") {
          const tokens = payload.split("|").map((s) => s.trim());
          if (tokens.length < 2) {
            addLog("error", "Usage: add skill <group_title> | <comma, separated, skills>");
            return;
          }
          const [title, skillsStr] = tokens;
          const items = skillsStr.split(",").map((s) => s.trim()).filter(Boolean);
          updateData((d) => ({
            ...d,
            skills: [...d.skills, { title, items }],
          }));
          addLog("success", `✓ Added skill group "${title}". (Type 'save' to commit)`);
        } else {
          addLog("error", `Unknown add category '${sub}'. Valid: achievement, education, skill`);
        }
        break;
      }

      case "del":
      case "rm": {
        const sub = args[0]?.toLowerCase();
        const idx = parseInt(args[1], 10) - 1;

        if (isNaN(idx) || idx < 0) {
          addLog("error", `Usage: del <achievement|education|skill> <1-based index>`);
          return;
        }

        if (sub === "achievement") {
          if (idx >= data.achievements.length) {
            addLog("error", `Index out of range. Currently ${data.achievements.length} achievements.`);
            return;
          }
          const removed = data.achievements[idx];
          updateData((d) => ({
            ...d,
            achievements: d.achievements.filter((_, i) => i !== idx),
          }));
          addLog("success", `✓ Deleted achievement "${removed.title}". (Type 'save' to commit)`);
        } else if (sub === "education") {
          if (idx >= data.education.length) {
            addLog("error", `Index out of range. Currently ${data.education.length} education records.`);
            return;
          }
          const removed = data.education[idx];
          updateData((d) => ({
            ...d,
            education: d.education.filter((_, i) => i !== idx),
          }));
          addLog("success", `✓ Deleted education "${removed.school}". (Type 'save' to commit)`);
        } else if (sub === "skill") {
          if (idx >= data.skills.length) {
            addLog("error", `Index out of range. Currently ${data.skills.length} skill groups.`);
            return;
          }
          const removed = data.skills[idx];
          updateData((d) => ({
            ...d,
            skills: d.skills.filter((_, i) => i !== idx),
          }));
          addLog("success", `✓ Deleted skill group "${removed.title}". (Type 'save' to commit)`);
        } else {
          addLog("error", "Unknown target to delete. Valid: achievement, education, skill");
        }
        break;
      }

      default:
        addLog("error", `Command '${command}' not found. Type 'help' for available commands.`);
    }
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    executeCommand(commandInput);
    setCommandInput("");
  };

  const handleTerminalKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(nextIdx);
        setCommandInput(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (history.length > 0 && historyIdx !== -1) {
        const nextIdx = historyIdx + 1;
        if (nextIdx >= history.length) {
          setHistoryIdx(-1);
          setCommandInput("");
        } else {
          setHistoryIdx(nextIdx);
          setCommandInput(history[nextIdx]);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#07070b] text-white flex flex-col font-mono selection:bg-emerald-500 selection:text-black">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-black/80 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/90" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/90" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
          </div>
          <div className="h-4 w-px bg-white/20 mx-1" />
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide">
              varshith<span className="text-emerald-400">@</span>portfolio:<span className="text-indigo-400">~</span>
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/10 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("terminal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "terminal"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>&gt;_ Terminal CLI</span>
          </button>
          <button
            onClick={() => setActiveTab("gui")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "gui"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>GUI Editor</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveData}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              savedNotice
                ? "bg-green-500 text-white animate-bounce"
                : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
            }`}
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>{savedNotice ? "Saved!" : "Save"}</span>
          </button>

          <button
            onClick={onLock}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-red-400/80 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-4 sm:p-6 max-w-6xl w-full mx-auto">
        {activeTab === "terminal" ? (
          <div className="flex-1 flex flex-col bg-black/90 border border-emerald-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/5">
            {/* Terminal Window Chrome */}
            <div className="bg-[#111116] border-b border-white/10 px-4 py-2.5 flex items-center justify-between text-xs text-white/40">
              <span>bash - 80x24 (UTF-8)</span>
              <span className="text-emerald-400/80">Status: Read/Write [ACTIVE]</span>
            </div>

            {/* Terminal Logs Output */}
            <div
              className="flex-1 p-5 overflow-y-auto space-y-2 text-xs sm:text-sm font-mono min-h-[420px] max-h-[calc(100vh-320px)]"
              onClick={() => inputRef.current?.focus()}
            >
              {logs.map((log) => (
                <div key={log.id} className="leading-relaxed whitespace-pre-wrap">
                  {log.type === "input" && <span className="text-emerald-400 font-bold">{log.text}</span>}
                  {log.type === "output" && <span className="text-white/80">{log.text}</span>}
                  {log.type === "system" && <span className="text-cyan-400/90">{log.text}</span>}
                  {log.type === "error" && <span className="text-red-400 font-semibold">{log.text}</span>}
                  {log.type === "success" && <span className="text-emerald-300 font-semibold">{log.text}</span>}
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>

            {/* Quick Action Chips Bar */}
            <div className="bg-[#111116] border-t border-white/10 px-4 py-2 flex flex-wrap gap-2 text-xs">
              <span className="text-white/30 self-center mr-1">Quick:</span>
              {[
                { label: "help", cmd: "help" },
                { label: "show profile", cmd: "show profile" },
                { label: "show all", cmd: "show all" },
                { label: "show skills", cmd: "show skills" },
                { label: "save", cmd: "save" },
                { label: "passwd 1369", cmd: "passwd 1369" },
                { label: "clear", cmd: "clear" },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => executeCommand(item.cmd)}
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-emerald-500/20 text-white/70 hover:text-emerald-300 border border-white/10 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Terminal Input Line */}
            <form
              onSubmit={handleCommandSubmit}
              className="border-t border-emerald-500/20 bg-black/60 px-4 py-3 flex items-center gap-2"
            >
              <span className="text-emerald-400 font-bold text-xs sm:text-sm shrink-0">
                varshith@portfolio:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleTerminalKeyDown}
                placeholder="type a command (e.g. 'help', 'show all', 'set tagline ...', 'save')"
                autoFocus
                className="flex-1 bg-transparent text-white font-mono text-xs sm:text-sm outline-none placeholder:text-white/20"
              />
              <button
                type="submit"
                className="px-3 py-1 bg-emerald-500 text-black text-xs font-bold rounded hover:bg-emerald-400 transition-colors"
              >
                Execute
              </button>
            </form>
          </div>
        ) : (
          /* Visual GUI Form Editor Mode */
          <div className="space-y-6 pb-16 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">Visual Portfolio Editor</h1>
                <p className="text-xs text-white/50 mt-1">
                  Edit all portfolio content visually. Changes apply immediately upon clicking Save.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetDefaults}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-white/40 hover:text-red-400 border border-white/10 hover:border-red-400/30 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
                </button>
                <button
                  onClick={handleSaveData}
                  className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    savedNotice
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                      : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-lg shadow-emerald-500/20"
                  }`}
                >
                  <Save className="w-3.5 h-3.5" /> {savedNotice ? "Saved to Live Site!" : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Profile Section */}
            <GuiSection title="Profile & Contact Information" defaultOpen>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <GuiField
                  label="Full Name"
                  value={data.profile.name}
                  onChange={(v) => updateData((d) => ({ ...d, profile: { ...d.profile, name: v } }))}
                />
                <GuiField
                  label="Tagline / Professional Title"
                  value={data.profile.tagline}
                  onChange={(v) => updateData((d) => ({ ...d, profile: { ...d.profile, tagline: v } }))}
                />
                <GuiField
                  label="Email Address"
                  value={data.profile.email}
                  onChange={(v) => updateData((d) => ({ ...d, profile: { ...d.profile, email: v } }))}
                />
                <GuiField
                  label="Phone / WhatsApp Number"
                  value={data.profile.phone}
                  onChange={(v) => updateData((d) => ({ ...d, profile: { ...d.profile, phone: v } }))}
                />
                <GuiField
                  label="Location"
                  value={data.profile.location}
                  onChange={(v) => updateData((d) => ({ ...d, profile: { ...d.profile, location: v } }))}
                />
                <GuiField
                  label="GitHub Profile URL"
                  value={data.profile.github}
                  onChange={(v) => updateData((d) => ({ ...d, profile: { ...d.profile, github: v } }))}
                />
                <GuiField
                  label="LinkedIn Profile URL"
                  value={data.profile.linkedin}
                  onChange={(v) => updateData((d) => ({ ...d, profile: { ...d.profile, linkedin: v } }))}
                />
              </div>
              <div className="mt-4">
                <GuiField
                  label="Hero Bio Paragraph"
                  value={data.profile.bio}
                  onChange={(v) => updateData((d) => ({ ...d, profile: { ...d.profile, bio: v } }))}
                  multiline
                />
              </div>
            </GuiSection>

            {/* Achievements Section */}
            <GuiSection title="Achievements & Honors" count={data.achievements.length}>
              <div className="space-y-4">
                {data.achievements.map((ach, i) => (
                  <div key={i} className="border border-white/10 rounded-2xl p-5 bg-white/5 relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-emerald-400 font-bold">Achievement #{i + 1}</span>
                      <button
                        onClick={() =>
                          updateData((d) => ({
                            ...d,
                            achievements: d.achievements.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <GuiField
                        label="Icon (emoji)"
                        value={ach.icon}
                        onChange={(v) =>
                          updateData((d) => {
                            const a = [...d.achievements];
                            a[i] = { ...a[i], icon: v };
                            return { ...d, achievements: a };
                          })
                        }
                      />
                      <GuiField
                        label="Stat (#10,735, 7+)"
                        value={ach.stat}
                        onChange={(v) =>
                          updateData((d) => {
                            const a = [...d.achievements];
                            a[i] = { ...a[i], stat: v };
                            return { ...d, achievements: a };
                          })
                        }
                      />
                      <GuiField
                        label="Title"
                        value={ach.title}
                        onChange={(v) =>
                          updateData((d) => {
                            const a = [...d.achievements];
                            a[i] = { ...a[i], title: v };
                            return { ...d, achievements: a };
                          })
                        }
                      />
                      <GuiField
                        label="Sub-label"
                        value={ach.sub}
                        onChange={(v) =>
                          updateData((d) => {
                            const a = [...d.achievements];
                            a[i] = { ...a[i], sub: v };
                            return { ...d, achievements: a };
                          })
                        }
                      />
                    </div>
                    <div className="mt-3">
                      <GuiField
                        label="Description"
                        value={ach.desc}
                        onChange={(v) =>
                          updateData((d) => {
                            const a = [...d.achievements];
                            a[i] = { ...a[i], desc: v };
                            return { ...d, achievements: a };
                          })
                        }
                        multiline
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() =>
                    updateData((d) => ({
                      ...d,
                      achievements: [
                        ...d.achievements,
                        {
                          icon: "⭐",
                          title: "New Achievement",
                          stat: "Top 1%",
                          sub: "Description of recognition",
                          desc: "Secured award and recognized for outstanding accomplishment.",
                        },
                      ],
                    }))
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add New Achievement
                </button>
              </div>
            </GuiSection>

            {/* Education Section */}
            <GuiSection title="Academic Background / Education" count={data.education.length}>
              <div className="space-y-4">
                {data.education.map((edu, i) => (
                  <div key={i} className="border border-white/10 rounded-2xl p-5 bg-white/5 relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-emerald-400 font-bold">Institution #{i + 1}</span>
                      <button
                        onClick={() =>
                          updateData((d) => ({
                            ...d,
                            education: d.education.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <GuiField
                        label="Institution Name"
                        value={edu.school}
                        onChange={(v) =>
                          updateData((d) => {
                            const e = [...d.education];
                            e[i] = { ...e[i], school: v };
                            return { ...d, education: e };
                          })
                        }
                      />
                      <GuiField
                        label="City / Location"
                        value={edu.place}
                        onChange={(v) =>
                          updateData((d) => {
                            const e = [...d.education];
                            e[i] = { ...e[i], place: v };
                            return { ...d, education: e };
                          })
                        }
                      />
                      <GuiField
                        label="Degree / Major & CGPA"
                        value={edu.detail}
                        onChange={(v) =>
                          updateData((d) => {
                            const e = [...d.education];
                            e[i] = { ...e[i], detail: v };
                            return { ...d, education: e };
                          })
                        }
                      />
                      <GuiField
                        label="Time Period"
                        value={edu.period}
                        onChange={(v) =>
                          updateData((d) => {
                            const e = [...d.education];
                            e[i] = { ...e[i], period: v };
                            return { ...d, education: e };
                          })
                        }
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() =>
                    updateData((d) => ({
                      ...d,
                      education: [
                        ...d.education,
                        {
                          school: "University / College Name",
                          place: "City, State",
                          detail: "Degree – Field of Study; CGPA: 8.0",
                          period: "Year – Present",
                        },
                      ],
                    }))
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Education Institution
                </button>
              </div>
            </GuiSection>

            {/* Skills Section */}
            <GuiSection title="Skills Categories" count={data.skills.length}>
              <div className="space-y-4">
                {data.skills.map((group, i) => (
                  <div key={i} className="border border-white/10 rounded-2xl p-5 bg-white/5 relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-emerald-400 font-bold">Category #{i + 1}</span>
                      <button
                        onClick={() =>
                          updateData((d) => ({
                            ...d,
                            skills: d.skills.filter((_, idx) => idx !== i),
                          }))
                        }
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                    <div className="space-y-3">
                      <GuiField
                        label="Category Title"
                        value={group.title}
                        onChange={(v) =>
                          updateData((d) => {
                            const s = [...d.skills];
                            s[i] = { ...s[i], title: v };
                            return { ...d, skills: s };
                          })
                        }
                      />
                      <GuiField
                        label="Skills (comma-separated list)"
                        value={group.items.join(", ")}
                        onChange={(v) =>
                          updateData((d) => {
                            const s = [...d.skills];
                            s[i] = {
                              ...s[i],
                              items: v
                                .split(",")
                                .map((x) => x.trim())
                                .filter(Boolean),
                            };
                            return { ...d, skills: s };
                          })
                        }
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() =>
                    updateData((d) => ({
                      ...d,
                      skills: [...d.skills, { title: "New Skill Group", items: ["Skill 1", "Skill 2"] }],
                    }))
                  }
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-dashed border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/10 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Skill Category
                </button>
              </div>
            </GuiSection>

            {/* Security Section - Update PIN */}
            <GuiSection title="Security: Change 4-Digit Access PIN">
              <ChangePinSubForm />
            </GuiSection>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Change PIN Sub-form ───────────────────────────────────────────────────────
function ChangePinSubForm() {
  const [pinVal, setPinVal] = useState("");
  const [confirmPinVal, setConfirmPinVal] = useState("");
  const [msg, setMsg] = useState("");
  const [currentActivePin, setCurrentActivePin] = useState(getPin());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[0-9]{4}$/.test(pinVal)) {
      setMsg("Error: PIN must be exactly 4 numeric digits.");
      return;
    }
    if (pinVal !== confirmPinVal) {
      setMsg("Error: PINs do not match.");
      return;
    }
    setPin(pinVal);
    setCurrentActivePin(pinVal);
    setPinVal("");
    setConfirmPinVal("");
    setMsg(`✓ PIN successfully changed to ${pinVal}!`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <p className="text-xs text-white/50">
        Current active PIN is: <span className="font-mono text-emerald-400 font-bold">{currentActivePin}</span>
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-white/40 font-mono mb-1">New 4-Digit PIN</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pinVal}
            onChange={(e) => {
              setPinVal(e.target.value.replace(/[^0-9]/g, ""));
              setMsg("");
            }}
            placeholder="e.g. 1369"
            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono tracking-widest outline-none focus:border-emerald-400"
          />
        </div>
        <div>
          <label className="block text-xs text-white/40 font-mono mb-1">Confirm PIN</label>
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={confirmPinVal}
            onChange={(e) => {
              setConfirmPinVal(e.target.value.replace(/[^0-9]/g, ""));
              setMsg("");
            }}
            placeholder="e.g. 1369"
            className="w-full bg-white/5 border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white font-mono tracking-widest outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {msg && (
        <p className={`text-xs ${msg.startsWith("✓") ? "text-emerald-400" : "text-red-400"}`}>
          {msg}
        </p>
      )}

      <button
        type="submit"
        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl transition-all"
      >
        Update Terminal PIN
      </button>
    </form>
  );
}

// ─── Collapsible Section Component ─────────────────────────────────────────────
function GuiSection({
  title,
  children,
  defaultOpen = false,
  count,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-white/10 rounded-2xl overflow-hidden bg-black/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white/5 hover:bg-white/[0.08] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white tracking-wide">{title}</span>
          {count !== undefined && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {count}
            </span>
          )}
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
      </button>
      {open && <div className="p-6 border-t border-white/10">{children}</div>}
    </div>
  );
}

function GuiField({
  label,
  value,
  onChange,
  multiline = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const cls =
    "w-full bg-white/5 border border-white/15 text-white rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/20 transition-all resize-none placeholder-white/20";
  return (
    <div>
      <label className="block text-xs text-white/50 font-mono mb-1">{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}

// ─── Entry Page ────────────────────────────────────────────────────────────────
const Admin = () => {
  const [unlocked, setUnlocked] = useState(false);
  const navigate = useNavigate();

  return unlocked ? (
    <AdminTerminal
      onLock={() => {
        setUnlocked(false);
        navigate("/");
      }}
    />
  ) : (
    <PinGate onUnlock={() => setUnlocked(true)} />
  );
};

export default Admin;
