export type NmapResults = NmapResult[]

export type NmapResult = {
  protocol: string;
  port: number;
  name: string;
  product?: any;
  version?: any;
  extrainfo?: any;
  cves: Cve[];
}

interface Cve {
  id: string;
  sourceIdentifier: string;
  published: string;
  lastModified: string;
  vulnStatus: string;
  evaluatorSolution: string;
  evaluatorImpact: string;
  descriptions: Description[];
  metrics: Metrics;
  references: any[];
}

interface Metrics {
}

interface Description {
  lang: string;
  value: string;
}