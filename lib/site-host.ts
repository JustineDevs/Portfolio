const PRODUCTION_WORK_HOSTS = new Set(['work.jstn.site'])

function hostnameFromHostHeader(host: string) {
  return host.split(':')[0].toLowerCase()
}

export function isWorkSiteHost(host: string) {
  const hostname = hostnameFromHostHeader(host)
  return PRODUCTION_WORK_HOSTS.has(hostname) || host.endsWith(':3001')
}

export function isProductionWorkSiteHost(host: string) {
  return PRODUCTION_WORK_HOSTS.has(hostnameFromHostHeader(host))
}
