export type PiExecResult = {
	stdout: string;
	stderr: string;
	code: number;
	killed: boolean;
};

export type PiExec = (
	command: string,
	args: string[],
	options?: { cwd?: string },
) => Promise<PiExecResult>;

export const CLI_MISSING_MESSAGE =
	"mellea-skills CLI not found on PATH. Install it first — see " +
	"https://github.com/generative-computing/mellea-skills-compiler#install " +
	"(pip install -e . from a clone of the repo).";

export async function checkCliAvailable(exec: PiExec): Promise<boolean> {
	const result = await exec("mellea-skills", ["version"]);
	return result.code === 0;
}

export async function runMelleaSkills(
	exec: PiExec,
	subcommand: string,
	args: string[],
	options?: { cwd?: string },
): Promise<PiExecResult> {
	return exec("mellea-skills", [subcommand, ...args], options);
}
