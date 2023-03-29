export enum PROBE_NAMES {
    PROBE_NMAP = 'probe-nmap',
    PROBE_DUMMY = 'probe-dummy',
}

export const requireEnvVars = (vars: string[]) => {
    vars.forEach((v) => {
        if (!process.env[v]) {
            throw new Error(`Missing environment variable: ${v}`);
        }
    });
}