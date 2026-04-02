import type { ReactNode } from 'react'
import type { CmcUrls, MarketLink, TokenMarkets } from '../types/cmc'
import { firstHttp } from '../utils/url'
import {
  IconBuilding,
  IconDoc,
  IconExplorer,
  IconFacebook,
  IconForum,
  IconGithub,
  IconGlobe,
  IconMegaphone,
  IconReddit,
  IconSwap,
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

function MarketIconButton({ link, dex }: { link: MarketLink; dex: boolean }) {
  const title =
    link.pairLabel != null
      ? `${link.exchangeName} · ${link.pairLabel}`
      : link.exchangeName
  return (
    <a
      className="link-icon-btn"
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      title={title}
    >
      {link.logoUrl ? (
        <img
          className="link-icon-btn__logo"
          src={link.logoUrl}
          alt=""
          width={18}
          height={18}
          loading="lazy"
        />
      ) : (
        <span className="link-icon-btn__glyph">
          {dex ? <IconSwap /> : <IconBuilding />}
        </span>
      )}
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
  markets?: TokenMarkets
}

export function TokenLinks({ urls, markets }: TokenLinksProps) {
  const { site, social } = urls ? buildSiteSocial(urls) : { site: [], social: [] }

  const cex = markets?.cex ?? []
  const dex = markets?.dex ?? []

  const empty =
    site.length === 0 &&
    social.length === 0 &&
    cex.length === 0 &&
    dex.length === 0

  if (empty) {
    return <span className="link-empty">—</span>
  }

  return (
    <div className="link-stack">
      {site.length > 0 ? (
        <div className="link-row">
          <span className="link-row__label">Site</span>
          <div className="link-row__icons">
            {site.map((s) => (
              <IconButton key={s.href} href={s.href} label={s.label}>
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
            {social.map((s) => (
              <IconButton key={s.href} href={s.href} label={s.label}>
                {s.node}
              </IconButton>
            ))}
          </div>
        </div>
      ) : null}
      {cex.length > 0 ? (
        <div className="link-row">
          <span className="link-row__label">CEX</span>
          <div className="link-row__icons">
            {cex.map((m) => (
              <MarketIconButton key={m.url} link={m} dex={false} />
            ))}
          </div>
        </div>
      ) : null}
      {dex.length > 0 ? (
        <div className="link-row">
          <span className="link-row__label">DEX</span>
          <div className="link-row__icons">
            {dex.map((m) => (
              <MarketIconButton key={m.url} link={m} dex />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
