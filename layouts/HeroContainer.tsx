import defaults from '@/styles/Defaults.module.scss'

type Props = {
  title: string,
  description?: string
}

export const HeroContainer = ({ title, description }: Props) => (
  <div className={defaults.staticHeroContainer}>
    <h1 className={defaults.heroHeading}>{title}</h1>
    {description && (
      <p className={defaults.heroSubHeading}>{description}</p>
    )}
  </div>
)