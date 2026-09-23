const PRODUCTION_WORK_HOSTS = new Set(['work.jstn.site', 'work-portfolio-v2.vercel.app'])

function hostnameFromHostHeader(host: string) {
  return host.split(',')[0].trim().split(':')[0].toLowerCase().replace(/\.$/, '')
}

export function getRequestHost(requestHeaders: Headers) {
  return requestHeaders.get('x-forwarded-host')?.split(',')[0].trim() || requestHeaders.get('host') || ''
}

export function isWorkSiteHost(host: string) {
  const hostname = hostnameFromHostHeader(host)
  return PRODUCTION_WORK_HOSTS.has(hostname) || isLocalWorkSiteHost(host)
}

function isLocalWorkSiteHost(host: string) {
  return hostnameFromHostHeader(host) === 'localhost' && host.trim().endsWith(':3001')
}

export function isProductionWorkSiteHost(host: string) {
  return isWorkSiteHost(host) && !isLocalWorkSiteHost(host)
}
