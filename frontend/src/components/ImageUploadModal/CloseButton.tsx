interface CloseButtonProps {
  color?: string;
  onClick?: () => void;
  className?: string; // 추가된 prop
}

export default function CloseButton({ color = 'currentColor', onClick, className }: CloseButtonProps): JSX.Element {
  return (
    <button
      className={`cursor-pointer border-none bg-none p-1 ${className}`}
      onClick={onClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line
          x1="18"
          y1="6"
          x2="6"
          y2="18"
        ></line>
        <line
          x1="6"
          y1="6"
          x2="18"
          y2="18"
        ></line>
      </svg>
    </button>
  );
}
