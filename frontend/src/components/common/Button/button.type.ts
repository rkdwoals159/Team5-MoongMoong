export type ButtonVariant = "primary" | "secondary";

export type ButtonSize = "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";

export type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
};

export type ButtonProps = ButtonOwnProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps>;

export type ButtonDataAttributes = {
  "data-variant": ButtonVariant;
  "data-size": ButtonSize;
  "data-full-width": "true" | "false";
};
