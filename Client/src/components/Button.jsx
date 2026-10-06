import { tw } from '../styles/tailwind.js'

const variants = {
  primary: tw.primaryButton,
  outline: tw.outlineButton,
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return <button className={`${variants[variant]} ${className}`} {...props}>{children}</button>
}
