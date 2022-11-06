export enum PROBES_NAMES {
    PROBE_NMAP = 'probe-nmap'
}

export const requireEnvVars = (vars: string[]) => {
    vars.forEach((v) => {
        if (!process.env[v]) {
            throw new Error(`Missing environment variable: ${v}`);
        }
    });
}