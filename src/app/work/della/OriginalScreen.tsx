import Image from 'next/image';
import s from './originals.module.css';

/** Only original uploaded screenshot crops. No reconstructed UI or live app action. */
export default function OriginalScreen({ src, alt, width, height, caption, testId, priority = false }: {
  src: string; alt: string; width: number; height: number; caption: string; testId: string; priority?: boolean;
}) {
  return <figure className={s.screen} data-testid={testId}>
    <a href={src} target="_blank" rel="noreferrer" aria-label={`Open original screenshot crop: ${alt}`}>
      <Image src={src} alt={alt} width={width} height={height} sizes="(max-width: 600px) calc(100vw - 44px), (max-width: 960px) 414px, 414px" unoptimized priority={priority} />
    </a>
    <figcaption><p>{caption}</p><a href={src} target="_blank" rel="noreferrer">Open image <span aria-hidden="true">&#8599;</span><span className={s.srOnly}> (opens in a new tab)</span></a></figcaption>
  </figure>;
}
