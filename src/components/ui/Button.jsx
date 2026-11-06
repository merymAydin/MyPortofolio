import '../../styles/components/button.css'

const VARIANTS = {
  primary: 'button',
  quiet: 'button button--quiet',
}

/**
 * Shared button primitive.
 *
 * @param {Object} props
 * @param {'primary' | 'quiet'} [props.variant] - Visual weight.
 * @param {'button' | 'submit' | 'reset'} [props.type] - Native button type.
 * @param {string} [props.className] - Additional class names.
 * @param {import('react').ReactNode} props.children - Button label/content.
 */
export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const classes = [VARIANTS[variant] ?? VARIANTS.primary, className].filter(Boolean).join(' ')

  return (
    <button className={classes} type={type} {...rest}>
      {children}
    </button>
  )
}
