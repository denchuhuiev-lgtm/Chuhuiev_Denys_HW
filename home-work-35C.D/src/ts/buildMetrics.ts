type Metric = {
  name: string;
  value: string;
};

const metrics: Metric[] = [
  { name: 'devServer', value: 'port 3500' },
  { name: 'typescript', value: 'babel preset' },
  { name: 'bundleAnalyzer', value: 'static report' },
];

window.webpackHomeworkMetrics = metrics.reduce<Record<string, string>>((acc, metric) => {
  acc[metric.name] = metric.value;
  return acc;
}, {});

export {};
