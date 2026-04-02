import type { ReactNode } from 'react'
import type { CmcUrls } from '../types/cmc'
import { firstHttp } from '../utils/url'
import {
  IconDoc,
  IconExplorer,
  IconFacebook,
  IconForum,
  IconGithub,
  IconGlobe,
  IconMegaphone,
  IconReddit,
  IconTelegram,
  IconTwitter,
} from './icons'

function IconButton({
  href,
  label,
  children,
}: {
  href: string
  label: string
  children: ReactNode
}) {
  return (
    <a
      className="link-icon-btn"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
    >
      <span className="link-icon-btn__glyph">{children}</span>
    </a>
  )
}

function buildSiteSocial(urls: CmcUrls): {
  site: { href: string; label: string; node: ReactNode }[]
  social: { href: string; label: string; node: ReactNode }[]
} {
  const site: { href: string; label: string; node: ReactNode }[] = []
  const social: { href: string; label: string; node: ReactNode }[] = []

  const w = firstHttp(urls.website)
  if (w) site.push({ href: w, label: 'Website', node: <IconGlobe /> })
  const ex = firstHttp(urls.explorer)
  if (ex) site.push({ href: ex, label: 'Block explorer', node: <IconExplorer /> })
  const td = firstHttp(urls.technical_doc)
  if (td) site.push({ href: td, label: 'Technical documentation', node: <IconDoc /> })
  const sc = firstHttp(urls.source_code)
  if (sc) site.push({ href: sc, label: 'Source code', node: <IconGithub /> })

  const tw = firstHttp(urls.twitter)
  if (tw) social.push({ href: tw, label: 'X (Twitter)', node: <IconTwitter /> })
  const rd = firstHttp(urls.reddit)
  if (rd) social.push({ href: rd, label: 'Reddit', node: <IconReddit /> })
  const fb = firstHttp(urls.facebook)
  if (fb) social.push({ href: fb, label: 'Facebook', node: <IconFacebook /> })
  const ch = firstHttp(urls.chat)
  if (ch) social.push({ href: ch, label: 'Chat', node: <IconTelegram /> })
  const an = firstHttp(urls.announcement)
  if (an)
    social.push({ href: an, label: 'Announcement', node: <IconMegaphone /> })
  const mb = firstHttp(urls.message_board)
  if (mb) social.push({ href: mb, label: 'Forum', node: <IconForum /> })

  return { site, social }
}

export interface TokenLinksProps {
  urls?: CmcUrls
  /** When true, show a small spinner instead of links (metadata still loading). */
  loading?: boolean
}

export function TokenLinks({ urls, loading }: TokenLinksProps) {
  if (loading) {
    return (
      <span className="link-spinner-wrap" title="Loading links…">
        <span className="link-spinner" aria-hidden />
      </span>
    )
  }

  const { site, social } = urls ? buildSiteSocial(urls) : { site: [], social: [] }

  const empty = site.length === 0 && social.length === 0

  if (empty) {
    return <span className="link-empty">—</span>
  }

  return (
    <div className="link-stack">
      {site.length > 0 ? (
        <div className="link-row">
          <span className="link-row__label">Site</span>
          <div className="link-row__icons">
            {site.map((s, i) => (
              <IconButton
                key={`site-${String(i)}-${s.label}-${s.href}`}
                href={s.href}
                label={s.label}
              >
                {s.node}
              </IconButton>
            ))}
          </div>
        </div>
      ) : null}
      {social.length > 0 ? (
        <div className="link-row">
          <span className="link-row__label">Social</span>
          <div className="link-row__icons">
            {social.map((s, i) => (
              <IconButton
                key={`social-${String(i)}-${s.label}-${s.href}`}
                href={s.href}
                label={s.label}
              >
                {s.node}
              </IconButton>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
