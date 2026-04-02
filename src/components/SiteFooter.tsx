import { IconGithub } from './icons'

export const REPO_URL = 'https://github.com/CodeByStella/CMC-token-research'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <a
        className="site-footer__repo"
        href={REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="site-footer__icon" aria-hidden>
          <IconGithub />
        </span>
        <span className="site-footer__name">CodeByStella / CMC-token-research</span>
      </a>
      <p className="site-footer__cta">
        If this helps your research, please{' '}
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="site-footer__star-link"
        >
          star the repository on GitHub
        </a>
        .
      </p>
    </footer>
  )
}
