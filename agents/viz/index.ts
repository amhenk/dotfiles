import type { ExtensionAPI, Theme } from "@mariozechner/pi-coding-agent";
import { truncateToWidth } from "@mariozechner/pi-tui";
import { Engine } from "./engine";
import { Cube } from "./shapes/cube";
import { Torus } from "./shapes/torus";
import { Sphere } from "./shapes/sphere";
import { GameOfLife } from "./shapes/game_of_life";
import { Shape, VizConfig } from "./types";
import * as fs from "node:fs";
import * as path from "node:path";

const CONFIG_PATH = path.join(process.env.HOME || "", ".pi", "agent", "viz-config.json");

const DEFAULT_CONFIG: VizConfig = {
  shape: "cube",
  noiseStrength: 0.35,
  vizWidth: 60,
  vizHeight: 22,
  tickRate: 30,
};

let status: "idle" | "working" | "complete" = "idle";
const logs: string[] = [];
const agentMap = new Map<string, number>();
let nextAgentId = 1;

export default function (pi: ExtensionAPI) {
  const engine = new Engine();
  const shapes: Record<string, Shape> = {
    cube: new Cube(),
    torus: new Torus(),
    sphere: new Sphere(),
    life: new GameOfLife(),
  };

  let config: VizConfig = { ...DEFAULT_CONFIG };
  let interval: ReturnType<typeof setInterval> | null = null;
  let tuiHandle: any = null;

  const loadConfig = () => {
    try {
      if (fs.existsSync(CONFIG_PATH)) {
        const saved = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));
        config = { ...DEFAULT_CONFIG, ...saved };
      }
    } catch (e) {
      console.error("Failed to load viz config", e);
    }
  };

  const saveConfig = () => {
    try {
      fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    } catch (e) {
      console.error("Failed to save viz config", e);
    }
  };

  const startLoop = (ctx: any) => {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      const shape = shapes[config.shape] || shapes.cube;
      shape.tick(status === "working");
      tuiHandle?.requestRender();
    }, config.tickRate);
  };

  pi.on("session_start", async (_event, ctx) => {
    loadConfig();
    updateWidget(ctx);
    
    ctx.ui.setFooter((tui, theme, footerData) => ({
      invalidate: () => { },
      render: (width) => {
        const branch = footerData.getGitBranch();
        const model = ctx.model?.id || "";
        const branchDisplay = branch ? theme.fg("accent", `[${branch}] `) : "";
        const modelDisplay = theme.fg("muted", `[${model}]`);
        const shapeDisplay = theme.fg("dim", ` (Viz: ${config.shape})`);
        return [branchDisplay + modelDisplay + shapeDisplay];
      },
      dispose: footerData.onBranchChange(() => tui.requestRender()),
    }));

    startLoop(ctx);
  });

  const updateWidget = (ctx: any) => {
    ctx.ui.setWidget("viz-header", (tui: any, theme: Theme) => {
      tuiHandle = tui;
      return {
        render: (width: number) => {
          const { vizWidth, vizHeight } = config;
          const color = status === "working" ? "accent" : (status === "complete" ? "success" : "dim");
          
          const shape = shapes[config.shape] || shapes.cube;
          const vizLines = engine.render(shape, theme, color, status === "working", config);

          const logWidth = width - vizWidth - 5;
          const displayLogs = logs.slice(-vizHeight).map(l => truncateToWidth(l, logWidth));

          const lines: string[] = [];
          for (let i = 0; i < vizHeight; i++) {
            const logLine = displayLogs[i] || "";
            const line = (vizLines[i] || "") + theme.fg("dim", "  │  ") + logLine;
            lines.push(truncateToWidth(line, width, ""));
          }
          return lines;
        },
        invalidate: () => { }
      };
    }, { placement: "aboveMessages" });
  };

  pi.on("agent_start", (event, ctx) => {
    status = "working";
    agentMap.clear();
    nextAgentId = 1;
    ctx.ui.setWorkingMessage("");
    updateWidget(ctx);
  });

  pi.on("tool_execution_start", (event: any, ctx: any) => {
    const isLead = !event.parentToolCallId;
    let agentId = 0;
    if (!isLead) {
      if (!agentMap.has(event.parentToolCallId)) {
        agentMap.set(event.parentToolCallId, nextAgentId++);
      }
      agentId = agentMap.get(event.parentToolCallId)!;
    }
    const theme = ctx.ui.theme;
    const idStr = theme.fg(agentId === 0 ? "accent" : "warning", `[${agentId}]`);
    const toolStr = theme.fg("text", `[${event.toolName.toUpperCase()}]`);
    const detail = event.args.path || event.args.command || event.args.name || event.args.prompt || "";
    logs.push(`${idStr}${toolStr} ${detail.slice(0, 60)}`);
    updateWidget(ctx);
  });

  pi.on("agent_end", (event, ctx) => {
    status = "complete";
    ctx.ui.setWorkingMessage();
    updateWidget(ctx);
  });

  pi.registerCommand("viz", {
    description: "Manage visualization. Subcommands: list, set <key> <val>, status, <shape>",
    handler: async (args, ctx) => {
      const parts = args?.trim().split(/\s+/) || [];
      const cmd = parts[0]?.toLowerCase();

      if (!cmd) {
        ctx.ui.notify(`Shapes: ${Object.keys(shapes).join(", ")}`, "info");
        return;
      }

      if (cmd === "set" && parts.length >= 3) {
        const key = parts[1];
        const val = parts[2];
        if (key in config) {
          if (typeof (config as any)[key] === "number") {
            (config as any)[key] = parseFloat(val);
          } else {
            (config as any)[key] = val;
          }
          saveConfig();
          if (key === "tickRate") startLoop(ctx);
          ctx.ui.notify(`Viz: ${key} set to ${val}`, "success");
          updateWidget(ctx);
        }
        return;
      }

      if (cmd === "status") {
        ctx.ui.notify(JSON.stringify(config), "info");
        return;
      }

      if (shapes[cmd]) {
        config.shape = cmd;
        saveConfig();
        ctx.ui.notify(`Viz: shape changed to ${cmd}`, "success");
        updateWidget(ctx);
      } else {
        ctx.ui.notify(`Unknown command or shape: ${cmd}`, "warning");
      }
    }
  });

  pi.registerCommand("viz-clear", {
    description: "Clear visualization logs",
    handler: async (_args, ctx) => {
      logs.length = 0;
      status = "idle";
      updateWidget(ctx);
    }
  });
}
