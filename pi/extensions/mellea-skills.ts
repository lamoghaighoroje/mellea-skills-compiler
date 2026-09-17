import type { ExtensionAPI, ExtensionCommandContext } from "@earendil-works/pi-coding-agent";
import { checkCliAvailable, runMelleaSkills, CLI_MISSING_MESSAGE } from "./lib/cli.js";

export default function melleaSkillsExtension(pi: ExtensionAPI) {
	pi.registerCommand("compile", {
		description: "Compile a Mellea skill specification (.md) into a typed pipeline",
		handler: async (args: string, ctx: ExtensionCommandContext) => {
			const available = await checkCliAvailable(pi.exec);
			if (!available) {
				ctx.ui.notify(CLI_MISSING_MESSAGE, "error");
				return;
			}

			const specPath = args.trim();
			if (!specPath) {
				ctx.ui.notify("Usage: /compile <path-to-spec.md> [--backend claude] [flags...]", "warning");
				return;
			}

			const argv = specPath.split(/\s+/);
			ctx.ui.setStatus("mellea-skills", "Compiling...");
			try {
				const result = await runMelleaSkills(pi.exec, "compile", argv);
				if (result.code === 0) {
					ctx.ui.notify(result.stdout || "Compile succeeded.", "info");
				} else {
					ctx.ui.notify(result.stderr || `Compile failed (exit ${result.code}).`, "error");
				}
			} finally {
				ctx.ui.setStatus("mellea-skills", undefined);
			}
		},
	});
}
