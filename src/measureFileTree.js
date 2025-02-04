// @flow
import fs from 'mz/fs'
import { countRegExpMatches } from './regexpMetrics'
import { countEslintRuleViolations } from './eslintMetrics'

import type { FileMetrics, FilesMetricsMap, ReportSpec } from './config'

const measureFile = async (
  filePath: string,
  spec: ReportSpec,
): Promise<FileMetrics> => {
  const metrics = {}

  const contents = await fs.readFile(filePath, { encoding: 'utf8' })

  if (spec.regexpMetrics) {
    Object.assign(metrics, countRegExpMatches(contents, spec.regexpMetrics))
  }

  if (spec.eslintFlags) {
    Object.assign(
      metrics,
      countEslintRuleViolations(contents, spec.eslintFlags),
    )
  }

  return metrics
}

/**
 * Report metrics on every file within `dir`
 */
export default async function measureFileTree(
  dir: string,
  spec: ReportSpec,
  ignoredPaths: RegExp[],
): Promise<FilesMetricsMap> {
  console.log('Measuring directory', dir)

  const metrics: FilesMetricsMap = {}

  // consider https://github.com/jergason/recursive-readdir
  const files = (fs.readdirSync(dir) || []).filter(filename => !ignoredPaths.some(filepath => filename.match(filepath)));
  // Revisit this if perf is an issue.
  for (const file of files) {
    const subpath = `${dir}/${file}`
    if (fs.statSync(subpath).isDirectory()) {
      // eslint-disable-next-line no-await-in-loop
      const treeMetrics: FilesMetricsMap = await measureFileTree(subpath, spec, ignoredPaths)
      Object.assign(metrics, treeMetrics)
    } else if (spec.omit && subpath.match(spec.omit)) {
      console.log('  omitting file', subpath)
    } else {
      console.log('  measuring file', subpath)
      // eslint-disable-next-line no-await-in-loop
      const fileMetrics: FileMetrics = await measureFile(subpath, spec)
      metrics[subpath] = fileMetrics
    }
  }
  return metrics
}
