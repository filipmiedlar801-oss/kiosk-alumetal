import hydroGrayLogo from '../../assets/hydro-gray-logo.png';
import hydroWhiteLogo from '../../assets/hydro-white-logo.png';

type Variant = 'gray' | 'white';

export default function HydroLogo({
  className = '',
  width,
  height = 36,
  variant = 'white',
}: {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: Variant;
}) {
  const src = variant === 'gray' ? hydroGrayLogo : hydroWhiteLogo;
  return (
    <img
      src={src}
      alt="Hydro"
      className={className}
      style={{
        width: width ?? 'auto',
        height,
        maxHeight: height,
        objectFit: 'contain',
      }}
    />
  );
}
