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
					ctx.ui.notify(result.stdout || result.stderr || "Compile succeeded.", "info");
				} else {
					ctx.ui.notify(result.stderr || `Compile failed (exit ${result.code}).`, "error");
				}
			} finally {
				ctx.ui.setStatus("mellea-skills", undefined);
			}
		},
	});

	pi.registerCommand("certify", {
		description: "Run the full certification pipeline on a compiled Mellea skill",
		handler: async (args: string, ctx: ExtensionCommandContext) => {
			const available = await checkCliAvailable(pi.exec);
			if (!available) {
				ctx.ui.notify(CLI_MISSING_MESSAGE, "error");
				return;
			}

			const trimmed = args.trim();
			if (!trimmed) {
				ctx.ui.notify(
					"Usage: /certify <compiled-skill-dir> [--enforce] [--inference-engine ollama|vllm] [--risk-model ...] [--guardian-model ...]",
					"warning",
				);
				return;
			}

			const argv = trimmed.split(/\s+/);
			ctx.ui.setStatus("mellea-skills", "Certifying...");
			try {
				const result = await runMelleaSkills(pi.exec, "certify", argv);
				if (result.code === 0) {
					ctx.ui.notify(result.stdout || result.stderr || "Certify succeeded.", "info");
				} else {
					ctx.ui.notify(result.stderr || `Certify failed (exit ${result.code}).`, "error");
				}
			} finally {
				ctx.ui.setStatus("mellea-skills", undefined);
			}
		},
	});
}
