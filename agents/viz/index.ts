import type { ExtensionAPI, Theme } from "@mariozechner/pi-coding-agent";
import { truncateToWidth } from "@mariozechner/pi-tui";
import { Engine } from "./engine";
import { Cube } from "./shapes/cube";
import { Torus } from "./shapes/torus";
import { Sphere } from "./shapes/sphere";
import { GameOfLife } from "./shapes/game_of_life";
import { Shape } from "./types";

const TICK_MS = 30;
const MAX_LOGS = 200;

let status: "idle" | "working" | "complete" = "idle";
const logs: string[] = [];
const agentMap = new Map<string, number>();
let nextAgentId = 1;

function pushLog(line: string) {
  logs.push(line);
  if (logs.length > MAX_LOGS) logs.splice(0, logs.length - MAX_LOGS);
}

export default function (pi: ExtensionAPI) {
  const engine = new Engine();
  const shapes: Record<string, Shape> = {
    cube: new Cube(),
    torus: new Torus(),
    sphere: new Sphere(),
    life: new GameOfLife(),
  };
  
  let activeShapeName = "cube";
  let interval: ReturnType<typeof setInterval> | null = null;
  let tuiHandle: any = null;

  // Register the widget once — the render callback reads module-level
  // state (`status`, `logs`, `activeShapeName`) by reference, so it
  // always sees the latest values without needing to be re-registered.
  const registerWidget = (ctx: any) => {
    ctx.ui.setWidget("viz-header", (tui: any, theme: Theme) => {
      tuiHandle = tui;
      return {
        render: (width: number) => {
          const vizWidth = 60;
          const vizHeight = 22;
          const color = status === "working" ? "accent" : (status === "complete" ? "success" : "dim");
          
          const vizLines = engine.render(shapes[activeShapeName], vizWidth, vizHeight, theme, color);

          const logWidth = width - vizWidth - 4;
          const displayLogs = logs.slice(-vizHeight).map(l => truncateToWidth(l, logWidth));

          const lines: string[] = [];
          for (let i = 0; i < vizHeight; i++) {
            const logLine = displayLogs[i] || "";
            lines.push(vizLines[i] + theme.fg("dim", "  │  ") + logLine);
          }
          return lines;
        },
        invalidate: () => { }
      };
    }, { placement: "aboveMessages" });
  };

  // Persistence: Restore shape from session if available
  pi.on("session_start", async (_event, ctx) => {
    for (const entry of ctx.sessionManager.getEntries()) {
      if (entry.type === "custom" && entry.customType === "viz-settings") {
        if (shapes[entry.data.shape]) {
          activeShapeName = entry.data.shape;
        }
      }
    }
    
    registerWidget(ctx);

    if (!interval) {
      interval = setInterval(() => {
        shapes[activeShapeName].tick(status === "working");
        tuiHandle?.requestRender();
      }, TICK_MS);
    }
  });

  pi.on("agent_start", (_event, ctx) => {
    status = "working";
    agentMap.clear();
    nextAgentId = 1;
    ctx.ui.setWorkingMessage("");
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
    pushLog(`${idStr}${toolStr} ${detail.slice(0, 60)}`);
  });

  pi.on("agent_end", (_event, ctx) => {
    status = "complete";
    ctx.ui.setWorkingMessage();
  });

  pi.registerCommand("viz", {
    description: "Configure the visualization (shape: cube, torus, sphere, life)",
    handler: async (args, ctx) => {
      const shape = args?.toLowerCase().trim();
      if (shapes[shape]) {
        activeShapeName = shape;
        pi.appendEntry("viz-settings", { shape: activeShapeName });
        ctx.ui.notify(`Visualization shape changed to ${shape}`, "info");
      } else {
        ctx.ui.notify(`Available shapes: ${Object.keys(shapes).join(", ")}`, "warning");
      }
    }
  });

  pi.registerCommand("viz-clear", {
    description: "Clear visualization logs",
    handler: async (_args, ctx) => {
      logs.length = 0;
      status = "idle";
    }
  });
}
