export type NmapResults = NmapResult[]
export type NmapResult = {
  id: string;
  sourceIdentifier: string;
  published: string;
  lastModified: string;
  vulnStatus: string;
  descriptions: Description[];
  metrics: Metrics;
  references: any[];
}

type Metrics = {
}

type Description = {
  lang: string;
  value: string;
}