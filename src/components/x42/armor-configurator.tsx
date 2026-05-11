"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Bot,
  Box,
  BrainCircuit,
  CircleDot,
  Cpu,
  Gauge,
  Move3D,
  Paintbrush,
  Radar,
  Rotate3D,
  Save,
  Shield,
  Shuffle,
  Sparkles,
  Swords,
  Undo2,
  Volume2,
  Zap,
  type LucideIcon
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  type ArmorUpgrade,
  type AssistantMode,
  type SuitPart,
  type WeaponSystem,
  useSuitStore
} from "@/lib/suit-store";
import { RobotSuitCanvas } from "./robot-suit";

const parts: Array<{ id: SuitPart; label: string; detail: string; icon: LucideIcon }> = [
  { id: "helmet", label: "Helmet", detail: "Sensor crown and visor", icon: Bot },
  { id: "chest", label: "Chest", detail: "Load frame and arc core", icon: Shield },
  { id: "shoulders", label: "Shoulders", detail: "Impact fins and servos", icon: Box },
  { id: "arms", label: "Arms", detail: "Gauntlets and hardpoints", icon: Swords },
  { id: "legs", label: "Legs", detail: "Boot drives and stabilizers", icon: Move3D },
  { id: "reactor", label: "Reactor", detail: "Emitter and pulse loops", icon: Zap }
];

const swatches = [
  ["Crimson", "#e11d48"],
  ["Ember", "#f97316"],
  ["Gold", "#facc15"],
  ["Arc Cyan", "#67e8f9"],
  ["Ion Green", "#22c55e"],
  ["Titanium", "#94a3b8"],
  ["Ceramic", "#f8fafc"],
  ["Carbon", "#111827"]
] as const;

const weapons: Array<{ id: WeaponSystem; label: string; detail: string; icon: LucideIcon }> = [
  { id: "pulse", label: "Pulse Repulsor", detail: "High-energy palm discharge", icon: CircleDot },
  { id: "rail", label: "Rail Lance", detail: "Forearm linear accelerator", icon: Radar },
  { id: "micro", label: "Micro Rockets", detail: "Swarm payload module", icon: Swords },
  { id: "arc", label: "Arc Projector", detail: "Short range plasma field", icon: Zap }
];

const upgrades: Array<{ id: ArmorUpgrade; label: string; icon: LucideIcon }> = [
  { id: "flight", label: "Flight Pack", icon: Move3D },
  { id: "kinetic", label: "Kinetic Shell", icon: Shield },
  { id: "stealth", label: "Stealth Skin", icon: Sparkles },
  { id: "nanoweave", label: "Nanoweave", icon: BrainCircuit }
];

const assistantModes: Array<{ id: AssistantMode; label: string; detail: string; icon: LucideIcon }> = [
  { id: "tactical", label: "Tactical", detail: "Threat map active", icon: Radar },
  { id: "diagnostic", label: "Diagnostic", detail: "Telemetry scan active", icon: Activity },
  { id: "cinematic", label: "Cinematic", detail: "Showcase lighting active", icon: Volume2 }
];

export function ArmorConfigurator() {
  const selectedPart = useSuitStore((state) => state.selectedPart);
  const colors = useSuitStore((state) => state.colors);
  const weapon = useSuitStore((state) => state.weapon);
  const upgrade = useSuitStore((state) => state.upgrade);
  const assistantMode = useSuitStore((state) => state.assistantMode);
  const armorDensity = useSuitStore((state) => state.armorDensity);
  const reactorOutput = useSuitStore((state) => state.reactorOutput);
  const shieldBias = useSuitStore((state) => state.shieldBias);
  const rotationEnabled = useSuitStore((state) => state.rotationEnabled);
  const saveStatus = useSuitStore((state) => state.saveStatus);
  const setSelectedPart = useSuitStore((state) => state.setSelectedPart);
  const setPartColor = useSuitStore((state) => state.setPartColor);
  const setWeapon = useSuitStore((state) => state.setWeapon);
  const setUpgrade = useSuitStore((state) => state.setUpgrade);
  const setAssistantMode = useSuitStore((state) => state.setAssistantMode);
  const setArmorDensity = useSuitStore((state) => state.setArmorDensity);
  const setReactorOutput = useSuitStore((state) => state.setReactorOutput);
  const setShieldBias = useSuitStore((state) => state.setShieldBias);
  const toggleRotation = useSuitStore((state) => state.toggleRotation);
  const resetSuit = useSuitStore((state) => state.resetSuit);
  const randomizeSuit = useSuitStore((state) => state.randomizeSuit);
  const saveSuit = useSuitStore((state) => state.saveSuit);
  const hydrateSavedSuit = useSuitStore((state) => state.hydrateSavedSuit);

  useEffect(() => {
    hydrateSavedSuit();
  }, [hydrateSavedSuit]);

  const selectedPartMeta = parts.find((part) => part.id === selectedPart) ?? parts[0];
  const selectedAssistant = assistantModes.find((mode) => mode.id === assistantMode) ?? assistantModes[0];

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="lab-grid pointer-events-none absolute inset-0 opacity-80" />
      <div className="scanline pointer-events-none absolute inset-x-0 top-0 h-1/2 opacity-70" />

      <div className="relative z-10 grid min-h-screen gap-3 p-3 md:p-4 lg:grid-cols-[300px_minmax(0,1fr)_340px] lg:grid-rows-[64px_minmax(0,1fr)_76px] lg:p-5">
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="hologram-panel flex min-h-16 items-center justify-between rounded-lg px-4 lg:col-span-3"
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-primary/40 bg-primary/10 text-primary shadow-[0_0_24px_rgba(85,240,221,0.18)]">
              <Cpu className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold md:text-2xl">X42 Armor Lab</h1>
              <p className="truncate text-xs text-muted-foreground">{selectedPartMeta.label} tuning protocol active</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Badge>Frame X42-Vanguard</Badge>
            <Badge>Forge Lab Bay 07</Badge>
            <Badge>Sync Neural 98%</Badge>
          </div>
        </motion.header>

        <Panel className="order-2 min-h-[520px] lg:order-none">
          <PanelHeader icon={Paintbrush} eyebrow="Suit systems" title="Parts" action={<Badge>{selectedPartMeta.label}</Badge>} />
          <div className="mt-4 grid gap-2">
            {parts.map((part) => {
              const Icon = part.icon;
              const active = selectedPart === part.id;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => setSelectedPart(part.id)}
                  className={cn(
                    "group grid grid-cols-[40px_1fr_auto] items-center gap-3 rounded-lg border p-3 text-left transition",
                    active
                      ? "border-primary/70 bg-primary/10 shadow-[0_0_26px_rgba(85,240,221,0.12)]"
                      : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/50"
                  )}
                >
                  <span className="grid h-10 w-10 place-items-center rounded-md border border-border bg-background/80" style={{ color: colors[part.id] }}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{part.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{part.detail}</span>
                  </span>
                  <span className="h-3 w-3 rounded-sm border border-white/20" style={{ backgroundColor: colors[part.id] }} />
                </button>
              );
            })}
          </div>
          <div className="mt-4 grid gap-3 rounded-lg border border-border bg-background/40 p-3">
            <Readout label="Armor density" value={armorDensity} />
            <Readout label="Reactor output" value={reactorOutput} />
            <Readout label="Shield bias" value={shieldBias} />
          </div>
          <div className="mt-4 flex items-center justify-between rounded-lg border border-border bg-secondary/25 p-3">
            <div>
              <p className="text-sm font-medium">Factory baseline</p>
              <p className="text-xs text-muted-foreground">Restore the default suit</p>
            </div>
            <Button variant="secondary" size="sm" onClick={resetSuit}>
              <Undo2 className="h-4 w-4" />
              Restore
            </Button>
          </div>
        </Panel>

        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
          className="canvas-shell corner-brackets order-1 relative min-h-[480px] overflow-hidden rounded-lg border border-primary/20 lg:order-none lg:min-h-0"
        >
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            <Badge className="border-primary/40 bg-primary/10 text-primary">
              <Gauge className="h-3.5 w-3.5" /> Reactor {reactorOutput}%
            </Badge>
            <Badge className="border-amber-300/30 bg-amber-300/10 text-amber-200">
              <Shield className="h-3.5 w-3.5" /> Shell {armorDensity}%
            </Badge>
          </div>
          <RobotSuitCanvas />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 p-4">
            <div className="grid gap-2 rounded-lg border border-border bg-background/60 p-3 backdrop-blur-md md:grid-cols-3">
              <Telemetry label="Weapon" value={weapons.find((item) => item.id === weapon)?.label ?? weapon} />
              <Telemetry label="Upgrade" value={upgrades.find((item) => item.id === upgrade)?.label ?? upgrade} />
              <Telemetry label="Assistant" value={selectedAssistant.label} />
            </div>
          </div>
        </motion.section>

        <Panel className="order-3 min-h-[520px] lg:order-none">
          <PanelHeader icon={Sparkles} eyebrow="Fabrication" title="Loadout" action={<Badge>{saveStatus}</Badge>} />

          <section className="mt-4">
            <SectionTitle icon={Paintbrush} title={`${selectedPartMeta.label} color`} />
            <div className="mt-3 grid grid-cols-4 gap-2">
              {swatches.map(([name, value]) => (
                <button
                  key={value}
                  type="button"
                  aria-label={`Set ${selectedPartMeta.label} to ${name}`}
                  title={name}
                  onClick={() => setPartColor(selectedPart, value)}
                  className={cn(
                    "h-10 rounded-md border transition",
                    colors[selectedPart] === value ? "border-primary ring-2 ring-primary/40" : "border-white/15 hover:border-primary/60"
                  )}
                  style={{ backgroundColor: value }}
                />
              ))}
            </div>
          </section>

          <section className="mt-5">
            <SectionTitle icon={Swords} title="Weapons" />
            <div className="mt-3 grid gap-2">
              {weapons.map((item) => <Option key={item.id} active={weapon === item.id} icon={item.icon} label={item.label} detail={item.detail} onClick={() => setWeapon(item.id)} />)}
            </div>
          </section>

          <section className="mt-5">
            <SectionTitle icon={Shield} title="Armor upgrades" />
            <div className="mt-3 grid grid-cols-2 gap-2">
              {upgrades.map((item) => <CompactOption key={item.id} active={upgrade === item.id} icon={item.icon} label={item.label} onClick={() => setUpgrade(item.id)} />)}
            </div>
          </section>

          <section className="mt-5 rounded-lg border border-border bg-background/40 p-3">
            <div className="flex items-center justify-between gap-3">
              <SectionTitle icon={Volume2} title="Voice assistant" />
              <Switch checked={assistantMode !== "diagnostic"} onClick={() => setAssistantMode(assistantMode === "diagnostic" ? "tactical" : "diagnostic")} aria-label="Toggle assistant tactical mode" />
            </div>
            <div className="mt-3 grid gap-2">
              {assistantModes.map((mode) => <Option key={mode.id} active={assistantMode === mode.id} icon={mode.icon} label={mode.label} detail={mode.detail} onClick={() => setAssistantMode(mode.id)} />)}
            </div>
          </section>
        </Panel>

        <motion.footer
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="hologram-panel order-4 flex min-h-20 flex-col gap-3 rounded-lg p-3 md:flex-row md:items-center md:justify-between lg:col-span-3"
        >
          <div className="grid gap-2 md:grid-cols-3 md:gap-3">
            <ControlSlider label="Density" value={armorDensity} onValueChange={setArmorDensity} />
            <ControlSlider label="Reactor" value={reactorOutput} onValueChange={setReactorOutput} />
            <ControlSlider label="Shield" value={shieldBias} onValueChange={setShieldBias} />
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Button variant={rotationEnabled ? "default" : "secondary"} onClick={toggleRotation}>
              <Rotate3D className="h-4 w-4" /> Rotate
            </Button>
            <Button variant="secondary" onClick={() => window.dispatchEvent(new Event("x42-reset-view"))}>
              <Undo2 className="h-4 w-4" /> Reset view
            </Button>
            <Button variant="secondary" onClick={saveSuit}>
              <Save className="h-4 w-4" /> Save suit
            </Button>
            <Button onClick={randomizeSuit}>
              <Shuffle className="h-4 w-4" /> Randomize
            </Button>
          </div>
        </motion.footer>
      </div>
    </main>
  );
}

function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <motion.aside initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={cn("hologram-panel thin-scrollbar overflow-auto rounded-lg p-4", className)}>{children}</motion.aside>;
}

function PanelHeader({ icon: Icon, eyebrow, title, action }: { icon: LucideIcon; eyebrow: string; title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-primary/30 bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
        <div className="min-w-0">
          <p className="truncate font-mono text-xs uppercase text-muted-foreground">{eyebrow}</p>
          <h2 className="truncate text-xl font-semibold">{title}</h2>
        </div>
      </div>
      {action}
    </div>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return <div className="flex items-center gap-2 text-sm font-medium"><Icon className="h-4 w-4 text-primary" />{title}</div>;
}

function Option({ active, icon: Icon, label, detail, onClick }: { active: boolean; icon: LucideIcon; label: string; detail: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("grid grid-cols-[34px_1fr] items-center gap-3 rounded-lg border p-2.5 text-left transition", active ? "border-primary/70 bg-primary/10" : "border-border bg-secondary/25 hover:border-primary/40 hover:bg-secondary/50")}>
      <span className="grid h-8 w-8 place-items-center rounded-md border border-border bg-background/70 text-primary"><Icon className="h-4 w-4" /></span>
      <span className="min-w-0"><span className="block truncate text-sm font-medium">{label}</span><span className="block truncate text-xs text-muted-foreground">{detail}</span></span>
    </button>
  );
}

function CompactOption({ active, icon: Icon, label, onClick }: { active: boolean; icon: LucideIcon; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex min-h-20 flex-col items-start justify-between rounded-lg border p-3 text-left transition", active ? "border-primary/70 bg-primary/10" : "border-border bg-secondary/25 hover:border-primary/40 hover:bg-secondary/50")}>
      <Icon className="h-5 w-5 text-primary" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function Readout({ label, value }: { label: string; value: number }) {
  return <div><div className="mb-1 flex items-center justify-between gap-3 text-xs"><span className="text-muted-foreground">{label}</span><span className="font-mono">{value}%</span></div><div className="h-1.5 overflow-hidden rounded-sm bg-secondary"><div className="h-full rounded-sm bg-primary" style={{ width: `${value}%` }} /></div></div>;
}

function ControlSlider({ label, value, onValueChange }: { label: string; value: number; onValueChange: (value: number) => void }) {
  return <label className="grid min-w-[130px] gap-1"><span className="flex items-center justify-between gap-2 text-xs text-muted-foreground">{label}<span className="font-mono text-foreground">{value}%</span></span><Slider value={value} onValueChange={onValueChange} min={0} max={100} /></label>;
}

function Telemetry({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0"><p className="truncate font-mono text-[11px] uppercase text-muted-foreground">{label}</p><p className="truncate text-sm font-medium">{value}</p></div>;
}
