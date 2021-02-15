declare module '@onfido/castor-react' {
  import { ButtonProps as BaseProps } from '@onfido/castor'
  type ButtonComponent = {
    (props: BaseProps & AnchorElementProps): JSX.Element
    (props: BaseProps & ButtonElementProps): JSX.Element
  }
  type AnchorElementProps = JSX.IntrinsicElements['a']
  type ButtonElementProps = JSX.IntrinsicElements['button']
  export type ButtonProps<T extends 'a' | 'button' = 'button'> = BaseProps &
    (T extends 'a' ? Omit<AnchorElementProps, 'role'> : ButtonElementProps)
  export const Button: ButtonComponent
}
