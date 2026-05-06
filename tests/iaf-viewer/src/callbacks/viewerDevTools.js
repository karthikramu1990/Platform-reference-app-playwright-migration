export function attachViewerDevTools(iafViewer, generateModelComposerBenchmark) {
  if (process?.env?.NODE_ENV !== 'production') {
    window.viewer = iafViewer;
    window.generateModelComposerBenchmark = generateModelComposerBenchmark;
  }
}