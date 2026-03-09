import type { ExtensionAPI, Theme } from "@mariozechner/pi-coding-agent";
import { truncateToWidth } from "@mariozechner/pi-tui";
import { Engine } from "./engine";
import { Cube } from "./shapes/cube";
import { Torus } from "./shapes/torus";
import { Sphere } from "./shapes/sphere";
import { Shape } from "./types";

const TICK_MS = 30;

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
  };
  
  let activeShapeName = "cube";
  let interval: ReturnType<typeof setInterval> | null = null;
  let tuiHandle: any = null;

  // Persistence: Restore shape from session if available
  pi.on("session_start", async (_event, ctx) => {
    for (const entry of ctx.sessionManager.getEntries()) {
      if (entry.type === "custom" && entry.customType === "viz-settings") {
        if (shapes[entry.data.shape]) {
          activeShapeName = entry.data.shape;
        }
      }
    }
    
    updateWidget(ctx);
    
    // Custom footer to remove built-in spinner
    ctx.ui.setFooter((tui, theme, footerData) => ({
      invalidate: () => { },
      render: (width) => {
        const branch = footerData.getGitBranch();
        const model = ctx.model?.id || "";
        const branchDisplay = branch ? theme.fg("accent", `[${branch}] `) : "";
        const modelDisplay = theme.fg("muted", `[${model}]`);
        const shapeDisplay = theme.fg("dim", ` (Viz: ${activeShapeName})`);
        return [branchDisplay + modelDisplay + shapeDisplay];
      },
      dispose: footerData.onBranchChange(() => tui.requestRender()),
    }));

    if (!interval) {
      interval = setInterval(() => {
        shapes[activeShapeName].tick(status === "working");
        tuiHandle?.requestRender();
      }, TICK_MS);
    }
  });

  const updateWidget = (ctx: any) => {
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
    description: "Configure the visualization (shape: cube, torus, sphere)",
    handler: async (args, ctx) => {
      const shape = args?.toLowerCase().trim();
      if (shapes[shape]) {
        activeShapeName = shape;
        pi.appendEntry("viz-settings", { shape: activeShapeName });
        ctx.ui.notify(`Visualization shape changed to ${shape}`, "info");
        updateWidget(ctx);
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
      updateWidget(ctx);
    }
  });
}
