export type ProbeRequest = {
    context: {
        id: string;
        name: string;
        target: string;
    },
    [key: string]: any;
}