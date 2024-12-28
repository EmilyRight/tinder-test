type TButtonProps = {
  action: () => void;
  classNames: string;
  text: string;
  disabled: boolean;
};

function Button({ text, action, classNames, disabled }: TButtonProps) {
  return (
    <button onClick={action} className={classNames} disabled={disabled}>
      {text}
    </button>
  );
}

export default Button;
