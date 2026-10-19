export function StudioPassage({ reverse = false, contact = false }: { reverse?: boolean; contact?: boolean }) {
  return <div className={`im-material-passage${reverse ? ' im-passage-reverse' : ''}${contact ? ' im-passage-contact' : ''}`} aria-hidden="true"><svg viewBox="0 0 1440 100" preserveAspectRatio="none"><path d="M0 100V72C310 72 500 3 760 20s420 80 680 16v64Z" /><path d="M0 100V92C400 92 546 27 832 46s390 60 608 14v40Z" /></svg></div>
}
