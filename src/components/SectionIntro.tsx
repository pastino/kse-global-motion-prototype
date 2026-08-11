type SectionIntroProps = {
  index: string
  kicker: string
  title: string
  description: string
  light?: boolean
}

export function SectionIntro({ index, kicker, title, description, light }: SectionIntroProps) {
  return (
    <div className={light ? 'section-intro section-intro--light' : 'section-intro'} data-reveal>
      <div className="section-kicker">
        <span>{index}</span>
        <span>{kicker}</span>
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  )
}
